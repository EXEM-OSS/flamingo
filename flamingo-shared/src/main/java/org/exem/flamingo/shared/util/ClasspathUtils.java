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

import org.springframework.core.io.Resource;

/**
 * Java Classpath Utilty.
 *
 * @author Byoung Gon, Kim
 * @since 2.0
 */
public class ClasspathUtils {

    /**
     * CLASSPATH 내에 지정한 경로의 리소스가 존재하는지 확인한다.
     *
     * @param name 경로를 포함한 리소스의 위치
     * @return 존재하는 경우 <tt>true</tt>
     */
    public static boolean isExist(String name) {
        Resource resource = ResourceUtils.getResource("classpath:" + name);
        return resource.isReadable();
    }

}
