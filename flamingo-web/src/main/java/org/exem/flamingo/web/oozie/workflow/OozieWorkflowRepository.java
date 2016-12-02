package org.exem.flamingo.web.oozie.workflow;

import java.util.List;
import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 1..
 */
public interface OozieWorkflowRepository {
  public static final String NAMESPACE = OozieWorkflowRepository.class.getName();

  public Map selectTreeId(String jobId);
  public List<Map> list();
}
