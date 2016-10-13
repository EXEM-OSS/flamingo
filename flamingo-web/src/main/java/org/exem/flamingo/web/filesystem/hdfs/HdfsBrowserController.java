/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.exem.flamingo.web.filesystem.hdfs;

import org.apache.commons.lang.SystemUtils;
import org.apache.hadoop.security.authorize.Service;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.InputStreamEntity;
import org.codehaus.jackson.map.ObjectMapper;
import org.exem.flamingo.agent.nn.hdfs.HdfsFileInfo;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.exception.WholeBodyException;
import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.shared.core.security.SessionUtils;
import org.exem.flamingo.shared.model.rest.FileInfo;
import org.exem.flamingo.shared.util.FileUtils;
import org.exem.flamingo.web.filesystem.FileSystemService;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.exem.flamingo.shared.util.StringUtils.isEmpty;


/**
 * File System Browser REST Controller
 *
 * @author Myeongha KIM
 * @since 2.0
 */
@RestController
@RequestMapping("/fs/hdfs")
public class HdfsBrowserController  {

    private String isRemote = "false";

    @Autowired
    HttpClient httpClient;

    @Autowired
    FileSystemService fileSystemService;

    @Autowired
    HdfsBrowserService hdfsBrowserService;

    @Value("#{config['user.home.hdfs.path']}")
    private String hadoopUserHome;

    @Value("#{config['user.home.linux.path']}")
    private String defaultLinuxUserHome;

    @Value("#{hadoop['namenode.agent.address']}")
    private String namenodeAgentAddress;

    @Value("#{hadoop['namenode.agent.port']}")
    private String namenodeAgentPort;

    /**
     * 디렉토리 목록을 조회한다.
     *
     * @param node        HDFS Tree Node
     * @return directories
     */
    @RequestMapping(value = "directory", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response directory(@RequestParam(defaultValue = "/") String node) {
        String username = getSessionUsername();
        String path = getPathFilter(node);
        List<FileInfo> directories = fileSystemService.getDirectories(path, true);
        Response response = new Response();

        if (path.equalsIgnoreCase(hadoopUserHome) && getSessionUserLevel() != 1) {
            String filter = hadoopUserHome + SystemUtils.FILE_SEPARATOR + username;
            List<FileInfo> userHomeDirectory = new ArrayList<>();
            for (FileInfo directory : directories) {
                if (directory.getFullyQualifiedPath().equalsIgnoreCase(filter)) {
                    userHomeDirectory.add(0, directory);
                    break;
                }
            }
            response.getList().addAll(userHomeDirectory);
        } else {
            response.getList().addAll(directories);
        }

        response.setSuccess(true);
        return response;
    }

    /**
     * HDFS 파일, 디렉토리 목록을 조회한다.
     *
     * @param node        Tree Node
     * @return files
     */
    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response list(@RequestParam(defaultValue = "/") String node,
                         @RequestParam int page,
                         @RequestParam int start,
                         @RequestParam int limit,
                         @RequestParam String filter) {
        Response response = new Response();
        try {

            String path = getPathFilter(node);
            Map filesMap = fileSystemService.getListPage(path, page, start, limit, filter);
            List<FileInfo> files = (List<FileInfo>) filesMap.get("fileInfoList");

            if (filesMap.get("parentFileInfo") != null) {
                HdfsFileInfo parentFileInfo = (HdfsFileInfo) filesMap.get("parentFileInfo");

                parentFileInfo.setFilename("<i class=\"fa fa-level-up\" aria-hidden=\"true\"></i>");
                parentFileInfo.setPath(".");

                response.getList().add(parentFileInfo);
            }

            response.setSuccess(true);
            response.getList().addAll(files);
            response.setTotal(Integer.parseInt(filesMap.get("total").toString()));
            return response;
        } catch (Exception ex) {
            throw new ServiceException(ex);
        }
    }

    /**
     * HDFS 파일, 디렉토리 목록을 조회한다.
     *
     * @param node        Tree Node
     * @return files
     */
    @RequestMapping(value = "topN", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response topN(@RequestParam(defaultValue = "/") String node,
                         @RequestParam int limit) {
        Response response = new Response();
        try {

            String path = getPathFilter(node);

            response.setSuccess(true);
            Map resultMap = fileSystemService.getTopN(path, limit);
            List<Map> fileList = (List<Map>) resultMap.get("fileList");
            response.getList().addAll(fileList);
            response.getMap().put("legend", resultMap.get("legendList"));
            response.getMap().put("max", resultMap.get("max"));
            response.setTotal(response.getList().size());
            return response;
        } catch (Exception ex) {
            throw new ServiceException(ex);
        }
    }

    /**
     * 디렉토리를 생성한다.
     *
     * @param dirMap 디렉토리 생성에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "createDirectory", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response createDirectory(@RequestBody Map<String, String> dirMap) {

        Response response = new Response();

        try {
            String username = getSessionUsername();
            String currentPath = getPathFilter(dirMap.get("currentPath"));
            String directoryName = dirMap.get("directoryName");

            //TODO HDFS권한관리는 차후에 추가될 예정
            //List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
            //String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);
            String dirDstPath;

            if (currentPath.equalsIgnoreCase("/")) {
                dirDstPath = currentPath + directoryName;
            } else {
                dirDstPath = currentPath + SystemUtils.FILE_SEPARATOR + directoryName;
            }

            //TODO HDFS 권한관리는 차후에 추가될 예정
/*          dirMap.put("username", username);
            dirMap.put("hdfsPathPattern", hdfsPathPattern);
            dirMap.put("condition", "createDir");

            hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(dirMap);*/
            boolean created = fileSystemService.createDirectory(dirDstPath, username);


            response.setSuccess(created);
        } catch (Exception ex) {
            response.setSuccess(false);
            response.getError().setMessage(ex.getMessage());
        }

        return response;
    }

