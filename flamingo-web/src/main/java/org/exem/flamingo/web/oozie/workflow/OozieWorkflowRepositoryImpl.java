package org.exem.flamingo.web.oozie.workflow;

import org.exem.flamingo.shared.core.repository.PersistentRepositoryImpl;
import org.exem.flamingo.web.jdbc.FlamingoSessionTemplate;
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
  public void insert(Map param){
    this.getSqlSessionTemplate().insert(this.getNamespace() + ".insert", param);
  }
}
