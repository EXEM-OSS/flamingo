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
package org.exem.flamingo.web.filesystem.hdfs;

import java.util.Map;

/**
 * Created by Park on 2016. 8. 4..
 */
public interface HdfsBrowserRepository {

    public static final String NAMESPACE = HdfsBrowserRepository.class.getName();

    public Map select(Map params);

    public int selectCount(Map params);

    public void insert(Map params);

    public void update(Map params);

    public void delete(Map params);
}
