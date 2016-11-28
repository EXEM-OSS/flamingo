package org.exem.flamingo.web.oozie.workflow;

import org.apache.commons.io.Charsets;
import org.apache.commons.io.FileUtils;
import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.web.oozie.workflow.model.Action;
import org.exem.flamingo.web.oozie.workflow.model.Data;
import org.exem.flamingo.web.oozie.workflow.model.Workflow;
import org.exem.flamingo.web.util.FreeMarkerUtils;
import org.exem.flamingo.web.util.XmlFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
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
      // set workflow
      Workflow workflow = new Workflow();
      workflow.setName(params.get("name").toString());
      workflow.setStartTo("testStartTo");
      workflow.setEndName("testEndName");
      // set shell action
      ArrayList actions = new ArrayList<Action>();
      Action shellAction = new Action();
      shellAction.setName("test Shell action");
      shellAction.setCategory("action");
      shellAction.setOkTo("okTo");
      shellAction.setErrorTo("errorTo");
      // set data
      Data data = new Data();
      data.setType("shell");
      data.setExec("ls");
      data.setJobTracker(jobTracker);
      data.setNameNode(nameNode);
      // make hierarchical object
      shellAction.setData(data);
      actions.add(shellAction);
      workflow.setActions(actions);
      // set object to map
      map.put("workflow", workflow);
      String xmlString = oozieWorkflowService.makeShellActionXml(map);
      String result = oozieWorkflowService.localOozieJobSend(xmlString);
      // file write
      FileUtils.writeStringToFile(new File(xmlStorePath + "/testShell.xml"), xmlString, "UTF-8");

    } catch (IOException e) {
      e.printStackTrace();
    }

    response.setSuccess(true);
    return response;
  }
}
