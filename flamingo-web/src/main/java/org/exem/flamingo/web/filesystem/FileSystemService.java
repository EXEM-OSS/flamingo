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
package org.exem.flamingo.web.filesystem;

import org.apache.hadoop.fs.ContentSummary;
import org.exem.flamingo.agent.nn.hdfs.HdfsFileInfo;
import org.exem.flamingo.shared.model.rest.FileInfo;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Apache Hadoop HDFS File System Service Interface.
 *
 * @author Byoung Gon, Kim
 * @author Myeong Ha, KIM
 * @since 0.4
 */

/**
 * AS-IS : org.openflamingo.fs.hdfs.HdfsFileSystemServiceImpl
 */
public interface FileSystemService {

    /**
     * 디렉토리 목록을 반환한다.
     *
     * @param path HDFS directory path to check
     * @return 디렉토리 목록
     */
    List<FileInfo> getDirectories(String path, boolean directoryOnly);

    /**
     * 파일 목록을 반환한다.
     *
     * @param path HDFS file path to check
     * @return 파일 목록
     */
    List<FileInfo> getFiles(String path);

    /**
     * 파일 목록을 반환한다.
     *
     * @param path   HDFS file path to check
     * @param page   페이지 번호
     * @param start  시작 번호
     * @param limit  목록 제한 갯수
     * @param filter 필터링
     * @return 파일 목록
     */
    Map getListPage(String path, int page, int start, int limit, String filter) throws IOException;

    /**
     * 파일 목록을 반환한다.
     *
     * @param path  HDFS file path to check
     * @param limit 목록 제한 갯수
     * @return 파일 목록
     */
    Map getTopN(String path, int limit) throws IOException;

    /**
     * 파일/디렉토리 정보를 반환한다.
     *
     * @param path HDFS file path to check
     * @return 파일/디렉토리 정보
     */
    ContentSummary getContentSummary(String path) throws IOException;

    /**
     * 디렉토리를 생성한다.
     *
     * @param path     HDFS directory path to create
     * @param username Username
     * @return 디렉토리 생성 여부
     */
    boolean createDirectory(String path, String username);

    /**
     * 디렉토리를 복사한다.
     *
     * @param currentPath HDFS directory source path to copy
     * @param dstPath     HDFS directory target path to be copied
     * @param username    Username
     * @return 디렉토리 복사 여부
     */
    boolean copyDirectory(String currentPath, String dstPath, String username);

    /**
     * 디렉토리를 이동한다.
     *
     * @param currentPath HDFS directory source path to move
     * @param dstPath     HDFS directory target path to be moved
     * @param username    Username
     * @return 디렉토리 이동 여부
     */
    boolean moveDirectory(String currentPath, String dstPath, String username);

    /**
     * 디렉토리명을 변경한다.
     *
     * @param srcPath       HDFS directory source path to rename
     * @param directoryName HDFS directory new name to be renamed
     * @param username      Username
     * @return 디렉토리명 변경 여부
     */
    boolean renameDirectory(String srcPath, String directoryName, String username);

    /**
     * 디렉토리를 삭제한다.
     *
     * @param currentPath HDFS directory path to delete
     * @param username    Username
     * @return 디렉토리 삭제 여부
     */
    boolean deleteDirectory(String currentPath, String username);

    /**
     * @param currentPath HDFS directory source path to merge files
     * @param dstPath     HDFS directory new name to be saved merged files
     * @param username    Username
     * @return true or false
     */
    boolean mergeFiles(String currentPath, String dstPath, String username);

    /**
     * 디렉토리 및 파일 정보를 확인한다.
     *
     * @param path HDFS directory or file information
     * @return 디렉토리 또는 파일 정보
     */
    HdfsFileInfo getFileInfo(String path);

    /**
     * @param permissionMap HDFS permission information
     * @param username      Username
     * @return true or false
     */
    boolean setPermission(Map permissionMap, String username);

