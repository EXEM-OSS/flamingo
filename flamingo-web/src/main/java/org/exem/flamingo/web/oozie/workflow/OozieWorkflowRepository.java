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

import java.util.List;
import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 1..
 */
public interface OozieWorkflowRepository {
  public static final String NAMESPACE = OozieWorkflowRepository.class.getName();

  public Map selectTreeId(String jobId);
  public List<Map> listWorkflows();
  public Map getRecentWorkflow();
  public void updateWorkflow(Map param);
  public void deleteWorkflow(long id);
  public int insert(Map param);
  public int update(Map param);
}
