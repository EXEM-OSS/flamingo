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
import org.exem.flamingo.web.model.rest.Tree;
import org.exem.flamingo.web.oozie.workflow.model.Action;
import org.exem.flamingo.web.oozie.workflow.model.Data;
import org.exem.flamingo.web.oozie.workflow.model.Workflow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Timestamp;
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

  @Value("#{config['oozie.jobTracker.url']}")
  private String jobTracker;

  @Value("#{config['oozie.nameNode.url']}")
  private String nameNode;

  @Value("#{config['oozie.xml.store.path']}")
  private String xmlStorePath;

  @RequestMapping(value = "action", method = RequestMethod.POST)
  @ResponseStatus(HttpStatus.OK)
  public Response Action(@RequestBody Map<String, Object> params) {
    Response response = new Response();
    Map map = new HashMap<String, Object>();

    try {

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
      data.setExec("ls");
      data.setJobTracker(jobTracker);
      data.setNameNode(nameNode);
      // make hierarchical object
      shellAction.setData(data);
      //make kill action
      Action killAction = new Action();
      killAction.setCategory("kill");
      killAction.setName("killAction");
      killAction.setMessage("fail to shell action!!");
      // set actions
      actions.add(shellAction);
      actions.add(killAction);
      // add actions to workflow
      workflow.setActions(actions);
      // set object to map
      //map.put("workflow", workflow);
      map = new BeanMap(workflow);

      String xmlString = oozieWorkflowService.makeShellActionXml(map);
      String result = oozieWorkflowService.localOozieJobSend(xmlString);
      logger.info("result : {}", result);

    } catch (IOException e) {
      e.printStackTrace();
    } catch (Exception e) {
      e.printStackTrace();
    }

    response.setSuccess(true);
    return response;
  }

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
      String result = oozieWorkflowService.localOozieJobSend(xmlString);
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

  @RequestMapping("/insert")
  public Response insert(@RequestParam Map param) {

    Response response = new Response();

//    String treeId = param.get("treeId").toString();

    //TODO : param을 통해서 입력 받도록 개발 필요
    Map tmpMap = new HashMap();
    tmpMap.put("workflowId", "workflowTestId");
    tmpMap.put("workflowName", "workflowName");
    tmpMap.put("workflowXml", "<xmlTest2/>");
    tmpMap.put("designerXml", "<xmlTest/>");
    tmpMap.put("status", "Running");
    tmpMap.put("treeId", 1);
    tmpMap.put("username", "flamingo");


//    if (StringUtils.isEmpty(treeId)) {
//      saved = oozieWorkflowService.saveAsNew(parentTreeId, xml, username);
//    } else {
//      saved = oozieWorkflowService.saveAsUpdate(treeId, processId, xml, username);
//    }


    try{
      oozieWorkflowService.insert(tmpMap);
      response.setSuccess(true);
    }catch (Exception e){
      response.setSuccess(false);
    }

    return response;
  }

  @RequestMapping("/update")
  public Response updateWorkflow(@RequestParam Map param) {
    Response response = new Response();

    //TODO : param을 통해서 입력 받도록 개발 필요
    Map tmpMap = new HashMap();
    tmpMap.put("workflowId", "UpdateWorkflowTestId");
    tmpMap.put("workflowName", "UpdateWorkflowName");
    tmpMap.put("workflowXml", "<xmlTest2Update/>");
    tmpMap.put("designerXml", "<xmlTestUpdate/>");
    tmpMap.put("status", "Update");
    tmpMap.put("treeId", 1);
    tmpMap.put("username", "flamingo_update");

    try{
      oozieWorkflowService.updateWorkflow(tmpMap);
      response.setSuccess(true);
    }catch (Exception e){
      response.setSuccess(false);
    }

    return response;
  }

  @RequestMapping("/delete")
  public Response deleteWorkflow(@RequestParam Map param) {
    Response response = new Response();

    //TODO : param을 통해서 입력 받도록 개발 필요
    Map map = oozieWorkflowService.getRecentWorkflow();
    long id = (long)map.get("id");
    try{
      oozieWorkflowService.deleteWorkflow(id);
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

//    oozieWorkflowService.saveAsNew(parentTreeId, xml, "admin");
//
//    response.setSuccess(true);
//    return response;
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
}
