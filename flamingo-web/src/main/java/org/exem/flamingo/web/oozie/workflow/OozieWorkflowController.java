package org.exem.flamingo.web.oozie.workflow;

import org.apache.commons.beanutils.BeanMap;
import org.exem.flamingo.shared.core.rest.Response;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

  @RequestMapping("/save")
  public Response saveWorkflow(@RequestParam Map param) {

    Response response = new Response();

    //TODO : param을 통해서 입력 받도록 개발 필요
    Map tmpMap = new HashMap();
    tmpMap.put("workflow_id", "workflowTestId");
    tmpMap.put("workflow_name", "workflowName");
    tmpMap.put("workflow_xml", "<xmlTest2/>");
    tmpMap.put("designer_xml", "<xmlTest/>");
    tmpMap.put("status", "Running");
    tmpMap.put("tree_id", "1");
    tmpMap.put("username", "flamingo");

    try{
      oozieWorkflowService.saveWorkflow(tmpMap);
      response.setSuccess(true);
    }catch (Exception e){
      response.setSuccess(false);
    }

    return response;
  }
}
