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
package org.exem.flamingo.web.filesystem.s3.rest;

import java.util.Date;
import java.util.Map;

public class S3ObjectInfo {

    private static final long serialVersionUID = 1;

    private String bucketName;
    private String prefix;
    private String key;
    private String name;
    private long size;
    private boolean bucket;
    private boolean folder;
    private boolean object;
    private String owner;
    private String ownerId;
    private String storageClass;
    private long creationDate;
    private long lastModified;
    private Map<String, S3Grant> permission;
    private String uri;
    private String contentType;
    private String eTag;


    public S3ObjectInfo() {}

    public String getBucketName() {
        return bucketName;
    }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public void setCreationDate(long creationDate) {
        this.creationDate = creationDate;
    }

    public void setLastModified(long lastModified) {
        this.lastModified = lastModified;
    }

    public boolean isBucket() {
        return bucket;
    }

    public void setBucket(boolean isBucket) {
        this.bucket = isBucket;
        this.folder = !isBucket;
        this.object = !isBucket;
    }

    public boolean isFolder() {
        return folder;
    }

    public void setFolder(boolean isFolder) {
        this.folder = isFolder;
        this.bucket = !isFolder;
        this.object = !isFolder;
    }

    public boolean isObject() {
        return object;
    }

    public void setObject(boolean isObject) {
        this.object = isObject;
        this.bucket = !isObject;
        this.folder = !isObject;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getStorageClass() {
        return storageClass;
    }

    public void setStorageClass(String storageClass) {
        this.storageClass = storageClass;
    }

    public long getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate.getTime();
    }

    public long getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified.getTime();
    }

    public Map<String, S3Grant> getPermission() {
        return permission;
    }

    public void setPermission(Map<String, S3Grant> permission) {
        this.permission = permission;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String geteTag() {
        return eTag;
    }

    public void seteTag(String eTag) {
        this.eTag = eTag;
    }
}