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

import org.apache.commons.beanutils.BeanMap;
import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.shared.util.StringUtils;
import org.exem.flamingo.web.model.rest.NodeType;
import org.exem.flamingo.web.model.rest.Tree;
import org.exem.flamingo.web.model.rest.TreeType;
import org.exem.flamingo.web.oozie.workflow.model.Action;
import org.exem.flamingo.web.oozie.workflow.model.Data;
import org.exem.flamingo.web.oozie.workflow.model.Workflow;
import org.exem.flamingo.web.oozie.workflow.tree.TreeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

/**
 * Oozie workflow controller.
 *
 * @author Sanghyun Bak
 * @since 21.10.2016
 */

@RestController
@RequestMapping("/oozie/workflow")
public class OozieWorkflowController {

  /**
   * SLF4J Logging
   */
  private Logger logger = LoggerFactory.getLogger(OozieWorkflowController.class);

  @Autowired
  OozieWorkflowService oozieWorkflowService;

  @Autowired
  TreeService treeService;

  @Value("#{config['oozie.jobTracker.url']}")
  private String jobTracker;

  @Value("#{config['oozie.nameNode.url']}")
  private String nameNode;

  @Value("#{config['oozie.xml.store.path']}")
  private String xmlStorePath;

  @RequestMapping(value = "run", method = RequestMethod.POST)
  @ResponseStatus(HttpStatus.OK)
  public Response Run(@RequestBody Map<String, Object> params) {
    Response response = new Response();
    Map map = new HashMap<String, Object>();

    try {
      String treeIdString = params.get("treeId").toString();
      long treeId = Long.parseLong(treeIdString);
      String designerXml = oozieWorkflowService.loadDesignerXml(treeId);
      String script = oozieWorkflowService.getLocalVariableParameter(designerXml, "script");

      // TODO : 아래 로직을 DB에서 꺼내와야 하며, 리펙토링 필요
      // set workflow
      Workflow workflow = new Workflow();
      workflow.setName(params.get("name").toString());
      workflow.setStartTo("testStartTo");
      workflow.setEndName("testEndName");
      // set shell action
      ArrayList actions = new ArrayList<Action>();
      Action shellAction = new Action();
      shellAction.setName("testStartTo");
      shellAction.setCategory("action");
      shellAction.setOkTo("testEndName");
      shellAction.setErrorTo("killAction");
      // set data
      Data data = new Data();
      data.setType("shell");
      data.setExec(script);
      data.setJobTracker(jobTracker);
      data.setNameNode(nameNode);
      // make hierarchical object
      shellAction.setData(data);
      //make default kill action
      Action killAction = new Action("kill", "killAction", "action fail!");
      // set actions
      actions.add(shellAction);
      actions.add(killAction);
      // add actions to workflow
      workflow.setActions(actions);
      // set object to map
      map = new BeanMap(workflow);

      String xmlString = oozieWorkflowService.makeShellActionXml(map);
      String result = oozieWorkflowService.oozieJobSend(xmlString);
      logger.info("result : {}", result);

    } catch (IOException e) {
      e.printStackTrace();
    } catch (Exception e) {
      e.printStackTrace();
    }

    response.setSuccess(true);
    return response;
  }

  @RequestMapping("/list")
  public Response listWorkflow(@RequestParam Map param) {

    Response response = new Response();
    List<Map> workflows = oozieWorkflowService.getWorkflows();
    response.getList().addAll(workflows);

    return response;
  }

  @RequestMapping(value = "/delete", method = RequestMethod.POST)
  public Response deleteWorkflow(@RequestBody Map param) {
    Response response = new Response();

    long treeId = Long.parseLong(param.get("id").toString());
    try{
      oozieWorkflowService.deleteWorkflow(treeId);
      response.setSuccess(true);
    }catch (Exception e){
      response.setSuccess(false);
    }

    return response;
  }

