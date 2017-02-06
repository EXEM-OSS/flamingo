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

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by Sanghyun Bak on 2016. 11. 22..
 */
public interface OozieWorkflowService {

    String makeShellActionXml(Map param) throws IOException;
    String oozieJobSend(String xmlString);
    List<Map> getWorkflows();
    Workflow getWorkflowByTreeId(long treeId);
    void deleteWorkflow(long id);

    void insert(Map param);
    Map<String, Object> saveAsNew(String parentTreeId, String xml, String username);
    Map<String, Object> saveAsUpdate(String treeId, String processId, String xml, String username);
    String loadDesignerXml(Long treeId);
    String getLocalVariableParameter(String xml, String key) throws Exception;
    Map<String, Object> copy(String parentTreeId, Workflow workflow, String username);

}