    /**
     * 디렉토리를 복사한다.
     *
     * @param dirMap 디렉토리 복사에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "copyDirectory", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response copyDirectory(@RequestBody Map<String, String> dirMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(dirMap.get("currentPath"));
        String dstPath = getPathFilter(dirMap.get("dstPath"));
        String directoryName = FileUtils.getDirectoryName(currentPath);
        String filter = hadoopUserHome + SystemUtils.FILE_SEPARATOR + username;
        int userLevel = getSessionUserLevel();

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*hdfsBrowserAuthService.validateHdfsHomeWritePermission(currentPath, filter, userLevel);
        List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);*/
        String dirDstPath;

        if (dstPath.equalsIgnoreCase("/")) {
            dirDstPath = dstPath + directoryName;
        } else {
            dirDstPath = dstPath + SystemUtils.FILE_SEPARATOR + directoryName;
        }

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*dirMap.put("username", username);
        dirMap.put("hdfsPathPattern", hdfsPathPattern);
        dirMap.put("condition", "copyDir");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(dirMap);*/
        boolean copied = fileSystemService.copyDirectory(currentPath, dirDstPath, username);

        Response response = new Response();
        response.setSuccess(copied);
        return response;
    }

    /**
     * 디렉토리를 이동한다.
     *
     * @param dirMap 디렉토리 이동에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "moveDirectory", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response moveDirectory(@RequestBody Map<String, String> dirMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(dirMap.get("currentPath"));
        String dstPath = getPathFilter(dirMap.get("dstPath"));
        String directoryName = FileUtils.getDirectoryName(currentPath);
        String filter = hadoopUserHome + SystemUtils.FILE_SEPARATOR + username;
        int userLevel = getSessionUserLevel();

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*hdfsBrowserAuthService.validateHdfsHomeWritePermission(currentPath, filter, userLevel);
        List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);*/
        String dirDstPath;

        if (dstPath.equalsIgnoreCase("/")) {
            dirDstPath = dstPath + directoryName;
        } else {
            dirDstPath = dstPath + SystemUtils.FILE_SEPARATOR + directoryName;
        }

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*dirMap.put("username", username);
        dirMap.put("hdfsPathPattern", hdfsPathPattern);
        dirMap.put("condition", "moveDir");
        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(dirMap);*/

        boolean moved = fileSystemService.moveDirectory(currentPath, dirDstPath, username);

        Response response = new Response();
        response.setSuccess(moved);
        return response;
    }

    /**
     * 디렉토리명을 변경한다.
     *
     * @param dirMap 디렉토리명 변경에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "renameDirectory", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response renameDirectory(@RequestBody Map<String, String> dirMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(dirMap.get("currentPath"));
        String directoryName = dirMap.get("directoryName");
        String filter = hadoopUserHome + SystemUtils.FILE_SEPARATOR + username;
        int userLevel = getSessionUserLevel();

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*hdfsBrowserAuthService.validateHdfsHomeWritePermission(currentPath, filter, userLevel);
        List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        dirMap.put("username", username);
        dirMap.put("hdfsPathPattern", hdfsPathPattern);
        dirMap.put("condition", "renameDir");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(dirMap);*/
        boolean renamed = fileSystemService.renameDirectory(currentPath, directoryName, username);

        Response response = new Response();
        response.setSuccess(renamed);
        return response;
    }

    /**
     * 디렉토리를 삭제한다.
     *
     * @param dirMap 디렉토리 삭제에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "deleteDirectory", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response deleteDirectory(@RequestBody Map<String, String> dirMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(dirMap.get("currentPath"));
        String filter = hadoopUserHome + SystemUtils.FILE_SEPARATOR + username;
        int userLevel = getSessionUserLevel();

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*hdfsBrowserAuthService.validateHdfsHomeWritePermission(currentPath, filter, userLevel);
        List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        dirMap.put("username", username);
        dirMap.put("hdfsPathPattern", hdfsPathPattern);
        dirMap.put("condition", "deleteDir");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(dirMap);*/
        boolean deleted = fileSystemService.deleteDirectory(currentPath, username);

        Response response = new Response();
        response.setSuccess(deleted);
        return response;
    }

    /**
     * 파일을 병합한다.
     *
     * @param dirMap 파일 병합에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "mergeFiles", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response mergeFiles(@RequestBody Map<String, String> dirMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(dirMap.get("currentPath"));
        String dstPath = getPathFilter(dirMap.get("dstPath"));

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        dirMap.put("username", username);
        dirMap.put("hdfsPathPattern", hdfsPathPattern);
        dirMap.put("condition", "mergeDir");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(dirMap);*/
        boolean merged = fileSystemService.mergeFiles(currentPath, dstPath, username);

        Response response = new Response();
        response.setSuccess(merged);
        return response;
    }

    /**
     * 디렉토리 정보를 확인한다.
     *
     * @param currentPath 파일 경로
     * @return 디렉토리 정보
     */
    @RequestMapping(value = "getDirectoryInfo", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getDirectoryInfo(@RequestParam String currentPath) {

        try {
            String currentDirPath = getPathFilter(currentPath);
            HdfsFileInfo fileInfo = fileSystemService.getFileInfo(currentDirPath);
            Map infoMap = new HashMap();
            // Basic
            infoMap.put("name", fileInfo.getFilename());
            infoMap.put("path", fileInfo.getFullyQualifiedPath());
            infoMap.put("length", fileInfo.getLength());
            infoMap.put("modification", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(fileInfo.getModificationTime())));
            infoMap.put("isFile", fileInfo.isFile());
            infoMap.put("isDirectory", fileInfo.isDirectory());
            infoMap.put("owner", fileInfo.getOwner());
            infoMap.put("group", fileInfo.getGroup());

            // Permission
            infoMap.put("ownerRead", fileInfo.getPermission().charAt(0) != '-');
            infoMap.put("ownerWrite", fileInfo.getPermission().charAt(1) != '-');
            infoMap.put("ownerExecute", fileInfo.getPermission().charAt(2) != '-');
            infoMap.put("groupRead", fileInfo.getPermission().charAt(3) != '-');
            infoMap.put("groupWrite", fileInfo.getPermission().charAt(4) != '-');
            infoMap.put("groupExecute", fileInfo.getPermission().charAt(5) != '-');
            infoMap.put("otherRead", fileInfo.getPermission().charAt(6) != '-');
            infoMap.put("otherWrite", fileInfo.getPermission().charAt(7) != '-');
            infoMap.put("otherExecute", fileInfo.getPermission().charAt(8) != '-');

            // Space
            infoMap.put("blockSize", fileInfo.getBlockSize());
            infoMap.put("replication", fileInfo.getReplication());
            infoMap.put("directoryCount", fileInfo.getDirectoryCount());
            infoMap.put("fileCount", fileInfo.getFileCount());
            infoMap.put("quota", fileInfo.getQuota());
            infoMap.put("spaceConsumed", fileInfo.getSpaceConsumed());
            infoMap.put("spaceQuota", fileInfo.getSpaceQuota());

            Response response = new Response();
            response.getMap().putAll(infoMap);
            response.setSuccess(true);
            return response;
        } catch (Exception ex) {
            throw new ServiceException("Could not get directory information", ex.getCause());
        }
    }

    /**
     * 선택한 경로를 포함한 하위 모든 디렉토리 및 파일의 권한을 변경한다.
     *
     * @param permissionMap 권한 변경에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "setPermission", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response setPermission(@RequestBody Map permissionMap) {

        String username = getSessionUsername();
        String currentPath = getPathFilter((String) permissionMap.get("currentPath"));
        String fileStatus = (String) permissionMap.get("fileStatus");

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        permissionMap.put("username", username);
        permissionMap.put("hdfsPathPattern", hdfsPathPattern);

        if (fileStatus.equalsIgnoreCase("DIRECTORY")) {
            permissionMap.put("condition", "permissionDir");
        } else {
            permissionMap.put("condition", "permissionFile");
        }

        permissionMap.put("currentPath", currentPath); // 권한을 변경할 디렉토리 또는 파일의 경로 업데이트

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(permissionMap);*/
        boolean changed = fileSystemService.setPermission(permissionMap, username);

        Response response = new Response();
        response.setSuccess(changed);
        return response;
    }

    /**
     * 파일을 복사한다.
     *
     * @param fileMap 파일 복사에 필요한 정보
     * @return 복사한 파일 목록
     */
    @RequestMapping(value = "copyFiles", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response copyFiles(@RequestBody Map<String, String> fileMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(fileMap.get("currentPath"));
        String files = fileMap.get("files");
        String dstPath = getPathFilter(fileMap.get("dstPath"));
        String[] fromItems = files.split(",");
        List<String> srcFileList = new ArrayList<>();
        Collections.addAll(srcFileList, fromItems);

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "copyFile");

        hdfsBrowserAuthService.getHdfsBrowserUserFileAuth(fileMap);*/
        List<String> copiedFiles = fileSystemService.copyFiles(srcFileList, dstPath, username);

        Response response = new Response();
        response.getList().addAll(copiedFiles);
        response.setSuccess(true);
        return response;
    }

    /**
     * 파일을 이동한다.
     *
     * @param fileMap 파일 이동에 필요한 정보
     * @return 이동된 파일 목록
     */
    @RequestMapping(value = "moveFiles", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response moveFiles(@RequestBody Map<String, String> fileMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(fileMap.get("currentPath"));
        String files = fileMap.get("files");
        String dstPath = getPathFilter(fileMap.get("dstPath"));
        String[] fromItems = files.split(",");
        List<String> srcFileList = new ArrayList<>();
        Collections.addAll(srcFileList, fromItems);

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "moveFile");

        hdfsBrowserAuthService.getHdfsBrowserUserFileAuth(fileMap);*/
        List<String> movedFiles = fileSystemService.moveFiles(srcFileList, dstPath, username);
        Response response = new Response();
        response.getList().addAll(movedFiles);
        response.setSuccess(true);
        return response;
    }

    /**
     * 파일명을 변경한다.
     *
     * @param fileMap 파일명 변경에 필요한 정보
     * @return True or False
     */
    @RequestMapping(value = "renameFile", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response renameFile(@RequestBody Map<String, String> fileMap) {
        String username = getSessionUsername();
        String srcPath = getPathFilter(fileMap.get("srcPath"));
        String fullyQualifiedPath = getPathFilter(fileMap.get("fullyQualifiedPath"));
        String fileName = fileMap.get("filename");

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(srcPath, paths);

        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "renameFile");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(fileMap);*/
        boolean copied = fileSystemService.renameFile(fullyQualifiedPath, srcPath, fileName, username);

        Response response = new Response();
        response.setSuccess(copied);
        return response;
    }

    /**
     * 파일을 삭제한다.
     *
     * @param fileMap 파일 삭제에 필요한 정보
     * @return 삭제된 파일 목록
     */
    @RequestMapping(value = "deleteFiles", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response deleteFile(@RequestBody Map<String, String> fileMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter(fileMap.get("currentPath"));
        String files = fileMap.get("files");

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);
        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "deleteFile");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(fileMap);*/
        List<String> deletedFiles = fileSystemService.deleteFiles(currentPath, files, username);

        Response response = new Response();
        response.getList().addAll(deletedFiles);
        response.setSuccess(true);
        return response;
    }

    /**
     * 파일 정보를 확인한다.
     *
     * @param filePath    파일 경로
     * @return 파일 정보
     */
    @RequestMapping(value = "getFileInfo", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getFileInfo(@RequestParam String filePath) {
        HdfsFileInfo fileInfo = fileSystemService.getFileInfo(filePath);
        Map infoMap = new HashMap();

        // Basic
        infoMap.put("name", fileInfo.getFilename());
        infoMap.put("path", fileInfo.getFullyQualifiedPath());
        infoMap.put("length", fileInfo.getLength());
        infoMap.put("modification", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(fileInfo.getModificationTime())));
        infoMap.put("isFile", fileInfo.isFile());
        infoMap.put("isDirectory", fileInfo.isDirectory());
        infoMap.put("owner", fileInfo.getOwner());
        infoMap.put("group", fileInfo.getGroup());

        // Permission
        infoMap.put("ownerRead", fileInfo.getPermission().charAt(0) != '-');
        infoMap.put("ownerWrite", fileInfo.getPermission().charAt(1) != '-');
        infoMap.put("ownerExecute", fileInfo.getPermission().charAt(2) != '-');
        infoMap.put("groupRead", fileInfo.getPermission().charAt(3) != '-');
        infoMap.put("groupWrite", fileInfo.getPermission().charAt(4) != '-');
        infoMap.put("groupExecute", fileInfo.getPermission().charAt(5) != '-');
        infoMap.put("otherRead", fileInfo.getPermission().charAt(6) != '-');
        infoMap.put("otherWrite", fileInfo.getPermission().charAt(7) != '-');
        infoMap.put("otherExecute", fileInfo.getPermission().charAt(8) != '-');

        // Space
        infoMap.put("blockSize", fileInfo.getBlockSize());
        infoMap.put("replication", fileInfo.getReplication());
        infoMap.put("directoryCount", fileInfo.getDirectoryCount());
        infoMap.put("fileCount", fileInfo.getFileCount());
        infoMap.put("quota", fileInfo.getQuota());
        infoMap.put("spaceConsumed", fileInfo.getSpaceConsumed());
        infoMap.put("spaceQuota", fileInfo.getSpaceQuota());

        Response response = new Response();
        response.getMap().putAll(infoMap);
        response.setSuccess(true);
        return response;
    }

    /**
     * 로컬에 있는 파일을 HDFS 파일시스템으로 업로드한다.
     *
     * @return REST Response JAXB Object
     */
    @RequestMapping(value = "upload", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> upload(HttpServletRequest req) throws IOException {
        Response response = new Response();

        if (!(req instanceof DefaultMultipartHttpServletRequest)) {
            response.setSuccess(false);
            response.getError().setCause("Request is not a file upload.");
            response.getError().setMessage("Failed to upload a file.");
            String json = new ObjectMapper().writeValueAsString(response);
            return new ResponseEntity(json, HttpStatus.BAD_REQUEST);
        }

        InputStream inputStream;
        DefaultMultipartHttpServletRequest request = (DefaultMultipartHttpServletRequest) req;

        String username = SessionUtils.getUsername();
        String dstPath = request.getParameter("dstPath");
        MultipartFile uploadedFile = request.getFile("fileName");
        String originalFilename = uploadedFile.getOriginalFilename();
        String pathToUpload = getPathFilter(dstPath);
        String fullyQualifiedPath = pathToUpload.equals("/") ? pathToUpload + originalFilename
                : pathToUpload + SystemUtils.FILE_SEPARATOR + originalFilename;

        inputStream = uploadedFile.getInputStream();

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(pathToUpload, paths);

        Map fileMap = new HashMap();
        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "uploadFile");
        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(fileMap);*/

        // Engine이 Remote에 있는지 확인한다.
        boolean isRemoteEngine = Boolean.parseBoolean(isRemote);

        // Remote가 아니라면 직접 전송을, Remote라면 Store and Forward로 전송
        if (!isRemoteEngine) {

            fileSystemService.validatePath(pathToUpload);

            String namenodeAgentUrl =
                    MessageFormatter.arrayFormat("http://{}:{}/remote/agent/transfer/upload?fullyQualifiedPath={}&username={}", new Object[]{
                            namenodeAgentAddress, namenodeAgentPort, URLEncoder.encode(fullyQualifiedPath, "UTF-8"), username
                    }).getMessage();

            HttpPost httpPost = new HttpPost(namenodeAgentUrl);
            HttpEntity reqEntity = new InputStreamEntity(inputStream);
            httpPost.setEntity(reqEntity);
            HttpResponse execute = httpClient.execute(httpPost);

            if (execute.getStatusLine().getStatusCode() == 500) {
                response.setSuccess(false);
                response.getError().setMessage("동일한 파일명이 존재합니다.");
            } else if (execute.getStatusLine().getStatusCode() == 600) {
                response.setSuccess(false);
                response.getError().setMessage("루트(/)는 권한을 변경할 수 없습니다.");
            } else {
                response.setSuccess(true);
            }

            inputStream.close();
            httpPost.releaseConnection();
        } else {
            boolean saved;
            byte[] bytes = FileCopyUtils.copyToByteArray(inputStream);
            fileSystemService.validateBeforeUpload(pathToUpload, fullyQualifiedPath, bytes, username);
            saved = fileSystemService.save(pathToUpload, fullyQualifiedPath, bytes, username);
            response.setSuccess(saved);
        }

        response.getMap().put("directory", pathToUpload);
        String json = new ObjectMapper().writeValueAsString(response);
        HttpStatus statusCode = HttpStatus.OK;

        return new ResponseEntity(json, statusCode);
    }

    /**
     * 로컬로 파일을 다운로드한다.
     *
     * @return REST Response JAXB Object
     */
    @RequestMapping(value = "download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity download(HttpServletResponse res,
                                   @RequestParam String srcPath,
                                   @RequestParam String fullyQualifiedPath) {
        String srcFilePath = getPathFilter(srcPath);
        String username = SessionUtils.getUsername();

        HttpHeaders headers = new HttpHeaders();

        if (org.apache.commons.lang.StringUtils.isEmpty(fullyQualifiedPath)) {
            headers.set("message", "Invalid parameter.");
            return new ResponseEntity(headers, HttpStatus.BAD_REQUEST);
        }

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(srcFilePath, paths);
        Map fileMap = new HashMap();

        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "downloadFile");

        hdfsBrowserAuthService.getHdfsBrowserUserDirAuth(fileMap);*/
        boolean isRemoteEngine = Boolean.parseBoolean(isRemote);

        // Remote가 아니라면 직접 전송을, Remote라면 Store and Forward로 전송
        if (!isRemoteEngine) {
            String filSplit[] = fullyQualifiedPath.split("/");
            String filename = filSplit[filSplit.length - 1];

            fileSystemService.validatePath(srcFilePath);

            HttpResponse execute;
            try {
                String namenodeAgentUrl = MessageFormatter.arrayFormat("http://{}:{}/remote/agent/transfer/download?fullyQualifiedPath={}", new Object[]{
                        namenodeAgentAddress, namenodeAgentPort, URLEncoder.encode(fullyQualifiedPath, "UTF-8")}).getMessage();

                HttpGet httpGet = new HttpGet(namenodeAgentUrl);
                execute = httpClient.execute(httpGet);
            } catch (Exception ex) {
                throw new WholeBodyException("File Download Failed");
            }

            if (execute.getStatusLine().getStatusCode() != 200) {
                throw new WholeBodyException("File Download Failed");
            } else {
                try {
                    InputStream is = execute.getEntity().getContent();
                    res.setHeader("Content-Length", "" + execute.getEntity().getContentLength());
                    res.setHeader("Content-Transfer-Encoding", "binary");
                    res.setHeader("Content-Type", "application/force-download");
                    res.setHeader("Content-Disposition", MessageFormatter.format("attachment; fullyQualifiedPath={}; filename={};",
                            URLEncoder.encode(fullyQualifiedPath, "UTF-8"), filename).getMessage());
                    res.setStatus(200);

                    FileCopyUtils.copy(is, res.getOutputStream());
                    res.flushBuffer();

                    fileSystemService.validateBeforeDownload(srcFilePath, fullyQualifiedPath, username);

                    return new ResponseEntity(HttpStatus.OK);
                } catch (Exception ex) {
                    throw new WholeBodyException("File Download Failed", ex);
                }
            }
        } else {
            try {
                byte[] bytes = fileSystemService.load(srcFilePath, fullyQualifiedPath, username);

                res.setHeader("Content-Length", "" + bytes.length);
                res.setHeader("Content-Transfer-Encoding", "binary");
                res.setHeader("Content-Type", "application/force-download");
                res.setHeader("Content-Disposition", MessageFormatter.format("attachment; fullyQualifiedPath={};",
                        URLEncoder.encode(fullyQualifiedPath, "UTF-8")).getMessage());
                res.setStatus(200);

                FileCopyUtils.copy(bytes, res.getOutputStream());
                res.flushBuffer();
                return new ResponseEntity(HttpStatus.OK);
            } catch (Exception ex) {
                throw new WholeBodyException("File Download Failed", ex);
            }
        }
    }

    /**
     * 파일 내용보기창을 시작했을 때 초기 페이지 정보만 처리한다.
     *
     * @param fileMap 파일 내용 보기에 필요한 정보
     * @return 파일 내용의 첫 페이지 정보
     */
    @RequestMapping(value = "initViewFileContents", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response initViewFileContents(@RequestBody Map fileMap) {
        String username = getSessionUsername();
        String currentPath = getPathFilter((String) fileMap.get("currentPath"));

        //TODO HDFS 권한관리는 차후에 추가될 예정
        /*List<String> paths = hdfsBrowserAuthService.getHdfsBrowserPatternAll(username);
        String hdfsPathPattern = hdfsBrowserAuthService.validateHdfsPathPattern(currentPath, paths);

        fileMap.put("username", username);
        fileMap.put("hdfsPathPattern", hdfsPathPattern);
        fileMap.put("condition", "viewFile");
        fileMap.put("auditLogKey", true);

        hdfsBrowserAuthService.getHdfsBrowserUserFileAuth(fileMap);*/
        Map fileContestsMap = fileSystemService.viewFileContents(fileMap, username);

        Map map = new HashMap();
        map.put("filePath", fileContestsMap.get("filePath"));
        map.put("chunkSizeToView", fileContestsMap.get("chunkSizeToView"));
        map.put("startOffset", fileContestsMap.get("startOffset"));
        map.put("dfsBlockStartOffset", fileContestsMap.get("dfsBlockStartOffset"));
        map.put("totalPage", fileContestsMap.get("totalPage"));
        map.put("currentPage", fileContestsMap.get("currentPage"));
        map.put("contents", fileContestsMap.get("contents"));
        map.put("bestNode", fileContestsMap.get("bestNode"));
        map.put("fileSize", fileContestsMap.get("fileSize"));
        map.put("totalPage", fileContestsMap.get("totalPage"));
        map.put("lastPageChunkSizeToView", fileContestsMap.get("lastPageChunkSizeToView"));
        map.put("dfsBlockSize", fileContestsMap.get("dfsBlockSize"));
        map.put("currentContentsBlockSize", fileContestsMap.get("currentContentsBlockSize"));
        map.put("startOffsetPerDfsBlocks", fileContestsMap.get("startOffsetPerDfsBlocks"));
        map.put("accumulatedStartOffsetPerDfsBlocks", fileContestsMap.get("accumulatedStartOffsetPerDfsBlocks"));
        map.put("lastStartOffsetPerDfsBlocks", fileContestsMap.get("lastStartOffsetPerDfsBlocks"));
        map.put("lastChunkSizePerDfsBlocks", fileContestsMap.get("lastChunkSizePerDfsBlocks"));
        map.put("pageCheckPoints", fileContestsMap.get("pageCheckPoints"));
        map.put("offsetRange", fileContestsMap.get("offsetRange"));
        map.put("lastDfsBlockSize", fileContestsMap.get("lastDfsBlockSize"));

        Response response = new Response();
        response.getMap().putAll(map);
        response.setSuccess(true);
        return response;
    }

    /**
     * 파일 내용을 보여준다.
     *
     * @param fileMap 파일 내용 보기에 필요한 정보
     * @return 선택한 페이지 범위의 파일 내용
     */
    @RequestMapping(value = "viewFileContents", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response viewFileContents(@RequestBody Map fileMap) {
        String username = getSessionUsername();
        fileMap.put("auditLogKey", false);

        Map fileContestsMap = fileSystemService.viewFileContents(fileMap, username);

        Map map = new HashMap();
        map.put("filePath", fileContestsMap.get("filePath"));
        map.put("chunkSizeToView", fileContestsMap.get("chunkSizeToView"));
        map.put("startOffset", fileContestsMap.get("startOffset"));
        map.put("dfsBlockStartOffset", fileContestsMap.get("dfsBlockStartOffset"));
        map.put("totalPage", fileContestsMap.get("totalPage"));
        map.put("currentPage", fileContestsMap.get("currentPage"));
        map.put("contents", fileContestsMap.get("contents"));
        map.put("bestNode", fileContestsMap.get("bestNode"));
        map.put("fileSize", fileContestsMap.get("fileSize"));
        map.put("totalPage", fileContestsMap.get("totalPage"));
        map.put("dfsBlockSize", fileContestsMap.get("dfsBlockSize"));
        map.put("lastPageChunkSizeToView", fileContestsMap.get("lastPageChunkSizeToView"));
        map.put("currentContentsBlockSize", fileContestsMap.get("currentContentsBlockSize"));
        map.put("startOffsetPerDfsBlocks", fileContestsMap.get("startOffsetPerDfsBlocks"));
        map.put("accumulatedStartOffsetPerDfsBlocks", fileContestsMap.get("accumulatedStartOffsetPerDfsBlocks"));
        map.put("lastStartOffsetPerDfsBlocks", fileContestsMap.get("lastStartOffsetPerDfsBlocks"));
        map.put("lastChunkSizePerDfsBlocks", fileContestsMap.get("lastChunkSizePerDfsBlocks"));
        map.put("pageCheckPoints", fileContestsMap.get("pageCheckPoints"));
        map.put("offsetRange", fileContestsMap.get("offsetRange"));
        map.put("lastDfsBlockSize", fileContestsMap.get("lastDfsBlockSize"));

        Response response = new Response();
        response.getMap().putAll(map);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "copyToLocal", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response copyToLocal(@RequestParam String srcFullyQualifiedPath) {
        String username = getSessionUsername();
        Long orgId = getOrgId();
        String linuxUserHome = defaultLinuxUserHome + SystemUtils.FILE_SEPARATOR + username;
        boolean result = false;

        Response response = new Response();

        if (getSessionUserLevel() == 1) {
            result = fileSystemService.copyToLocal(srcFullyQualifiedPath, linuxUserHome, username);
        } else {
            response.setSuccess(false);
            response.getError().setMessage("사용 권한이 없는 그룹에 속해 있습니다.");
        }

        response.setSuccess(result);
        return response;
    }

    /**
     * 파일을 삭제한다.
     *
     * @param params 파일 삭제에 필요한 정보
     */
    @RequestMapping(value = "saveMax", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response saveMax(@RequestBody Map params) {
        Response response = new Response();

        hdfsBrowserService.save(params);

        response.setSuccess(true);

        return response;
    }

    /**
     * 파일 정보를 체크한다.
     *
     * @param path    파일 경로
     * @return 파일 정보
     */
    @RequestMapping(value = "checkFileInfo", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response checkFileInfo(@RequestParam String path) {
        Response response = new Response();

        try {
            HdfsFileInfo fileInfo = fileSystemService.getFileInfo(path);
            Map infoMap = new HashMap();

            // Basic
            infoMap.put("isFile", fileInfo.isFile());
            infoMap.put("isDirectory", fileInfo.isDirectory());

            response.getMap().putAll(infoMap);
            response.setSuccess(true);
        }
        catch (Exception ex) {
            response.setSuccess(false);
        }

        return response;
    }

    /**
     * ExtJS 5에서는 "/" 대신 "root"로 넘어옴
     */
    private String getPathFilter(String node) {
        if (isEmpty(node) || "root".equals(node)) {
            return "/";
        }
        return node;
    }

    /**
     * 현재 세션의 사용자명을 가져온다.
     *
     * @return username
     */
    private String getSessionUsername() {
        return SessionUtils.getUsername();
    }

    /**
     * 현재 세션의 사용자 등급 정보를 가져온다.
     *
     * @return level
     */
    private int getSessionUserLevel() {
        return SessionUtils.getLevel();
    }

    /**
     * 현재 세션의 사용자가 소속된 조직의 ID를 가져온다.
     *
     * @return orgId
     */
    private Long getOrgId() {
        return SessionUtils.getOrgId();
    }
}
