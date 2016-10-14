/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.shared.util;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.SystemUtils;
import org.exem.flamingo.shared.core.exception.ServiceException;

import java.io.File;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * File Utility.
 *
 * @author Byoung Gon, Kim
 * @since 2.0
 */
public class FileUtils {

    public static long KB = 1024L;
    public static long MB = KB * KB;
    public static long GB = MB * KB;
    public static long TB = GB * KB;
    public static long PB = TB * KB;
    public static long ZB = PB * KB;

    /**
     * 지정한 파일의 최근 변경된 시간을 반환한다.
     *
     * @param filename 파일명
     * @return 변경된 시간. 만약에 파일이 존재하지 않거나 입출력 에러가 발생하면 0L을 반환한다.
     */
    public static long lastModified(final String filename) {
        return new File(filename).lastModified();
    }

    /**
     * 지정한 경로에서 파일명만 추출한다. 예) "mypath/myfile.txt" -> "myfile.txt".
     *
     * @param path 파일 경로(<tt>null</tt>이 될 수도 있음)
     * @return 추출된 파일명 또는 파일명이 없는 경우 <tt>null</tt>
     */
    public static String getFilename(String path) {
        return org.springframework.util.StringUtils.getFilename(path);
    }

    /**
     * 지정한 경로에서 파일의 확장자를 추출한다. 예) "mypath/myfile.txt" -> "txt".
     *
     * @param path 파일 경로(<tt>null</tt>이 될 수도 있음)
     * @return the extracted filename extension, or <tt>null</tt> if none
     */
    public static String getFilenameExtension(String path) {
        return org.springframework.util.StringUtils.getFilenameExtension(path);
    }

    /**
     * 지정한 경로에서 파일의 확장자를 제외한 경로를 반환한다. 예) "mypath/myfile.txt" -> "mypath/myfile".
     *
     * @param path 파일 경로(<tt>null</tt>이 될 수도 있음)
     * @return 확장자가 삭제된 파일의 경우 또는 파일이 없다면 <tt>null</tt>
     */
    public static String stripFilenameExtension(String path) {
        return org.springframework.util.StringUtils.stripFilenameExtension(path);
    }

    /**
     * Fully Qualified Path에서 마지막 Path Separator를 기준으로 좌측 경로를 반환한다.
     *
     * @param fullyQualifiedPath Fully Qualified Path
     * @return 마지막 Path Separator를 기준으로 좌측 경로
     */
    public static String getPath(String fullyQualifiedPath) {
        int sep = fullyQualifiedPath.lastIndexOf(SystemUtils.FILE_SEPARATOR);
        if (sep != 0) {
            return fullyQualifiedPath.substring(0, sep);
        }
        return SystemUtils.FILE_SEPARATOR;
    }

    /**
     * Fully Qualified Path에서 마지막 Path Separator를 기준으로 우측 경로를 반환한다.
     *
     * @param fullyQualifiedPath Fully Qualified Path
     * @return 마지막 Path Separator를 기준으로 우측 경로
     */
    public static String getDirectoryName(String fullyQualifiedPath) {
        int lastIndex = fullyQualifiedPath.lastIndexOf(SystemUtils.FILE_SEPARATOR);
        return fullyQualifiedPath.substring(lastIndex + 1);
    }

    /**
     * 파일시스템 경로에서 마지막에 위치한 구분자를 기준으로 우측 마지막 경로명을 반환한다.
     * ex. /home/cloudine/flamingo/web -> web
     * Path 문자열이 길 경우 getDirectoryName() 메소드 대신 사용 : String index out of range
     *
     * @param path 파일시스템 경로
     * @return  마지막 구분자를 기준으로 우측 경로
     */
    public static String getLastPathName(String path) {
        String separator = SystemUtils.FILE_SEPARATOR;
        return org.apache.commons.lang.StringUtils.substringAfterLast(path, separator);
    }

    /**
     * 피일시스템 경로에서 잘못된 문자열의 포함 여부를 검증한다.
     *
     * @param path  파일시스템 경로
     * @return  true or false
     */
    public static boolean pathValidator(String path) {
        String[] invalidString = {"//", "/ /", "null"};
        for (String str : invalidString) {
            if (org.apache.commons.lang.StringUtils.contains(path, String.valueOf(str))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Fully Qualified Path에서 마지막 Path Separator를 기준으로 좌측 경로에 교체할 디렉토리 또는 파일명을 적용한다.
     *
     * @param fullyQualifiedPath Fully Qualified Path
     * @param replacement        교체할 파일명 또는 디렉토리명
     * @return 교체할 파일명 또는 디렉토리가 적용된 fully qualified path
     */
    public static String replaceLast(String fullyQualifiedPath, String replacement) {
        String path = getPath(fullyQualifiedPath);
        if (path.endsWith(SystemUtils.FILE_SEPARATOR)) {
            return path + replacement;
        }
        return path + SystemUtils.FILE_SEPARATOR + replacement;
    }

    /**
     * 지정한 URL에 대해서 Input Stream을 반환한다.
     *
     * @param url URL
     * @return Input Stream
     */
    public static InputStream openStream(String url) {
        String message = ExceptionUtils.getMessage("URL '{}' 리소스에 대해서 Input Stream을 얻을 수 없습니다.", url);
        try {
            return new URL(url).openStream();
        } catch (MalformedURLException ex) {
            if (ex.getMessage().contains("no protocol") && url.startsWith("/")) {
                try {
                    return new URL("file:" + url).openStream();
                } catch (Exception e) {
                    throw new ServiceException(message, e);
                }
            }
            throw new ServiceException(message, ex);
        } catch (Exception ex) {
            throw new ServiceException(message, ex);
        }
    }

    /**
     * 지정한 URL에 대해서 리소스가 존재하는지 확인한다.
     *
     * @param url URL
     * @return 존재하는 경우 <tt>true</tt>
     */
    public static boolean isExist(String url) {
        String message = ExceptionUtils.getMessage("URL '{}' 리소스에 대해서 Input Stream을 얻을 수 없습니다.", url);
        InputStream inputStream = null;
        try {
            inputStream = new URL(url).openStream();
            return true;
        } catch (MalformedURLException ex) {
            if (ex.getMessage().contains("no protocol") && url.startsWith("/")) {
                try {
                    inputStream = new URL("file:" + url).openStream();
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
            return false;
        } catch (Exception ex) {
            return false;
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
    }
}
