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
package org.exem.flamingo.web.oozie.workflow;

import org.exem.flamingo.shared.core.repository.PersistentRepositoryImpl;
import org.exem.flamingo.web.jdbc.FlamingoSessionTemplate;
import org.exem.flamingo.web.oozie.workflow.model.Workflow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 1..
 */

@Repository
public class OozieWorkflowRepositoryImpl extends PersistentRepositoryImpl implements OozieWorkflowRepository {

  @Override
  public String getNamespace() {
    return this.NAMESPACE;
  }

  @Autowired
  public OozieWorkflowRepositoryImpl(FlamingoSessionTemplate flamingoSessionTemplate) {
    super.setSqlSessionTemplate(flamingoSessionTemplate);
  }

  public Map selectTreeId(String jobId) {
    return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectJobId", jobId);
  }

  public List<Map> listWorkflows() {
    return this.getSqlSessionTemplate().selectList(this.getNamespace() + ".listWorkflows");
  }

  public Map getRecentWorkflow() {
    return this.getSqlSessionTemplate().selectOne(this.getNamespace() + ".selectRecentWorkflow");
  }

  public void updateWorkflow(Map param) {
    this.getSqlSessionTemplate().insert(this.getNamespace() + ".updateWorkflow", param);
  }

  public void deleteWorkflow(long id) {
    this.getSqlSessionTemplate().delete(this.getNamespace() + ".deleteWorkflow", id);
  }

  @Override
  public int insert(Map param){
    return this.getSqlSessionTemplate().insert(this.getNamespace() + ".insert", param);
  }

  @Override
  public int update(Map param) {
    return this.getSqlSessionTemplate().update(this.getNamespace() + ".update", param);
  }

  public Workflow selectByTreeId(long treeId) {
    return this.getSqlSessionTemplate().selectOne(NAMESPACE + ".selectByTreeId", treeId);
  }
}
