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

import org.exem.flamingo.shared.core.repository.PersistentRepositoryImpl;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;

/**
 * Created by Park on 2016. 8. 4..
 */
@Repository
public class HdfsBrowserRepositoryImpl extends PersistentRepositoryImpl implements HdfsBrowserRepository {

    @Override
    public String getNamespace() {
        return this.NAMESPACE;
    }

    @Autowired
    public HdfsBrowserRepositoryImpl(SqlSessionTemplate sqlSessionTemplate) {
        super.setSqlSessionTemplate(sqlSessionTemplate);
    }

    @Override
    public Map select(Map params) {
        return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".select", params);
    }

    @Override
    public int selectCount(Map params) {
        Map resultMap = this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectCount", params);
        return Integer.parseInt(resultMap.get("cnt").toString());
    }

    @Override
    public void insert(Map params) {
        this.getSqlSessionTemplate().insert(this.getNamespace() + ".insert", params);
    }

    @Override
    public void update(Map params) {
        this.getSqlSessionTemplate().update(this.getNamespace() + ".update", params);
    }

    @Override
    public void delete(Map params) {
        this.getSqlSessionTemplate().delete(this.getNamespace() + ".delete", params);
    }
}
