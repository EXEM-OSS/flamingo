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

import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import org.activiti.bpmn.model.FlowElement;
import org.apache.commons.io.FileUtils;
import org.apache.hadoop.fs.Path;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.model.opengraph.Opengraph;
import org.exem.flamingo.shared.util.JaxbUtils;
import org.exem.flamingo.shared.util.JsonUtils;
import org.exem.flamingo.web.model.rest.NodeType;
import org.exem.flamingo.web.model.rest.Tree;
import org.exem.flamingo.web.model.rest.TreeType;
import org.exem.flamingo.web.model.rest.WorkflowStatusType;
import org.exem.flamingo.web.oozie.workflow.activiti.task.Transformer;
import org.exem.flamingo.web.oozie.workflow.model.Workflow;
import org.exem.flamingo.web.oozie.workflow.tree.TreeService;
import org.exem.flamingo.web.util.FreeMarkerUtils;
import org.exem.flamingo.web.util.HdfsUtils;
import org.exem.flamingo.web.util.XmlFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.oozie.client.OozieClient;
import org.apache.oozie.client.WorkflowJob;
import org.activiti.bpmn.model.BpmnModel;

import javax.xml.bind.JAXBException;
import java.io.*;
import java.sql.Timestamp;
import java.util.*;

import static org.exem.flamingo.shared.util.DateUtils.getCurrentDateTime;
import static org.exem.flamingo.shared.util.EscapeUtils.unescape;
import static org.exem.flamingo.shared.util.JVMIDUtils.generateUUID;
import static org.exem.flamingo.shared.util.JsonUtils.format;
import static org.exem.flamingo.shared.util.StringUtils.escape;

/**
 * Created by Sanghyun Bak on 2016. 11. 22..
 */
@Service
public class OozieWorkflowServiceImpl implements OozieWorkflowService {

  /**
   * SLF4J Logging
   */
  private Logger logger = LoggerFactory.getLogger(OozieWorkflowServiceImpl.class);

  @Autowired
  Transformer transformer;

  @Autowired
  TreeService treeService;

  @Autowired
  OozieWorkflowRepository oozieWorkflowRepository;

  @Value("#{config['oozie.template.path']}")
  private String oozieTemplatePath;

  @Value("#{config['oozie.jobTracker.url']}")
  private String oozieJobTrackerUrl;

  @Value("#{config['oozie.xml.store.path']}")
  private String xmlStorePath;

  @Value("#{config['oozie.hdfs.workflow.path']}")
  private String oozieHdfsWorkflowPath;

  @Value("#{config['oozie.site.url']}")
  private String oozieSiteUrl;

  public String makeShellActionXml(Map param) throws IOException {
    String result = "";

    // freemarker configuration
    Configuration cfg = new Configuration(Configuration.VERSION_2_3_23);
    cfg.setDirectoryForTemplateLoading(new File(oozieTemplatePath));
    cfg.setDefaultEncoding("UTF-8");
    cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);

    try {
      result = FreeMarkerUtils.evaluate(cfg, "workflow.ftl", param);
      result = XmlFormatter.format(result);

    } catch (TemplateException e) {
      e.printStackTrace();
    }

