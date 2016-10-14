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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by Park on 2016. 8. 4..
 */
@Service
public class HdfsBrowserServiceImpl implements HdfsBrowserService {

    @Autowired
    HdfsBrowserRepository repository;

    @Override
    public void save(Map params) {
        int cnt = repository.selectCount(params);

        if (params.get("max_value") == null) {
            repository.delete(params);
        }
        else {
            if (cnt == 0) {
                repository.insert(params);
            }
            else {
                repository.update(params);
            }
        }


    }
}
