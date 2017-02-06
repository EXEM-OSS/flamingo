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
package org.exem.flamingo.web.oozie.workflowdesigner;

import org.exem.flamingo.shared.core.repository.PersistentRepositoryImpl;
import org.exem.flamingo.web.jdbc.FlamingoSessionTemplate;
import org.exem.flamingo.web.oozie.workflowdesigner.model.Workflow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 1..
 */

@Repository
public class OozieWorkflowRepositoryImpl extends PersistentRepositoryImpl implements org.exem.flamingo.web.oozie.workflowdesigner.OozieWorkflowRepository {

    @Autowired
    public OozieWorkflowRepositoryImpl(FlamingoSessionTemplate flamingoSessionTemplate) {
        super.setSqlSessionTemplate(flamingoSessionTemplate);
    }

    @Override
    public String getNamespace() {
        return this.NAMESPACE;
    }

    @Override
    public Map selectTreeId(String jobId) {
        return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectJobId", jobId);
    }

    @Override
    public List<Map> listWorkflows() {
        return this.getSqlSessionTemplate().selectList(this.getNamespace() + ".listWorkflows");
    }

    @Override
    public Map getRecentWorkflow() {
        return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectRecentWorkflow");
    }

    @Override
    public void updateWorkflow(Map param) {
        this.getSqlSessionTemplate().insert(this.getNamespace() + ".updateWorkflow", param);
    }

    @Override
    public void deleteWorkflowByTreeId(long treeId) {
        this.getSqlSessionTemplate().delete(this.getNamespace() + ".deleteByTreeId", treeId);
    }

    @Override
    public int insert(Map param) {
        return this.getSqlSessionTemplate().insert(this.getNamespace() + ".insert", param);
    }

    @Override
    public int update(Map param) {
        return this.getSqlSessionTemplate().update(this.getNamespace() + ".update", param);
    }

    @Override
    public Workflow selectByTreeId(long treeId) {
        return this.getSqlSessionTemplate().selectOne(NAMESPACE + ".selectByTreeId", treeId);
    }
}
