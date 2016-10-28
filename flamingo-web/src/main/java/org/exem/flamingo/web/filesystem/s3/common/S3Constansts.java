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
package org.exem.flamingo.web.filesystem.s3.common;

public class S3Constansts {
    public static final String CANONICAL_GRANTEE_TYPE_ID = "id";
    public static final String GROUP_GRANTEE_TYPE_ID = "uri";
    public static final String DELIMITER = "/";
    public static final int MAX_PREVIEW_SIZE = 1024 * 10;

    public static final String BUCKETNAME = "bucketName";
    public static final String REGION = "region";
    public static final String KEY = "key";
    public static final String SRC_BUCKETNAME = "srcBucketName";
    public static final String DST_BUCKETNAME = "dstBucketName";
    public static final String SRC_KEY = "srcKey";
    public static final String DST_KEY = "dstKey";
    public static final String NEW_KEY = "newKey";
    public static final String FILE = "file";
    public static final String ISTRUNCATED= "isTruncated";
    public static final String CONTINUATIONTOKEN= "continuationToken";
}