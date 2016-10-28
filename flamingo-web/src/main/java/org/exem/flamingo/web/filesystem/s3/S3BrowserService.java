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
package org.exem.flamingo.web.filesystem.s3;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.model.AccessControlList;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3Object;
import org.exem.flamingo.web.filesystem.s3.rest.S3ObjectInfo;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface S3BrowserService {

    /**
     * 버킷 목록을 반환한다.
     *
     * @return 버킷목록
     */
    List<Bucket> listBuckets() throws AmazonClientException;

    /**
     * 버킷을 생성한다.
     *
     * @param bucketName 버킷명
     * @param resion 지역
     */
    void createBucket(String bucketName, String resion) throws AmazonClientException;

    /**
     * 버킷을 삭제한다.
     * 버킷이 오브젝트를 포함하고 있는 경우 모두 삭제 후 버킷을 삭제한다.
     *
     * @param bucketName 버킷명
     */
    void deleteBucket(String bucketName) throws AmazonClientException;

    /**
     * 버킷을 접근권한목록을 반환한다.
     *
     * @param bucketName 버킷명
     * @return 접근권한목록
     */
    AccessControlList getBucketAcl(String bucketName) throws AmazonClientException;

    /**
     * 버킷의 지역을 반환한다.
     *
     * @param bucketName 버킷명
     * @return 버킷이 생성된 리전
     */
    String getBucketLocation(String bucketName) throws AmazonClientException;

    /**
     * 폴더를 생성한다.
     * @param bucketName 버킷명
     * @param key 생성할 폴더의 키
     */
    void createFolder(String bucketName, String key) throws AmazonClientException;

    /**
     * 폴더를 삭제한다.
     * 폴더가 하위 오브젝트를 포함하고 있는 경우 모두 삭제 후 폴더를 삭제한다.
     *
     * @param bucketName 버킷명
     * @param key 폴더 오브젝트명
     */
    void deleteFolder(String bucketName, String key) throws AmazonClientException;

    /**
     * 오브젝트 목륵을 반환한다.
     *
     * @param bucketName 버킷명
     * @param prefix 폴더 경로
     * @param continuationToken 조회 할 시작 지점
     * @return 오브젝트 목록
     */
    ListObjectsV2Result listObjects(String bucketName, String prefix, String continuationToken)
            throws AmazonClientException;

    /**
     * 오브젝트를 업로드한다.
     *
     * @param bucketName 버킷명
     * @param key   업로드 할 오브젝트 키
     * @param file  업로드할 파일
     */
    void upload(String bucketName, String key, MultipartFile file)
            throws AmazonClientException, IOException;

    /**
     * 오브젝트를 삭제한다.
     *
     * @param bucketName 버킷명
     * @param key 오브젝트 키
     */
    void deleteObject(String bucketName, String key) throws AmazonClientException;

    /**
     * 오브젝트를 복사한다.
     *
     * @param srcBucketName 소스 버킷명
     * @param srcKey 소스 오브젝트 키
     * @param dstBucketName 대상 버킷명
     * @param dstKey 대상 오브젝트 키
     */
    void copyObject(String srcBucketName, String srcKey, String dstBucketName, String dstKey)
            throws AmazonClientException;

    /**
     * 오브젝트를 이동한다.
     *
     * @param srcBucketName 소스 버킷명
     * @param srcKey 소스 오브젝트 키
     * @param dstBucketName 대상 버킷명
     * @param dstKey 대상 오브젝트 키
     */
    void moveObject(String srcBucketName, String srcKey, String dstBucketName, String dstKey)
            throws AmazonClientException;

    /**
     * 오브젝트를 이름을 변경한다.
     *
     * @param bucketName 버킷명
     * @param oldKey 소스 오브젝트 키
     * @param newKey 대상 오브젝트 키
     */
    void renameObject(String bucketName, String oldKey, String newKey) throws AmazonClientException;

    /**
     * 오브젝트를 반환한다.
     * 오브젝트를 메타데이터를 포함한다.
     *
     * @param bucketName 버킷명
     * @param key 오브젝트 키
     * @return 오브젝트
     */
    S3Object getObject(String bucketName, String key);

    /**
     * 버킷을 접근권한목록을 반환한다.
     *
     * @param bucketName 버킷명
     * @param key   오브젝트 키
     * @return 접근권한목록
     */
    AccessControlList getObjectAcl(String bucketName, String key) throws AmazonClientException;

    /**
     * 오브젝트 내용을 문자열로 반환한다.
     *
     * @param bucketName 버킷명
     * @param key   오브젝트 키
     * @return 문자열로 변환 된 오브젝트 내용
     */
    String getObjectAsString(String bucketName, String key, long size) throws AmazonClientException, IOException;

    /**
     * 오브젝트 속성을 반환한다.
     *
     * @param bucketName 버킷명
     * @param key   오브젝트 키
     * @return 오브젝트 속성 내용
     */
    S3ObjectInfo getObjectProperty(String bucketName, String key);
}