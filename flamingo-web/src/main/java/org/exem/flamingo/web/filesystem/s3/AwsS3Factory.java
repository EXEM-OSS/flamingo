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

import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.PropertiesCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;

import java.io.IOException;
import java.io.InputStream;

class AwsS3Factory {

    /**
     * Classpath에서 <tt>aws.properties</tt> 파일을 로딩하여 초기화한다.
     * <tt>aws.properties</tt> 파일에는 <tt>accessKey</tt>와 <tt>secretKey</tt>이 포함되어야 한다.
     *
     * @return {@link AmazonS3}
     * @throws IOException Classpath에서 <tt>aws.properties</tt> 파일을 로딩할 수 없는 경우
     */
    public static AmazonS3 createS3Client() throws IOException {
        InputStream is = AwsS3Factory.class.getResourceAsStream("/aws.properties");
        return createS3Client(is);
    }

    /**
     * Properties의 Input Stream을 이용하여 초기화한다.
     * Properties에는 <tt>accessKey</tt>와 <tt>secretKey</tt>이 포함되어야 한다.
     *
     * @return {@link AmazonS3}
     * @throws IOException Properties 파일의 Input Stream을 로딩할 수 없는 경우
     */
    private static AmazonS3 createS3Client(InputStream is) throws IOException {
        AWSCredentials credentials = new PropertiesCredentials(is);
        ClientConfiguration clientConfig = new ClientConfiguration();
        clientConfig.setProtocol(Protocol.HTTP);
        return new AmazonS3Client(credentials, clientConfig);
    }
}