  //TODO : 하드코딩 된 admin 로그인 기능 추가 시 변경해야 함
  @RequestMapping("/save")
  public Response save(@RequestParam(defaultValue = "") String clusterName,
                       @RequestParam(defaultValue = "") String processId,
                       @RequestParam(defaultValue = "") String treeId,
                       @RequestParam(defaultValue = "") String parentTreeId,
                       @RequestBody String xml) {

    Response response = new Response();

    String username = "admin";
    Map saved = new HashMap();

    if (StringUtils.isEmpty(treeId)) {
      saved = oozieWorkflowService.saveAsNew(parentTreeId, xml, username);
    } else {
      saved = oozieWorkflowService.saveAsUpdate(treeId, processId, xml, username);
    }

    response.getMap().put("id", saved.get("id"));
    response.getMap().put("process_id", saved.get("workflowId"));
    response.getMap().put("process_definition_id", saved.get("definitionId"));
    response.getMap().put("deployment_id", saved.get("deploymentId"));
    response.getMap().put("tree_id", saved.get("treeId"));
    response.getMap().put("status", saved.get("status"));
    response.setSuccess(true);
    return response;

  }

  @RequestMapping(value = "/load", method = RequestMethod.GET)
  @ResponseStatus(HttpStatus.OK)
  //public Response load(@RequestParam String clusterName, @RequestParam Long treeId) {
  public Response load(@RequestParam Long treeId) {
    Response response = new Response();
    String designerXml = oozieWorkflowService.loadDesignerXml(treeId);

    response.setObject(designerXml);
    response.setSuccess(true);
    return response;
  }

  /**
   * 새로운 노드를 생성한다. 노드를 생성하기 위해서 필요한 것은 다음과 같다.
   * <ul>
   * <li>부모 노드의 ID</li>
   * <li>생성할 Tree의 유형(예; <tt>JOB, WORKFLOW</tt>)</li>
   * <li>노드의 유형(예; <tt>FOLDER, ITEM</tt>)(</li>
   * <li>노드의 이름(</li>
   * <li>ROOT 노드 여부(기본값은 <tt>false</tt>)(</li>
   * </ul>
   *
   * @param map 노드 생성을 위한 Key Value
   * @return Response REST JAXB Object
   */
  @RequestMapping(value = "newFolder", method = RequestMethod.POST)
  @ResponseStatus(HttpStatus.OK)
  @ResponseBody
  public Response newFolder(@RequestBody Map<String, String> map) {

    Response response = new Response();
    TreeType treeType = TreeType.valueOf(map.get("treeType").toUpperCase());
    NodeType nodeType = NodeType.valueOf(map.get("nodeType").toUpperCase());

    Tree parent;

    if ("/".equals(map.get("id"))) {
      // ROOT 노드라면 Tree Type의 ROOT 노드를 부모 노드로 설정한다.
      //TODO : SessionUtils.getUsername() 으로 admin 대체
      parent = treeService.getRoot(treeType, "admin");
    } else {
      // 새로운 노드를 추가하기 위해서 부모 노드를 먼저 알아낸다.
      long parentId = Long.parseLong(map.get("id"));
      parent = treeService.get(parentId);
    }

    Tree child = new Tree();
    child.setName(map.get("name"));
    child.setTreeType(treeType);
    child.setNodeType(nodeType);
    child.setRoot(false);
    //TODO : SessionUtils.getUsername() 으로 admin 대체
    child.setUsername("admin");
    child.setParent(parent);

    // 부모 노드에 속한 자식 노드를 생성하고 그 결과를 구성한다.
    Tree tree = treeService.create(parent, child, nodeType);
    response.getMap().put("id", tree.getId());
    response.getMap().put("text", tree.getName());
    response.getMap().put("cls", "folder");
    response.getMap().put("leaf", false);
    response.setSuccess(true);
    return response;
  }

  @RequestMapping(value = "/copy", method = RequestMethod.POST)
  public Response copy(@RequestBody Map<String, Object> map) {

    Response response = new Response();

    String parentTreeId = map.get("parentTreeId").toString();
    String treeId = map.get("treeId").toString();
    //TODO : SessionUtils.getUsername() 으로 admin 대체
    Workflow workflow = oozieWorkflowService.getWorkflowByTreeId(Long.parseLong(treeId));
    oozieWorkflowService.copy(parentTreeId, workflow, "admin");

    response.setSuccess(true);
    return response;
  }
}
