/*
* Copyright (C) 2012-2016 the Flamingo Community.
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
package org.exem.flamingo.agent.nn;

import org.apache.hadoop.fs.ContentSummary;
import org.exem.flamingo.agent.nn.hdfs.HdfsFileInfo;
import org.exem.flamingo.shared.model.rest.FileInfo;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * HDFS 브라우저의 HDFS 관리 동작에 필요한 기능을 제공하는 서비스 인터페이스.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
public interface Namenode2AgentService {

    /**
     * Namenode 정보를 반환한다.
     *
     * @return Namenode 정보
     */
    Map getNamenodeInfo();

    /**
     * Namenode의 Hadoop Configuration을 반환한다.
     *
     * @return Namenode의 Hadoop Configuration
     */
    Map<String, Object> getConfiguration();

    /**
     * Namenode의 전체 상황 정보를 반환한다.
     *
     * @return Namenode 상황 정보
     */
    Map<String, Object> getMetrics();

    /**
     * 데이터 노드 목록을 반환한다.
     *
     * @return 데이터 노드 목록
     * @throws IOException 데이터 노드 목록을 얻을 수 없는 경우
     */
    List getDatanodes() throws IOException;

    /**
     * Live 데이터 노드를 반환한다.
     *
     * @return Live 데이터 노드
     */
    List<Map> getLiveNodes();

    /**
     * Dead 데이터 노드를 반환한다.
     *
     * @return Dead 데이터 노드
     */
    List<Map> getDeadNodes();

    /**
     * Decommission 데이터 노드를 반환한다.
     *
     * @return Decommission 데이터 노드
     */
    List<Map> getDecommissioningNodes();

    /**
     * Namenode의 JVM Heap 정보를 반환한다.
     *
     * @return Namenode의 JVM Heap 정보
     */
    Map<String, Long> getJVMHeap();

    /**
     * 지정한 경로의 파일 및 디렉토리 목록을 반환한다.
     *
     * @param path          HDFS 경로
     * @param directoryOnly true인 경우 디렉토리만 추출
     * @return 파일 및 디렉토리 목록
     */
    List<FileInfo> list(String path, boolean directoryOnly);

    /**
     * 선택한 경로에 디렉토리를 생성한다.
     *
     * @param srcPath  디렉토리 경로
     * @param username 사용자명
     * @return 정상적으로 생성한 경우 <tt>true</tt>
     */
    boolean mkdir(String srcPath, String username);

    /**
     * 지정한 디렉토리 또는 파일을 선택한 경로로 복사한다.
     *
     * @param srcPath  복사할 디렉토리 또는 파일(멀티파일 포함)
     * @param dstPath  복사될 경로
     * @param username Username
     * @return 정상적으로 복사한 경우 <tt>true</tt>
     */
    boolean copy(String srcPath, String dstPath, String username);

    /**
     * 지정한 디렉토리 또는 파일을 선택한 경로로 이동한다.
     *
     * @param srcPath 이동할 디렉토리 또는 파일(멀티파일 포함)
     * @param dstPath 이동될 경로
     * @return 정상적으로 복사한 경우 <tt>true</tt>
     */
    boolean move(String srcPath, String dstPath);

    /**
     * 지정한 디렉토리 또는 파일명을 변경한다.
     *
     * @param srcPath 원본 디렉토리 또는 파일의 전체 경로
     * @param name    변경될 디렉토리명 또는 파일명
     * @return 정상적으로 변경된 경우 <tt>true</tt>
     */
    boolean rename(String srcPath, String name);

    /**
     * 지정한 디렉토리 또는 파일(멀티파일 포함)을 삭제한다.
     *
     * @param srcPath 삭제할 디렉토리 또는 파일 경로
     * @return 정상 삭제 여부
     */
    boolean delete(String srcPath);

    /**
     * 지정한 디렉토리에 존재하는 모든 파일들을 병합한다.
     *
     * @param srcPath  병합할 파일이 존재하는 경로
     * @param dstPath  병합할 파일이 저장될 경로
     * @param username 사용자명
     * @return 정상적으로 병합된 경우 <tt>true</tt>
     */
    boolean merge(String srcPath, String dstPath, String username);

    /**
     * 선택한 디렉토리 또는 파일의 정보를 조회한다.
     *
     * @param srcPath 조회할 디렉토리 또는 파일 경로
     * @return 디렉토리 및 파일 정보
     */
    HdfsFileInfo getFileInfo(String srcPath);

    /**
     * 선택한 디렉토리 또는 파일의 권한을 변경한다.
     *
     * @param permissionMap 선택한 경로의 사용자 및 그룹, 권한을 변경한다.
     * @return 정상적으로 병합한 경우 <tt>true</tt>
     */
    boolean setPermission(Map permissionMap);

    /**
     * 지정한 경로에 업로드한 파일을 저장한다.
     *
     * @param pathToUpload       업로드한 파일의 경로
     * @param fullyQualifiedPath 업로드한 파일의 전체 경로
     * @param content            업로드한 파일의 바이트 배열
     * @param username           사용자명
     * @return 정상적으로 업로드한 경우 <tt>true</tt>
     */
    boolean save(String pathToUpload, String fullyQualifiedPath, byte[] content, String username);

    /**
     * 지정한 경로의 파일을 로딩한다. 이 메소드는 큰 파일 또는 동시에 다수의 사용자가 호출하는 경우 많는 양의 Heap을 소비할 수 있다.
     *
     * @param fullyQualifiedPath 다운로드할 파일의 전체 경로
     * @return 파일의 바이트 배열
     */
    byte[] load(String fullyQualifiedPath);

    /**
     * 선택한 파일의 내용을 지정한 사이즈 단위로 읽어온다.
     *
     * @param fileContentsMap 파일 내용보기에 필요한 정보
     * @return 선택한 페이지 범위에 해당하는 파일 내용
     */
    Map view(Map fileContentsMap);

    /**
     * HDFS 경로에 사용자 홈 디렉토리를 생성한다.
     *
     * @param hdfsUserMap HDFS 사용자 홈 디렉토리 생성 및 권한 설정에 필요한 정보
     * @return true or false
     */
    boolean createUserHome(Map hdfsUserMap);

    /**
     * HDFS 경로에 사용자 홈 디렉토리를 삭제한다.
     *
     * @param hdfsUserHomePath HDFS 사용자 홈 디렉토리 경로
     * @return true or false
     */
    boolean deleteUserHome(String hdfsUserHomePath);

    /**
     * HDFS 경로에 파일 목록을 페이징 처리 하여 가져온다..
     *
     * @param path   HDFS 디렉토리 경로
     * @param page   페이지 번호
     * @param start  시작 번호
     * @param limit  목록 제한 갯수
     * @param filter 필터링
     * @return 파일 목록 구조체
     */
    Map getListPage(String path, int page, int start, int limit, String filter) throws IOException;

    /**
     * HDFS 경로에 파일 목록을 상위 갯수대로 가져온다.
     *
     * @param path  HDFS 디렉토리 경로
     * @param limit 목록 제한 갯수
     * @param sort  정렬 여부
     * @return 파일 목록 구조체
     */
    Map getTopN(String path, int limit, boolean sort) throws IOException;

    /**
     * HDFS 경로에 파일, 디렉토리 갯수를 반환한다..
     *
     * @param path HDFS 디렉토리 경로
     * @return ContentSummary
     */
    ContentSummary getContentSummary(String path) throws IOException;

    /**
     * HDFS 경로의 파일을 리눅스 사용자 홈 디렉토리로 복사한다.
     *
     * @param srcFullyQualifiedPath 복사할 파일의 전체 경로
     * @param dstFullyQualifiedPath 파일이 복사될 전체 경로
     * @param linuxUserHome         사용자 리눅스 홈 디렉토리
     * @param username              사용자명
     * @return true or false
     */
    boolean copyToLocal(String srcFullyQualifiedPath, String dstFullyQualifiedPath, String linuxUserHome, String username);

    /**
     * HDFS 경로에 대한 블락 정보를 가져온다.
     *
     * @param path  블락 정보를 볼 경로
     * @return 블락 정보 구조체
     */
    Map getBlockInfo(String path) throws IOException;
}