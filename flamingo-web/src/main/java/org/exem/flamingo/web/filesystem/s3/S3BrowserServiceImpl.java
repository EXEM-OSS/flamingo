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

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.apache.commons.lang.StringUtils;
import org.exem.flamingo.web.filesystem.s3.common.S3Constansts;
import org.exem.flamingo.web.filesystem.s3.rest.S3ObjectInfo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

@Service
public class S3BrowserServiceImpl implements S3BrowserService {

    private AmazonS3 s3;

    public S3BrowserServiceImpl() throws IOException {
        this.s3 = AwsS3Factory.createS3Client();
    }
    
    @Override
    public List<Bucket> listBuckets() {
         return this.s3.listBuckets();
    }


    @Override
    public void createBucket(String bucketName, String region) {
        CreateBucketRequest request = new CreateBucketRequest(bucketName, region);
        this.s3.createBucket(request);
    }

    @Override
    public void deleteBucket(String bucketName) {
        ListObjectsV2Request request = new ListObjectsV2Request();
        request.withBucketName(bucketName);
        ListObjectsV2Result result;

        while (true) {
            result = this.s3.listObjectsV2(request);
            for (S3ObjectSummary objectSummary : result.getObjectSummaries()) {
                this.s3.deleteObject(bucketName, objectSummary.getKey());
            }
            if (result.isTruncated()) {
                request.setContinuationToken(result.getNextContinuationToken());
            } else {
                break;
            }
        }

        this.s3.deleteBucket(bucketName);
    }

    @Override
    public AccessControlList getBucketAcl(String bucketName) {
        GetBucketAclRequest request = new GetBucketAclRequest(bucketName);
        return this.s3.getBucketAcl(request);
    }

    @Override
    public String getBucketLocation(String bucketName) {
        return this.s3.getBucketLocation(bucketName);
    }

    @Override
    public void createFolder(String bucketName, String key) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(0L);

        if (!StringUtils.endsWith(key, S3Constansts.DELIMITER)) {
            key = key.concat(S3Constansts.DELIMITER);
        }

        this.s3.putObject(bucketName, key, new ByteArrayInputStream(new byte[0]), metadata);
    }

    @Override
    public void deleteFolder(String bucketName, String key) {
        ListObjectsV2Request request = new ListObjectsV2Request();
        request.withBucketName(bucketName).withPrefix(key).withDelimiter(S3Constansts.DELIMITER);

        ListObjectsV2Result result;

        while (true) {
            result = this.s3.listObjectsV2(request);
            for (S3ObjectSummary objectSummary : result.getObjectSummaries()) {
                this.s3.deleteObject(bucketName, objectSummary.getKey());
            }
            if (result.isTruncated()) {
                request.setContinuationToken(result.getNextContinuationToken());
            } else {
                break;
            }
        }
    }

    @Override
    public ListObjectsV2Result listObjects(String bucketName, String prefix, String continuationToken) {
        ListObjectsV2Request request = new ListObjectsV2Request();
        request.withBucketName(bucketName).withPrefix(prefix).withDelimiter(S3Constansts.DELIMITER);

        if (StringUtils.isNotEmpty(continuationToken)) {
            request.withContinuationToken(continuationToken);
        }

        return this.s3.listObjectsV2(request);
    }

    @Override
    public void upload(String bucketName, String key, MultipartFile file) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        PutObjectRequest request = new PutObjectRequest(bucketName, key, file.getInputStream(), metadata);
        this.s3.putObject(request);

    }

    @Override
    public void deleteObject(String bucketName, String key) {
        DeleteObjectRequest request = new DeleteObjectRequest(bucketName, key);
        this.s3.deleteObject(request);
    }

    @Override
    public void copyObject(String srcBucketName, String srcKey, String dstBucketName, String dstKey) {
        CopyObjectRequest request = new CopyObjectRequest(srcBucketName, srcKey, dstBucketName, dstKey);
        this.s3.copyObject(request);
    }

    @Override
    public void moveObject(String srcBucketName, String srcKey, String dstBucketName, String dstKey) {
        CopyObjectRequest request = new CopyObjectRequest(srcBucketName, srcKey, dstBucketName, dstKey);
        this.s3.copyObject(request);
        this.s3.deleteObject(srcBucketName, srcKey);
    }

    @Override
    public void renameObject(String bucketName, String oldKey, String newKey) {
        CopyObjectRequest request = new CopyObjectRequest(bucketName, oldKey, bucketName, newKey);
        this.s3.copyObject(request);
        this.s3.deleteObject(bucketName, oldKey);
    }

    @Override
    public S3Object getObject(String bucketName, String key) {
        return this.s3.getObject(bucketName, key);
    }

    @Override
    public S3ObjectInfo getObjectProperty(String bucketName, String key) {
        ObjectMetadata metadata = this.s3.getObjectMetadata(bucketName, key);

        S3ObjectInfo object = new S3ObjectInfo();
        object.setBucketName(bucketName);
        object.setKey(key);
        object.setName(getName(key));
        object.setLastModified(metadata.getLastModified());
        object.setContentType(metadata.getContentType());
        object.seteTag(metadata.getETag());

        URL url = this.s3.getUrl(bucketName, key);
        object.setUri(url.toString());

        AccessControlList acl = this.s3.getObjectAcl(bucketName, key);
        object.setOwner(acl.getOwner().getDisplayName());

        return object;
    }

    @Override
    public AccessControlList getObjectAcl(String bucketName, String key) {
        return this.s3.getObjectAcl(bucketName, key);
    }

    @Override
    public String getObjectAsString(String bucketName, String key, long size) throws IOException {
        // MAX_PREVIEW_SIZE 만큼만 미리보기로 제공
        if (size <= S3Constansts.MAX_PREVIEW_SIZE) {
            return this.s3.getObjectAsString(bucketName, key);
        }

        byte[] buffer = new byte[S3Constansts.MAX_PREVIEW_SIZE];
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        S3Object object = this.s3.getObject(bucketName, key);
        InputStream is = object.getObjectContent();

        try {
            int readCount;
            int totalReadCount = 0;
            int len = S3Constansts.MAX_PREVIEW_SIZE;
            while (totalReadCount < S3Constansts.MAX_PREVIEW_SIZE) {
                readCount = is.read(buffer, 0, len);
                output.write(buffer, 0, readCount);
                totalReadCount += readCount;
                len = S3Constansts.MAX_PREVIEW_SIZE - totalReadCount;
            }
            output.toByteArray();
        } finally {
            object.close();
        }

        return new String(output.toByteArray());
    }

    private String getName(String key) {
        if (StringUtils.isEmpty(key)) {
            return "";
        }
        String[] strArray = StringUtils.split(key, S3Constansts.DELIMITER);
        return strArray[strArray.length - 1];
    }
}