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

import java.util.UUID;

/**
 * Immutable Universally Unique Identifier (UUID)를 생성하는 Generator.
 * <p>
 * <pre>
 * String uuid = UUIDUtils.generateUUID();
 * </pre>
 * </p>
 *
 * @author Byoung Gon, Kim
 * @since 2.0
 */
public class UUIDUtils {

    /**
     * 고유한 UUID를 생성한다.
     *
     * @return 생성된 UUID
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString();
    }

}