    return result;
  }

  public String localOozieJobSend(String xmlString){
    try {
      FileUtils.writeStringToFile(new File(xmlStorePath + "/testShell.xml"), xmlString, "UTF-8");
      HdfsUtils.localFileToHdfs(xmlStorePath + "/testShell.xml", oozieHdfsWorkflowPath + "/workflow.xml");

      OozieClient wc = new OozieClient(oozieSiteUrl);

      Properties conf = wc.createConfiguration();
      conf.setProperty(OozieClient.APP_PATH, new Path(oozieHdfsWorkflowPath, "workflow.xml").toString());
      String jobId = wc.run(conf);
      Thread.sleep(1000);

      while (wc.getJobInfo(jobId).getStatus() == WorkflowJob.Status.RUNNING) {
        logger.info("Workflow job running ...");
        Thread.sleep(10 * 1000);
      }

      logger.info("Workflow job {} is completed ...", jobId);
    } catch (Exception e) {
      e.printStackTrace();
      return "fail";
    }

    return "Success!";
  }

  public List<Map> getWorkflows(){
    List<Map> topologyList = new ArrayList<>();
    topologyList = oozieWorkflowRepository.listWorkflows();
    // TODO : 전처리 필요 시 처리 로직 구현
    return topologyList;
  }

  public Map getRecentWorkflow(){
    Map workflow = new HashMap();
    workflow = oozieWorkflowRepository.getRecentWorkflow();
    // TODO : 전처리 필요 시 처리 로직 구현
    return workflow;
  }

  public void updateWorkflow(Map param){
    oozieWorkflowRepository.updateWorkflow(param);
  }

  public void deleteWorkflow(long id){
    oozieWorkflowRepository.deleteWorkflow(id);
  }

  public void insert(Map param){
    oozieWorkflowRepository.insert(param);
  }

  public Map<String, Object> save(WorkflowStatusType status, String processId, String workflowName,
                                  String designerXml, String workflowXml, Map<String, Object> variable,
                                  long treeId, long steps, String username) {
    Map<String, Object> params = new HashMap<>();
    params.put("workflowId", processId);
    params.put("workflowName", workflowName);
    params.put("variable", escape(format(variable)));
    params.put("workflowXml", workflowXml);
    params.put("designerXml", designerXml);
    params.put("create", new Timestamp(new Date().getTime()));
    params.put("treeId", treeId);
    params.put("username", username);

    if (status == WorkflowStatusType.CREATED) {
      params.put("status", WorkflowStatusType.REGISTERED);
      oozieWorkflowRepository.insert(params);
    } else if (status == WorkflowStatusType.REGISTERED) {
      params.put("status", WorkflowStatusType.REGISTERED);
      oozieWorkflowRepository.update(params);
    } else if (status == WorkflowStatusType.COPIED) {
      params.put("status", WorkflowStatusType.REGISTERED);
      oozieWorkflowRepository.insert(params);
    } else {
      logger.info("CREATED, REGISTERED, COPIED state did not come to save the workflow.");
    }
    return params;
  }

  @Override
  public Map<String, Object> saveAsNew(String parentTreeId, String xml, String username) {
    try {
      Map<String, Object> variable = new HashMap<>();
      Map<String, Map<String, Object>> localVariables = transformer.getLocalVariables(xml);
      Map<String, Object> globalVariables = transformer.getGlobalVariables(xml);
      List parallelVectors = transformer.getParallelVectors(xml);
      variable.put("local", localVariables);
      variable.put("global", globalVariables);
      variable.put("parallelVectors", parallelVectors);

      // 신규 Process ID를 생성한다.
      String newProcessId = getCurrentDateTime() + "_" + generateUUID();

      // BPMN 모델을 생성한다.
      BpmnModel bpmnModel = transformer.unmarshall(xml, newProcessId);

      // 트리 노드를 생성한다.
      Tree parent;
      if ("/".equals(parentTreeId)) {
        parent = treeService.getRoot(TreeType.WORKFLOW, username);
      } else {
        parent = treeService.get(Long.parseLong(parentTreeId));
      }

      Tree tree = new Tree(bpmnModel.getMainProcess().getName());
      tree.setTreeType(TreeType.WORKFLOW);
      tree.setNodeType(NodeType.ITEM);
      tree.setUsername(username);

      Tree child = treeService.create(parent, tree, NodeType.ITEM);
      String designerXml = getDesignerXml(child.getId(), newProcessId, xml, WorkflowStatusType.REGISTERED.toString());
      String workflowXml = transformer.convertUengineBpmnXml(transformer.createBpmnXML(bpmnModel));

      Map<String, Object> saved = save(WorkflowStatusType.CREATED,
              newProcessId, bpmnModel.getMainProcess().getName(),
              designerXml, workflowXml, variable, child.getId(),
              getSteps(bpmnModel.getMainProcess().getFlowElements()), username);

      logger.info("The process has been saved : {}", saved);

      return saved;
    } catch (Exception ex) {
      throw new ServiceException("You can not save a new workflow", ex);
    }
  }
