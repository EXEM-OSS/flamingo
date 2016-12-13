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

import org.exem.flamingo.web.oozie.workflow.model.Workflow;

import java.util.List;
import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 1..
 */
public interface OozieWorkflowRepository {
  public static final String NAMESPACE = OozieWorkflowRepository.class.getName();

  Map selectTreeId(String jobId);
  List<Map> listWorkflows();
  Map getRecentWorkflow();
  void updateWorkflow(Map param);
  void deleteWorkflowByTreeId(long treeId);
  int insert(Map param);
  int update(Map param);
  Workflow selectByTreeId(long treeId);
}
