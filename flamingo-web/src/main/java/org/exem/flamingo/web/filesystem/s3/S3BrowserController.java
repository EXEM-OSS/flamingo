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

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.model.*;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.HttpClient;
import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.web.filesystem.s3.common.S3Constansts;
import org.exem.flamingo.web.filesystem.s3.rest.S3Grant;
import org.exem.flamingo.web.filesystem.s3.rest.S3ObjectInfo;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@RestController
@RequestMapping("/fs/s3")
public class S3BrowserController {
    @Autowired
    HttpClient httpClient;

    @Autowired
    S3BrowserService s3BrowserService;


    @RequestMapping(value = "createBucket", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response createBucket(@RequestBody Map<String, String> map) throws AmazonServiceException {
        String bucketName = map.get(S3Constansts.BUCKETNAME);
        String region = map.get(S3Constansts.REGION);

        if (StringUtils.isEmpty(region)) {
            region = com.amazonaws.regions.Regions.DEFAULT_REGION.getName();
        }

        s3BrowserService.createBucket(bucketName, region);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "deleteBucket", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response deleteBucket(@RequestBody Map<String, String> map) {
        String bucketName = map.get(S3Constansts.BUCKETNAME);

        s3BrowserService.deleteBucket(bucketName);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "getBucketAcl", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getBucketAcl(@RequestParam String bucketName) {
        AccessControlList acl =  s3BrowserService.getBucketAcl(bucketName);

        Response response = new Response();
        response.getList().addAll(generateGrants(acl));
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "getBucketLocation", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getBucketLoacation(@RequestParam String bucketName) {
        String region = s3BrowserService.getBucketLocation(bucketName);

        Response response = new Response();
        response.setObject(region);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "listFolders", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response listFolders(@RequestParam(required = false) String bucketName,
                                @RequestParam(required = false) String prefix,
                                @RequestParam(required = false) String continuationToken) {

        // Get bucket list
        if (StringUtils.isEmpty(bucketName)) {
            Response response = new Response();
            response.getList().addAll(getBucketList());
            response.setSuccess(true);
            return response;
        }

        // Get folder list
        ListObjectsV2Result result = s3BrowserService.listObjects(bucketName, prefix, continuationToken);

        List<S3ObjectInfo> list = new ArrayList<>();
        List<String> commonPrefixes = result.getCommonPrefixes();
        for (String key : commonPrefixes) {
            S3ObjectInfo object = new S3ObjectInfo();
            object.setKey(key);
            object.setName(getName(key));
            object.setBucketName(bucketName);
            object.setFolder(true);
            list.add(object);
        }

        Map<String, String> map = new HashMap<>();
        map.put(S3Constansts.CONTINUATIONTOKEN, result.getNextContinuationToken());
        map.put(S3Constansts.ISTRUNCATED, BooleanUtils.toStringTrueFalse(result.isTruncated()));

        Response response = new Response();
        response.getList().addAll(list);
        response.getMap().putAll(map);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "createFolder", method = RequestMethod.POST)
    public Response createFolder(@RequestBody Map<String, String> map) {
        String bucketName = map.get(S3Constansts.BUCKETNAME);
        String key = map.get(S3Constansts.KEY);

        s3BrowserService.createFolder(bucketName, key);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "listObjects", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response listObjects(@RequestParam(required = false) String bucketName,
                                @RequestParam(required = false) String prefix,
                                @RequestParam(required = false) String continuationToken) {
        // Get bucket list
        if (StringUtils.isEmpty(bucketName)) {
            Response response = new Response();
            response.getList().addAll(getBucketList());
            response.setSuccess(true);
            return response;
        }

        // Get folder & bucket list
        ListObjectsV2Result result = s3BrowserService.listObjects(bucketName, prefix, continuationToken);

        List<S3ObjectInfo> list = new ArrayList<>();
        List<String> commonPrefixes = result.getCommonPrefixes();
        for (String key : commonPrefixes) {
            S3ObjectInfo object = new S3ObjectInfo();
            object.setBucketName(bucketName);
            object.setKey(key);
            object.setName(getName(key));
            object.setFolder(true);
            list.add(object);
        }

        List<S3ObjectSummary> objectSummaries = result.getObjectSummaries();

        if (!StringUtils.endsWith(prefix, S3Constansts.DELIMITER)) {
            prefix = prefix + S3Constansts.DELIMITER;
        }
        for (S3ObjectSummary s3Object : objectSummaries) {
            String key = s3Object.getKey();
            if (prefix.equals(key)) {
                continue;
            }
            S3ObjectInfo object = new S3ObjectInfo();
            object.setBucketName(bucketName);
            object.setPrefix(prefix);
            object.setKey(key);
            object.setName(getName(key));
            object.setObject(true);
            object.setSize(s3Object.getSize());
            object.setLastModified(s3Object.getLastModified());
            object.setStorageClass(s3Object.getStorageClass());
            list.add(object);
        }

        Map<String, String> map = new HashMap<>();
        map.put(S3Constansts.CONTINUATIONTOKEN, result.getNextContinuationToken());
        map.put(S3Constansts.ISTRUNCATED, BooleanUtils.toStringTrueFalse(result.isTruncated()));

        Response response = new Response();
        response.getList().addAll(list);
        response.getMap().putAll(map);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "copyObject", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response copyObject(@RequestBody Map<String, String> map) {
        String srcBucketName = map.get(S3Constansts.SRC_BUCKETNAME);
        String dstBucketName = map.get(S3Constansts.DST_BUCKETNAME);
        String srcKey = map.get(S3Constansts.SRC_KEY);
        String dstKey = map.get(S3Constansts.DST_KEY);

        s3BrowserService.copyObject(srcBucketName, srcKey, dstBucketName, dstKey);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "moveObject", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response moveObject(@RequestBody Map<String, String> map) {
        String srcBucketName = map.get(S3Constansts.SRC_BUCKETNAME);
        String dstBucketName = map.get(S3Constansts.DST_BUCKETNAME);
        String srcKey = map.get(S3Constansts.SRC_KEY);
        String dstKey = map.get(S3Constansts.DST_KEY);

        s3BrowserService.moveObject(srcBucketName, srcKey, dstBucketName, dstKey);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "renameObject", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response renameObject(@RequestBody Map<String, String> map) {
        String bucketName = map.get(S3Constansts.BUCKETNAME);
        String srcKey = map.get(S3Constansts.SRC_KEY);
        String newKey = map.get(S3Constansts.NEW_KEY);

        s3BrowserService.renameObject(bucketName, srcKey, newKey);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "deleteObject", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response deleteObject(@RequestBody Map<String, String> map) {
        String bucketName = map.get(S3Constansts.BUCKETNAME);
        String key = map.get(S3Constansts.KEY);

        if (key.endsWith(S3Constansts.DELIMITER)) {
            s3BrowserService.deleteFolder(bucketName, key);
        } else {
            s3BrowserService.deleteObject(bucketName, key);
        }

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "getObjectProperty", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getObjectProperty(@RequestParam String bucketName,
                                      @RequestParam String key) {
        S3ObjectInfo object = s3BrowserService.getObjectProperty(bucketName, key);

        Response response = new Response();
        response.setObject(object);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "getObjectAcl", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getObjectAcl(@RequestParam String bucketName,
                                 @RequestParam String key) {
        AccessControlList acl = s3BrowserService.getObjectAcl(bucketName, key);

        Response response = new Response();
        response.getList().addAll(generateGrants(acl));
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "getObjectAsString", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response getObjectAsString(@RequestParam String bucketName,
                                      @RequestParam String key,
                                      @RequestParam(required = false) long size) throws IOException {
        String content = s3BrowserService.getObjectAsString(bucketName, key, size);

        Response response = new Response();
        response.setObject(content);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "upload", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public Response uploadObject(HttpServletRequest req) throws IOException {
        DefaultMultipartHttpServletRequest request = (DefaultMultipartHttpServletRequest) req;

        String bucketName = request.getParameter(S3Constansts.BUCKETNAME);
        String key = request.getParameter(S3Constansts.KEY);
        MultipartFile file = request.getFile(S3Constansts.FILE);

        s3BrowserService.upload(bucketName, key, file);

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Response download(HttpServletResponse res,
                                   @RequestParam String bucketName,
                                   @RequestParam String key) throws IOException {
        S3Object object = s3BrowserService.getObject(bucketName, key);
        InputStream objectData = object.getObjectContent();

        res.setHeader("Content-Length", "" + object.getObjectMetadata().getContentLength());
        res.setHeader("Content-Transfer-Encoding", "binary");
        res.setHeader("Content-Type", "application/force-download");
        res.setHeader("Content-Disposition",
                MessageFormatter.format("attachment; filename={};", getName(key)).getMessage());
        res.setStatus(200);

        FileCopyUtils.copy(objectData, res.getOutputStream());
        res.flushBuffer();
        objectData.close();

        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @ExceptionHandler
    public @ResponseBody Response handle(Exception e) {
        Response response = new Response();
        response.setSuccess(false);

        if (e instanceof AmazonServiceException | e instanceof AmazonS3Exception) {
            response.getError().setMessage(((AmazonServiceException) e).getErrorMessage());
        } else {
            response.getError().setMessage(e.getMessage());
        }
        return response;
    }

    private String getName(String key) {
        if (StringUtils.isEmpty(key)) {
            return "";
        }
        String[] strArray = StringUtils.split(key, S3Constansts.DELIMITER);
        return strArray[strArray.length - 1];
    }

    private List<S3ObjectInfo> getBucketList() {
        List<Bucket> buckets = s3BrowserService.listBuckets();
        List<S3ObjectInfo> list = new ArrayList<>();
        for (Bucket bucket : buckets) {
            S3ObjectInfo object = new S3ObjectInfo();
            object.setBucketName(bucket.getName());
            object.setName(bucket.getName());
            object.setKey(bucket.getName());
            object.setBucket(true);
            object.setCreationDate(bucket.getCreationDate());
            object.setOwner(bucket.getOwner().getDisplayName());
            list.add(object);
        }
        return list;
    }

    private Collection<S3Grant> generateGrants(AccessControlList acl) {
        List<Grant> grants = acl.getGrantsAsList();
        Map<String, S3Grant> s3Grants = new HashMap<>();
        String name = "";
        S3Grant grant;

        for (Grant g : grants) {
            if (S3Constansts.CANONICAL_GRANTEE_TYPE_ID.equals(g.getGrantee().getTypeIdentifier())) {
                CanonicalGrantee grantee = (CanonicalGrantee) g.getGrantee();
                name = grantee.getDisplayName();
                if (StringUtils.isEmpty(name) && acl.getOwner().getId().equals(grantee.getIdentifier())) {
                    name = acl.getOwner().getDisplayName();
                }
            } else if (S3Constansts.GROUP_GRANTEE_TYPE_ID.equals(g.getGrantee().getTypeIdentifier())) {
                GroupGrantee groupGrantee = (GroupGrantee) g.getGrantee();
                name = groupGrantee.name();
            }

            if (s3Grants.containsKey(name)) {
                grant = s3Grants.get(name);
            } else {
                grant = new S3Grant();
                grant.setName(name);
            }

            grant.setPermission(g.getPermission().name());
            s3Grants.put(name, grant);
        }
        return s3Grants.values();
    }
}