//
//  // TODO : Tree 부분 구현하기
//  @Override
//  public Map<String, Object> saveAsNew(String parentTreeId, String xml, String username) {
//    try {
//      Map<String, Object> variable = new HashMap<>();
//      Map<String, Map<String, Object>> localVariables = transformer.getLocalVariables(xml);
//      Map<String, Object> globalVariables = transformer.getGlobalVariables(xml);
//      List parallelVectors = transformer.getParallelVectors(xml);
//      variable.put("local", localVariables);
//      variable.put("global", globalVariables);
//      variable.put("parallelVectors", parallelVectors);
//
//      // 신규 Process ID를 생성한다.
//      String newProcessId = getCurrentDateTime() + "_" + generateUUID();
//
//      // BPMN 모델을 생성한다.
//      BpmnModel bpmnModel = transformer.unmarshall(xml, newProcessId);
//
//      String bpmnXml = transformer.createBpmnXML(bpmnModel);
//
//      // 트리 노드를 생성한다.
////      Tree parent;
////      if ("/".equals(parentTreeId)) {
////        parent = treeService.getRoot(TreeType.WORKFLOW, username);
////      } else {
////        parent = treeService.get(Long.parseLong(parentTreeId));
////      }
////
////      //Tree tree = new Tree(bpmnModel.getMainProcess().getName());
////      tree.setTreeType(TreeType.WORKFLOW);
////      tree.setNodeType(NodeType.ITEM);
////      tree.setUsername(username);
////
////      //Tree child = treeService.create(parent, tree, NodeType.ITEM);
////      String designerXml = getDesignerXml(child.getId(), newProcessId, xml, WorkflowStatusType.REGISTERED.toString());
//      String designerXml = getDesignerXml(1, newProcessId, xml, WorkflowStatusType.REGISTERED.toString());
//      String workflowXml = transformer.convertUengineBpmnXml(transformer.createBpmnXML(bpmnModel));
//
//      // 1-> child.getId
//      Map<String, Object> saved = save(WorkflowStatusType.CREATED,
//              newProcessId, bpmnModel.getMainProcess().getName(),
//              designerXml, workflowXml, variable, 1,
//              getSteps(bpmnModel.getMainProcess().getFlowElements()), username);
//
//      logger.info("The process has been saved : {}", saved);
//
//      return saved;
//    } catch (Exception ex) {
//      throw new ServiceException("You can not save a new workflow", ex);
//    }
//  }

  @Override
  public Map<String, Object> saveAsUpdate(String treeId, String processId, String xml, String username) {
    try {
      Map<String, Object> variable = new HashMap<>();
      Map<String, Map<String, Object>> localVariables = transformer.getLocalVariables(xml);
      Map<String, Object> globalVariables = transformer.getGlobalVariables(xml);
      List parallelVectors = transformer.getParallelVectors(xml);
      variable.put("local", localVariables);
      variable.put("global", globalVariables);
      variable.put("parallelVectors", parallelVectors);

      //  BPMN 모델을 생성한다.
      BpmnModel model = transformer.unmarshall(xml, processId);
      Tree tree = treeService.get(Long.parseLong(treeId));
      tree.setName(model.getMainProcess().getName());
      treeService.rename(tree);
      String workflowXml = transformer.convertUengineBpmnXml(transformer.createBpmnXML(model));
      String designerXml = getDesignerXml(tree.getId(), processId, xml, WorkflowStatusType.REGISTERED.toString());

      Map<String, Object> saved = save(WorkflowStatusType.REGISTERED,
              processId, model.getMainProcess().getName(), designerXml,
              workflowXml, variable, tree.getId(),
              getSteps(model.getMainProcess().getFlowElements()), username);

      logger.info("The process has been saved : {}", saved);

      return saved;
    } catch (Exception ex) {
      throw new ServiceException("You can not update a workflow", ex);
    }
  }

  private String getDesignerXml(long treeId, String processId, String xml, String status) throws JAXBException, IOException {
    //Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal("org.opencloudengine.flamingo2.model.opengraph", xml);
    Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal(transformer.JAXB_PACKAGE, xml);
    Map map = JsonUtils.unmarshal(unescape(opengraph.getData()));
    Map<String, Object> workflow = (Map<String, Object>) map.get("workflow");

    workflow.put("process_id", processId);
    workflow.put("status", status);
    workflow.put("tree_id", treeId);

    opengraph.setData(escape(format(map)));

    return JaxbUtils.marshal(transformer.JAXB_PACKAGE, opengraph);
  }

  private long getSteps(Collection<FlowElement> flowElements) {
    int count = 0;
    for (FlowElement element : flowElements) {
      switch (element.getClass().getName()) {
        case "org.activiti.bpmn.model.ServiceTask":
        case "org.activiti.bpmn.model.SubProcess":
        case "org.activiti.bpmn.model.UserTask":
        case "org.activiti.bpmn.model.BusinessRuleTask":
          count++;
          break;
        default:
          break;
      }
    }
    return count;
  }

  @Override
  public String loadDesignerXml(Long treeId) {
    Workflow workflow = oozieWorkflowRepository.selectByTreeId(treeId);
    return workflow.getDesignerXml();
  }

  public Map getLocalvariables(String xml) throws Exception {
    Map<String, Map<String, Object>> localVariables = transformer.getLocalVariables(xml);
    return localVariables;
  }

  public String getLocalVariableParameter(String xml, String key) throws Exception {
    Map<String, Map<String, Object>> localVariables = transformer.getLocalVariables(xml);
    Map params = (Map)localVariables.values().toArray()[0];
    return params.get(key).toString();
  }
}
