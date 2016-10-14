/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.web.filesystem.hdfs;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.SystemUtils;
import org.apache.hadoop.fs.ContentSummary;
import org.exem.flamingo.agent.nn.Namenode2AgentService;
import org.exem.flamingo.agent.nn.hdfs.HdfsFileInfo;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.model.rest.FileInfo;
import org.exem.flamingo.shared.util.FileUtils;
import org.exem.flamingo.shared.util.zookeeper.ZkHaUtils;
import org.exem.flamingo.web.configuration.ConfigurationHelper;
import org.exem.flamingo.web.filesystem.FileSystemService;
import org.exem.flamingo.web.remote.RemoteInvocation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.*;

@Service
public class HdfsFileSystemServiceImpl extends RemoteInvocation implements FileSystemService {

    public static final String NAMENODE_SERVICE = "namenode2";

    private Namenode2AgentService namenode2AgentService;

    private final String[] COLORS = {"#3194FC","#2BE0F9","#26F7BE","#20F467","#26F21A","#76FE15","#C8EC0F","#EAB60A","#E75A05","#E50002"};

    private int MAX_RANGE_COUNT = 10;

    @Value("#{hadoop['namenode.agent.address']}")
    private String namenodeAgentAddress;

    @Value("#{hadoop['namenode.agent.port']}")
    private String namenodeAgentPort;

    @Value("#{hadoop['namenode.agent.ha']}")
    private Boolean namenodeHa;

    @Value("#{hadoop['zookeeper.quorum']}")
    private String zookeeperQuorum;

    @Value("#{hadoop['namenode.agent.znode']}")
    private String namenodeZnode;

    @Autowired
    ConfigurationHelper configurationHelper;

    @Autowired
    HdfsBrowserRepository repository;

    /**
     * SLF4J Logging
     */
    private static Logger logger = LoggerFactory.getLogger(HdfsFileSystemServiceImpl.class);

    @Override
    public List<FileInfo> getDirectories(String path, boolean directoryOnly) {
        namenode2AgentService = getNamenode2AgentService();
        return namenode2AgentService.list(path, true);
    }

    @Override
    public List<FileInfo> getFiles(String path) {
        namenode2AgentService = getNamenode2AgentService();
        return namenode2AgentService.list(path, false);
    }

    @Override
    public Map getListPage(String path, int page, int start, int limit, String filter) throws IOException {
        namenode2AgentService = getNamenode2AgentService();
        return namenode2AgentService.getListPage(path, page, start, limit, filter);
    }

    @Override
    public Map getTopN(String path, int limit) throws IOException {
        namenode2AgentService = getNamenode2AgentService();
        Map topMap = namenode2AgentService.getTopN(path, limit, true);
        Map resultMap = new HashMap();
        Map params = new HashMap();
        List<Map> resultList = new ArrayList<>();
        List<FileInfo> fileList = (List<FileInfo>) topMap.get("dirList");
        List<Map> legendList = new ArrayList<>();

        params.put("path", path);

        Map maxMap = repository.select(params);

        long max = 0;
        long min = 0;
        int add = 0;

        if (maxMap == null) {
            max = Long.parseLong(topMap.get("max").toString());
            min = Long.parseLong(topMap.get("min").toString());
        }
        else {
            long max_value = Long.parseLong(maxMap.get("max_value").toString());
            switch (maxMap.get("unit").toString()) {
                case "Byte":
                    max = max_value;
                    break;
                case "KB":
                    max = max_value * FileUtils.KB;
                    break;
                case "MB":
                    max = max_value * FileUtils.MB;
                    break;
                case "GB":
                    max = max_value * FileUtils.GB;
                    break;
                case "TB":
                    max = max_value * FileUtils.TB;
                    break;
            }

            min = 0;
            add = 1;
        }


        long diff = (max - min) / MAX_RANGE_COUNT;
        long div = 0;
        int i;

        Map fileMap = null;
        for (FileInfo fileInfo : fileList) {
            fileMap = new HashMap();

            if (fileInfo.getLength() - min == 0) {
                div = 0;
            }
            else {
                div = ((fileInfo.getLength() - min) / diff);
            }

            if (div >= MAX_RANGE_COUNT) {
                div = MAX_RANGE_COUNT - 1;
            }

            fileMap.put("name", fileInfo.getFilename());
            fileMap.put("value", fileInfo.getLength());
            fileMap.put("color", COLORS[(int)div]);
            fileMap.put("fullyQualifiedPath", fileInfo.getFullyQualifiedPath());

            resultList.add(fileMap);
        }

        Map legendMap = null;
        for (i = 0; i < MAX_RANGE_COUNT; i++) {
            legendMap = new HashMap();

            if (i == 0) {
                legendMap.put("isFirst", true);
                legendMap.put("color", COLORS[i]);
                legendMap.put("value", (i + 1 + add) * diff + min);
            }
            else {
                legendMap.put("isFirst", false);
                legendMap.put("color", COLORS[i]);
                legendMap.put("value", (i + add) * diff + min);
            }

            legendList.add(legendMap);
        }

        resultMap.put("fileList", resultList);
        resultMap.put("legendList", legendList);
        resultMap.put("max", maxMap);

        return resultMap;
    }