    /**
     * 파일을 복사한다.
     *
     * @param srcFileList HDFS file(s) fullyQualified path to copy
     * @param dstPath     HDFS file(s) destination path to be copied
     * @return 복사된 파일 목록
     */
    List<String> copyFiles(List<String> srcFileList, String dstPath, String username);

    /**
     * 파일을 이동한다.
     *
     * @param srcFileList HDFS file(s) fullyQualified path to move
     * @param dstPath     HDFS file(s) destination path to be moved
     * @param username    Username
     * @return 이동된 파일 목록
     */
    List<String> moveFiles(List<String> srcFileList, String dstPath, String username);

    /**
     * 파일명을 변경한다.
     *
     * @param fullyQualifiedPath HDFS file fully qualified path
     * @param srcPath            HDFS file Source path to rename
     * @param filename           HDFS filename to be renamed
     * @param username           Username
     * @return 변경 여부
     */
    boolean renameFile(String fullyQualifiedPath, String srcPath, String filename, String username);

    /**
     * 파일을 삭제한다.
     *
     * @param files    HDFS file(s) path to delete
     * @param srcPath  HDFS file source path to delete
     * @param username Username
     * @return 삭제된 파일 목록
     */
    List<String> deleteFiles(String files, String srcPath, String username);

    /**
     * 업로드한 파일을 저장한다.
     *
     * @param pathToUpload       HDFS file source path to upload
     * @param fullyQualifiedPath HDFS file source path to upload
     * @param content            HDFS file byte array to save
     * @param username           Username
     * @return 파일 업로드 여부
     */
    boolean save(String pathToUpload, String fullyQualifiedPath, byte[] content, String username);

    /**
     * Namenode Agent를 통해 직접 업로드하기 전 패턴 검사 및 Audit 로그를 업데이트 한다.
     *
     * @param pathToUpload       HDFS file source path to upload
     * @param fullyQualifiedPath HDFS file source path to upload
     * @param content            HDFS file byte array to save
     * @param username           Username
     */
    void validateBeforeUpload(String pathToUpload, String fullyQualifiedPath, byte[] content, String username);

    /**
     * 파일을 로딩한다.
     *
     * @param srcFilePath        HDFS file source path to download
     * @param fullyQualifiedPath HDFS fully qualified path to download
     * @param username           Username
     * @return 다운로드할 파일의 내용
     */
    byte[] load(String srcFilePath, String fullyQualifiedPath, String username);

    /**
     * 선택한 파일의 내용을 가져온다.
     *
     * @param fileContestsMap File contents information to view
     * @param username        Username
     * @return Contents of File
     */
    Map viewFileContents(Map fileContestsMap, String username);

    /**
     * HDFS 경로에 사용자 홈 디렉토리를 생성한다.
     *
     * @param hdfsUserHome HDFS User's home directory
     * @param username     Username
     * @return true or false
     */
    boolean createHdfsUserHome(String hdfsUserHome, String username);

    /**
     * HDFS 경로에 존재하는 해당 사용자의 홈 디렉토리를 삭제한다.
     *
     * @param hdfsUserHome HDFS user home directory
     * @return true or false
     */
    boolean deleteHdfsUserHome(String hdfsUserHome);

    boolean copyToLocal(String srcFullyQualifiedPath, String linuxUserHome, String username);

    /**
     * 쓰기 금지 목록 패턴을 검증한다.
     *
     * @param path HDFS Path
     */
    void validatePath(String path);

    /**
     * Namenode Agent를 통해 직접 다운로드 한 후 Audit 로그를 저장한다.
     *
     * @param srcFilePath        HDFS file source path to download
     * @param fullyQualifiedPath HDFS file fully qualified path to download
     * @param username           Username
     */
    void validateBeforeDownload(String srcFilePath, String fullyQualifiedPath, String username);

//    boolean getNamenodeStatus();
}
