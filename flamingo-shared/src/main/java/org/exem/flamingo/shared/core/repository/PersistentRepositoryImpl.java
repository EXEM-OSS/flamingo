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
package org.exem.flamingo.shared.core.repository;

/**
 * Persistence Object의 공통 CRUD를 제공하는 Repository의 구현체.
 *
 * @author Byoung Gon, Kim
 * @since 2.0
 */
public abstract class PersistentRepositoryImpl<D, P> extends DefaultSqlSessionDaoSupport implements PersistentRepository<D, P> {

    /**
     * MyBatis의 SQL Query를 실행하기 위한 SQLMap의 네임스페이스를 반환한다.
     * 일반적으로 이것의 이름은 Repository의 fully qualifed name을 사용한다.
     *
     * @return SQLMap의 네임스페이스
     */
    public abstract String getNamespace();

    @Override
    public int insert(D object) {
        return this.getSqlSessionTemplate().insert(this.getNamespace() + ".insert", object);
    }

    @Override
    public int update(D object) {
        return this.getSqlSessionTemplate().update(this.getNamespace() + ".update", object);
    }

    @Override
    public int delete(P identifier) {
        return this.getSqlSessionTemplate().delete(this.getNamespace() + ".delete", identifier);
    }

    @Override
    public D select(P identifier) {
        return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".select", identifier);
    }

    @Override
    public boolean exists(P identifier) {
        return (Integer) this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".exist", identifier) > 0;
    }
}