    @Override
    public ContentSummary getContentSummary(String path) throws IOException {
        namenode2AgentService = getNamenode2AgentService();
        return namenode2AgentService.getContentSummary(path);
    }

    @Override
    public boolean createDirectory(String path, String username) {
        validateForbiddenPath(path);
        namenode2AgentService = getNamenode2AgentService();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.CREATE, FileType.DIRECTORY, RequestType.UI, path, "", 0);
        return namenode2AgentService.mkdir(path, username);
    }

    @Override
    public boolean copyDirectory(String currentPath, String dstPath, String username) {
        validateForbiddenPath(currentPath);
        namenode2AgentService = getNamenode2AgentService();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.COPY, FileType.DIRECTORY, RequestType.UI, currentPath, dstPath, 0);
        return namenode2AgentService.copy(currentPath, dstPath, username);
    }

    @Override
    public boolean moveDirectory(String currentPath, String dstPath, String username) {
        validateForbiddenPath(currentPath);
        namenode2AgentService = getNamenode2AgentService();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.MOVE, FileType.DIRECTORY, RequestType.UI, currentPath, dstPath, 0);
        return namenode2AgentService.move(currentPath, dstPath);
    }

    @Override
    public boolean renameDirectory(String currentPath, String directoryName, String username) {
        validateForbiddenPath(currentPath);
        namenode2AgentService = getNamenode2AgentService();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.RENAME, FileType.DIRECTORY, RequestType.UI, currentPath, directoryName, 0);
        return namenode2AgentService.rename(currentPath, directoryName);
    }


    @Override
    public boolean deleteDirectory(String currentPath, String username) {
        validateForbiddenPath(currentPath);
        namenode2AgentService = getNamenode2AgentService();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.DELETE, FileType.DIRECTORY, RequestType.UI, currentPath, "", 0);
        return namenode2AgentService.delete(currentPath);
    }

    @Override
    public boolean mergeFiles(String currentPath, String dstPath, String username) {
        validateForbiddenPath(currentPath);
        namenode2AgentService = getNamenode2AgentService();
        long length = getFileInfo(currentPath).getLength();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.MERGE, FileType.FILE, RequestType.UI, currentPath, dstPath, length);
        return namenode2AgentService.merge(currentPath, dstPath, username);
    }

    @Override
    public HdfsFileInfo getFileInfo(String srcPath) {
        namenode2AgentService = getNamenode2AgentService();
        return namenode2AgentService.getFileInfo(srcPath);
    }

    @Override
    public boolean setPermission(Map permissionMap, String username) {
        String srcPath = (String) permissionMap.get("currentPath");
        validateForbiddenPath(srcPath);
        namenode2AgentService = getNamenode2AgentService();
        String fileStatus = (String) permissionMap.get("fileStatus");
        String files = (String) permissionMap.get("files");
        String[] fileArray = files.split(",");
        String names = (String) permissionMap.get("fileNames");
        String[] fileNames = names.split(",");
        List<String> fileList = new ArrayList<>();
        String multiFiles;
        short logCount = 0;
        boolean changed = false;

        if (fileStatus.equalsIgnoreCase("DIRECTORY")) {
            //TODO Audit 서비스
            //auditService.log(username, FileSystemType.HDFS, AuditType.PERMISSION, FileType.DIRECTORY, RequestType.UI, srcPath, "", 0);
            changed = namenode2AgentService.setPermission(permissionMap);
        } else {
            long length;

            if (fileArray.length > 1) {
                permissionMap.put("fileListSize", String.valueOf(fileArray.length));

                for (String file : fileArray) {
                    permissionMap.put("file", file);
                    changed = namenode2AgentService.setPermission(permissionMap);
                }

                for (String fileName : fileNames) {
                    logCount++;
                    fileList.add(fileName);

                    if (logCount == 10) {
                        fileList.clear();
                        logCount = 0;
                    }
                }

                //TODO Audit 서비스
                //multiFiles = srcPath + SystemUtils.FILE_SEPARATOR + StringUtils.join(fileList, ",");
                //auditService.log(username, FileSystemType.HDFS, AuditType.PERMISSION, FileType.FILE, RequestType.UI, multiFiles, "", 0);
            } else {
                permissionMap.put("file", fileArray[0]);
                length = getFileInfo(fileArray[0]).getLength();
                //TODO Audit 서비스
                //auditService.log(username, FileSystemType.HDFS, AuditType.PERMISSION, FileType.FILE, RequestType.UI, fileArray[0], "", length);
                changed = namenode2AgentService.setPermission(permissionMap);
            }
        }

        return changed;
    }

    @Override
    public List<String> copyFiles(List<String> srcFileList, String dstPath, String username) {
        validateForbiddenPath(dstPath);
        namenode2AgentService = getNamenode2AgentService();
        List<String> copiedFiles = new ArrayList<>();
        String dstFilePath;
        long length;
        boolean copied;

        // TODO > Bulk insert 시 executeBatch 쿼리 체크
        if (srcFileList.size() > 1) {
            for (String srcFilePath : srcFileList) {

                if (dstPath.equalsIgnoreCase("/")) {
                    dstFilePath = dstPath + FileUtils.getFilename(srcFilePath);
                } else {
                    dstFilePath = dstPath + SystemUtils.FILE_SEPARATOR + FileUtils.getFilename(srcFilePath);
                }

                copied = namenode2AgentService.copy(srcFilePath, dstFilePath, username);

                if (copied) {
                    copiedFiles.add(srcFilePath);
                }

                length = getFileInfo(srcFilePath).getLength();
                //TODO Audit 서비스
                //auditService.log(username, FileSystemType.HDFS, AuditType.COPY, FileType.FILE, RequestType.UI, srcFilePath, dstFilePath, length);
            }
        } else {
            String srcPath = srcFileList.get(0);

            if (dstPath.equalsIgnoreCase("/")) {
                dstFilePath = dstPath + FileUtils.getFilename(srcPath);
            } else {
                dstFilePath = dstPath + SystemUtils.FILE_SEPARATOR + FileUtils.getFilename(srcPath);
            }

            copied = namenode2AgentService.copy(srcPath, dstFilePath, username);

            if (copied) {
                copiedFiles.add(srcPath);
            }

            length = getFileInfo(srcPath).getLength();
            //TODO Audit 서비스
            //auditService.log(username, FileSystemType.HDFS, AuditType.COPY, FileType.FILE, RequestType.UI, srcPath, dstPath, length);
        }

        return copiedFiles;
    }

    @Override
    public List<String> moveFiles(List<String> srcFileList, String dstPath, String username) {
        validateForbiddenPath(dstPath);
        namenode2AgentService = getNamenode2AgentService();
        List<String> movedFiles = new ArrayList<>();
        String dstFilePath;
        long length;
        boolean moved;

        /**
         * Case 1. 멀티 파일 복사
         * Case 2. 단일 파일 복사
         */
        if (srcFileList.size() > 1) {
            for (String srcFilePath : srcFileList) {
                if (dstPath.equalsIgnoreCase("/")) {
                    dstFilePath = dstPath + FileUtils.getFilename(srcFilePath);
                } else {
                    dstFilePath = dstPath + SystemUtils.FILE_SEPARATOR + FileUtils.getFilename(srcFilePath);
                }

                length = getFileInfo(srcFilePath).getLength();
                moved = namenode2AgentService.move(srcFilePath, dstFilePath);

                if (moved) {
                    movedFiles.add(srcFilePath);
                }

                //TODO Audit 서비스
                //auditService.log(username, FileSystemType.HDFS, AuditType.MOVE, FileType.FILE, RequestType.UI, srcFilePath, dstFilePath, length);
            }
        } else {
            String srcPath = srcFileList.get(0);

            if (dstPath.equalsIgnoreCase("/")) {
                dstFilePath = dstPath + FileUtils.getFilename(srcPath);
            } else {
                dstFilePath = dstPath + SystemUtils.FILE_SEPARATOR + FileUtils.getFilename(srcPath);
            }

            moved = namenode2AgentService.move(srcPath, dstFilePath);

            if (moved) {
                movedFiles.add(srcPath);
            }

            //TODO Audit 서비스
            //length = getFileInfo(srcPath).getLength();
            //auditService.log(username, FileSystemType.HDFS, AuditType.MOVE, FileType.FILE, RequestType.UI, srcPath, dstFilePath, length);
        }

        return movedFiles;
    }

    @Override
    public boolean renameFile(String fullyQualifiedPath, String srcPath, String filename, String username) {
        validateForbiddenPath(srcPath);
        namenode2AgentService = getNamenode2AgentService();
        long length = getFileInfo(srcPath).getLength();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.RENAME, FileType.FILE, RequestType.UI, srcPath, "", length);
        return namenode2AgentService.rename(fullyQualifiedPath, filename);
    }

    @Override
    public List<String> deleteFiles(String srcPath, String files, String username) {
        validateForbiddenPath(srcPath);
        namenode2AgentService = getNamenode2AgentService();
        String[] fromItems = files.split(",");
        List<String> fileList = new ArrayList<>();
        List<String> deletedFiles = new ArrayList<>();
        boolean deleted;

        Collections.addAll(fileList, fromItems);

        for (String filePath : fileList) {
            //TODO Audit 서비스
            //long length = getFileInfo(filePath).getLength();
            //auditService.log(username, FileSystemType.HDFS, AuditType.DELETE, FileType.FILE, RequestType.UI, filePath, "", length);
            deleted = namenode2AgentService.delete(filePath);

            if (deleted) {
                deletedFiles.add(filePath);
            }
        }

        return deletedFiles;
    }

    @Override
    public boolean save(String pathToUpload, String fullyQualifiedPath, byte[] content, String username) {
        validateForbiddenPath(pathToUpload);
        namenode2AgentService = getNamenode2AgentService();
        long length = content.length;

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.UPLOAD, FileType.FILE, RequestType.UI, fullyQualifiedPath, "", length);
        return namenode2AgentService.save(pathToUpload, fullyQualifiedPath, content, username);
    }

    @Override
    public void validateBeforeUpload(String pathToUpload, String fullyQualifiedPath, byte[] content, String username) {
        long length = content.length;

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.UPLOAD, FileType.FILE, RequestType.UI, fullyQualifiedPath, "", length);
    }

    @Override
    public byte[] load(String srcFilePath, String fullyQualifiedPath, String username) {
        validateForbiddenPath(srcFilePath);
        namenode2AgentService = getNamenode2AgentService();
        long length = getFileInfo(fullyQualifiedPath).getLength();

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.DOWNLOAD, FileType.FILE, RequestType.UI, fullyQualifiedPath, "", length);
        return namenode2AgentService.load(fullyQualifiedPath);
    }

    @Override
    public Map viewFileContents(Map fileContestsMap, String username) {
        namenode2AgentService = getNamenode2AgentService();

        //TODO Audit 서비스
        /*String filePath = (String) fileContestsMap.get("filePath");
        long length = getFileInfo(filePath).getLength();
        boolean auditLogKey = (boolean) fileContestsMap.get("auditLogKey");

        if (auditLogKey) {
            auditService.log(username, FileSystemType.HDFS, AuditType.VIEW, FileType.FILE, RequestType.UI, filePath, "", length);
        }*/

        return namenode2AgentService.view(fileContestsMap);
    }

    @Override
    public boolean createHdfsUserHome(String hdfsUserHome, String username) {
        namenode2AgentService = getNamenode2AgentService();
        Map hdfsUserMap = new HashMap();
        hdfsUserMap.put("hdfsUserHome", hdfsUserHome + "/" + username);
        hdfsUserMap.put("username", username);
        hdfsUserMap.put("group", username);

        return namenode2AgentService.createUserHome(hdfsUserMap);
    }

    @Override
    public boolean deleteHdfsUserHome(String hdfsUserHome) {
        namenode2AgentService = getNamenode2AgentService();
        validateForbiddenPath(hdfsUserHome);

        return namenode2AgentService.deleteUserHome(hdfsUserHome);
    }

    @Override
    public boolean copyToLocal(String srcFullyQualifiedPath, String linuxUserHome, String username) {
        namenode2AgentService = getNamenode2AgentService();
        validateForbiddenPath(FileUtils.getPath(srcFullyQualifiedPath));

        //long length = getFileInfo(srcFullyQualifiedPath).getLength();

        String dstFullyQualifiedPath = linuxUserHome + SystemUtils.FILE_SEPARATOR + FileUtils.getDirectoryName(srcFullyQualifiedPath);

        //TODO Audit 서비스
        //auditService.log(username, FileSystemType.HDFS, AuditType.COPY_TO_LOCAL, FileType.FILE, RequestType.UI, srcFullyQualifiedPath, "", length);
        return namenode2AgentService.copyToLocal(srcFullyQualifiedPath, dstFullyQualifiedPath, linuxUserHome, username);
    }

    @Override
    public void validatePath(String path) {
        validateForbiddenPath(path);
    }

    @Override
    public void validateBeforeDownload(String srcFilePath, String fullyQualifiedPath, String username) {
        //TODO Audit 서비스
        //long length = getFileInfo(fullyQualifiedPath).getLength();

        //auditService.log(username, FileSystemType.HDFS, AuditType.DOWNLOAD, FileType.FILE, RequestType.UI, fullyQualifiedPath, "", length);
    }

    /**
     * 선택한 경로가 쓰기 금지 목록에 포함되는지 검증한다.
     *
     * @param path 디렉토리 경로
     */
    private void validateForbiddenPath(String path) {
        String[] paths = StringUtils.splitPreserveAllTokens(configurationHelper.get("hdfs.delete.forbidden.paths"), ",");
        AntPathMatcher antPathMatcher = new AntPathMatcher();

        for (String pathToValid : paths) {
            boolean isMatch = antPathMatcher.match(path, pathToValid);
            if (isMatch) {
                throw new ServiceException("A directory is contained in the banned directory list.");
            }
        }
    }

    /**
     * Namenode Agent의 JVM에 배포되어 있는 Namenode Agent의 서비스를 획득한다.
     *
     * @return {@link org.exem.flamingo.agent.nn.Namenode2AgentService}
     */
    private Namenode2AgentService getNamenode2AgentService() {
        String remoteServiceUrl;

        if (namenodeHa.booleanValue()) {
            remoteServiceUrl = this.getRemoteServiceUrl(ZkHaUtils.getActiveNnHost(zookeeperQuorum, namenodeZnode), Integer.parseInt(namenodeAgentPort), NAMENODE_SERVICE);
        }
        else {
            remoteServiceUrl = this.getRemoteServiceUrl(namenodeAgentAddress, Integer.parseInt(namenodeAgentPort), NAMENODE_SERVICE);
        }

        return this.getRemoteService(remoteServiceUrl, Namenode2AgentService.class);
    }
}
