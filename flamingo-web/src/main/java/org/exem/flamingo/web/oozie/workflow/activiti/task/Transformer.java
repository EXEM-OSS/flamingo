package org.exem.flamingo.web.oozie.workflow.activiti.task;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.*;
import org.activiti.bpmn.model.Process;
import org.activiti.engine.impl.util.io.InputStreamSource;
import org.apache.commons.lang.StringEscapeUtils;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.model.opengraph.Opengraph;
import org.exem.flamingo.shared.util.JVMIDUtils;
import org.exem.flamingo.shared.util.JaxbUtils;
import org.exem.flamingo.shared.util.JsonUtils;
import org.exem.flamingo.shared.util.StringUtils;
import org.exem.flamingo.web.oozie.workflow.activiti.WorkflowTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;

import static org.apache.commons.lang.StringUtils.splitPreserveAllTokens;

/**
 * Created by sanghyunbak on 2016. 12. 6..
 */
@Component
public class Transformer implements InitializingBean {

  public String JAXB_PACKAGE = "org.exem.flamingo.shared.model.opengraph";
  @Autowired
  @Qualifier("taskProps")
  Properties taskProps;
  /**
   * SLF4J Logging
   */
  private Logger logger = LoggerFactory.getLogger(Transformer.class);
  private ObjectMapper objectMapper = new ObjectMapper();
  private BpmnXMLConverter converter = new BpmnXMLConverter();
  private String defaultTask;
//  @Autowired
//  private WorkflowRepository workflowRepository;

  @Override
  public void afterPropertiesSet() throws Exception {
  }

  public Map<String, Object> getGlobalVariables(String xml) throws Exception {
    Map vars = new HashMap();
    Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal(JAXB_PACKAGE, xml);
    Map map = objectMapper.readValue(StringUtils.unescape(opengraph.getData()), Map.class);
    List globalVariables = (List) map.get("globalVariables");
    for (Object var : globalVariables) {
      Map keyvalue = (Map) var;
      vars.put(keyvalue.get("name"), keyvalue.get("value"));
    }
    return vars;
  }

  public Map<String, Map<String, Object>> getLocalVariables(String xml) throws Exception {
    Map<String, Map<String, Object>> localVariables = new HashMap<>();
    Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal(JAXB_PACKAGE, xml);
    List<Opengraph.Cell> cells = opengraph.getCell();
    Map<String, Opengraph.Cell> cellMap = new HashMap<String, Opengraph.Cell>();
    for (Opengraph.Cell cell : cells) {
      cellMap.put(cell.getId(), cell);
    }
    for (Opengraph.Cell cell : cells) {
      if (!StringUtils.isEmpty(cell.getData())) {
        Map actionParams = objectMapper.readValue(StringUtils.unescape(cell.getData()), Map.class);
        Map<String, Object> properties = filter((Map) actionParams.get("filteredProperties"));
        if ("IMAGE".equals(cell.getShapeType()) && getClassName(cell.getShapeId()).indexOf("BPMN") == -1) {
          String id = cell.getId();
          localVariables.put(id, properties);
        }
      }
    }
    return localVariables;
  }

  // 게이트웨이의 플로우들을 구한다.  플로우정보에는 Async 동작인이 Sync 동작인지 명시한다.
  public List getParallelVectors(String xml) throws Exception {
    List parallelVectors = new ArrayList();
    Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal(JAXB_PACKAGE, xml);
    List<Opengraph.Cell> cells = opengraph.getCell();
    Map<String, Opengraph.Cell> cellMap = new HashMap<>();
    for (Opengraph.Cell cell : cells) {
      cellMap.put(cell.getId(), cell);
    }
    for (Opengraph.Cell cell : cells) {
      if (!StringUtils.isEmpty(cell.getData())) {
        Map actionParams = objectMapper.readValue(StringUtils.unescape(cell.getData()), Map.class);
        Map<String, Object> properties = filter((Map) actionParams.get("properties"));
        if ("BPMN_INCLUSIVE_FORK".equals(getClassName(cell.getShapeId())) ||
                "BPMN_PARALLEL".equals(getClassName(cell.getShapeId()))) {
          String to = cell.getTo();
          String id = cell.getId();

          String[] nextNodes = splitPreserveAllTokens(to, ",");
          List list = getParallelVectorMap(properties.get("sequenceData").toString(), nextNodes, id);
          parallelVectors.addAll(list);
        }
      }
    }
    return parallelVectors;
  }
  //getParallelVectorMap

  public List<WorkflowTask> getTaskList(String xml, String processId) throws Exception {
    List list = new ArrayList();
    Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal(JAXB_PACKAGE, xml);
    List<Opengraph.Cell> cells = opengraph.getCell();

    for (Opengraph.Cell cell : cells) {
      if (!StringUtils.isEmpty(cell.getData())) {
        Map actionParams = objectMapper.readValue(StringUtils.unescape(cell.getData()), Map.class);
        Map<String, Object> properties = filter((Map) actionParams.get("properties"));

        WorkflowTask task = new WorkflowTask();
        if ("IMAGE".equals(cell.getShapeType()) && getClassName(cell.getShapeId()).indexOf("BPMN") == -1) {

          task.setTaskId(cell.getId());
          task.setTaskName(StringUtils.unescape(cell.getLabel()));
          task.setWid(processId);
          task.setActiviti(getTaskClass(cell.getShapeId()));
          task.setProperties(properties);
          list.add(task);
        }
      }
    }
    return list;
  }


  public BpmnModel unmarshall(String xml, String processId) throws Exception {
    Opengraph opengraph = (Opengraph) JaxbUtils.unmarshal(JAXB_PACKAGE, xml);
    List<Opengraph.Cell> cells = opengraph.getCell();
    // 워크플로우의 ID와 Name을 바인딩한다.
    Map map = objectMapper.readValue(StringUtils.unescape(opengraph.getData()), Map.class);
    Map wf = (Map) map.get("workflow");
    BpmnModel model = createBpmnModel(processId, (String) wf.get("name"));

    Map<String, Opengraph.Cell> cellMap = new HashMap<String, Opengraph.Cell>();
    for (Opengraph.Cell cell : cells) {
      cellMap.put(cell.getId(), cell);
    }

    EndEvent endEvent = null;
    for (Opengraph.Cell cell : cells) {
      if (!StringUtils.isEmpty(cell.getData())) {
        Map actionParams = objectMapper.readValue(StringUtils.unescape(cell.getData()), Map.class);
        Map metadata = (Map) actionParams.get("metadata");
        Map<String, Object> properties = filter((Map) actionParams.get("properties"));

        // 시작 노드를 처리한다. 시작노드 처리시 다음 노드의 연결을 같이 처리한다.
        if ("OG.shape.bpmn.E_Start".equals(cell.getShapeId())) {
          String id = cell.getId();
          String tos = cell.getTo();
          bindStart(model.getMainProcess(), id);
          String[] toArr = splitPreserveAllTokens(tos, ",");
          for (String to : toArr) {
            bindSequenceFlow(model.getMainProcess(), id, to);
          }
        }

        // 종료 노드를 처리한다. 종료노드는 이전 노드에 대한 정보를 처리할 필요가 없다.
        if ("OG.shape.bpmn.E_End".equals(cell.getShapeId())) {
          String id = cell.getId();
          endEvent = getEnd(model.getMainProcess(), id);
        }

        // 기타 노드의 경우 Task Class를 처리한다. UI에서 변수는 escaped JSON 구조로 Task Class에 값을 전달한다.
        if ("IMAGE".equals(cell.getShapeType()) && getClassName(cell.getShapeId()).indexOf("BPMN") == -1) {
          String to = cell.getTo();
          String id = cell.getId();

          // Task Class를 처리한다.
          bindServiceTask(model.getMainProcess(), id, cell.getLabel(), properties, cell.getShapeId());
          String[] nextNodes = splitPreserveAllTokens(to, ",");
          for (String nextNode : nextNodes) {
            bindSequenceFlow(model.getMainProcess(), id, nextNode);
          }
        }

        //PARALLEL 프로세스를 처리한다.
        if ("BPMN_PARALLEL".equals(getClassName(cell.getShapeId()))) {
          String to = cell.getTo();
          String id = cell.getId();
          // ParallelGateway Class를 처리한다.

          bindParallelGateway(model.getMainProcess(), id, cell.getLabel(), properties, cell.getShapeId());

          // 다음 노드를 처리한다.
          String[] nextNodes = splitPreserveAllTokens(to, ",");
          String[] sortedNextNodes = getSortedNextNodes(properties.get("sequenceData").toString(), nextNodes);

          for (String nextNode : sortedNextNodes) {

            bindSequenceFlow(model.getMainProcess(), id, nextNode);
          }
        }

        if ("BPMN_JOIN".equals(getClassName(cell.getShapeId()))) {
          String to = cell.getTo();
          String id = cell.getId();
          // ParallelGateway Class를 처리한다.

          bindJoinGateway(model.getMainProcess(), id, cell.getLabel(), properties, cell.getShapeId());
          // 다음 노드를 처리한다.
          String[] nextNodes = splitPreserveAllTokens(to, ",");
          for (String nextNode : nextNodes) {
            bindSequenceFlow(model.getMainProcess(), id, nextNode);
          }
        }
        if ("BPMN_INCLUSIVE_FORK".equals(getClassName(cell.getShapeId()))) {
          String to = cell.getTo();
          String id = cell.getId();
          // Inclusive gateway fork를 처리한다.

          bindInclusiveForkGateway(model.getMainProcess(), id, cell.getLabel(), properties, cell.getShapeId());
          // 다음 컨디셔널 시퀀스플로우를 처리한다.
          String[] nextNodes = splitPreserveAllTokens(to, ",");
          String conditionsString = String.valueOf(properties.get("conditions"));
          Map conditionMap = JsonUtils.unmarshal(conditionsString);

          String[] sortedNextNodes = getSortedNextNodes(properties.get("sequenceData").toString(), nextNodes);

          for (String nextNode : sortedNextNodes) {
            if (!conditionMap.containsKey(nextNode)) {
              throw new ServiceException("I can not find the conditions to " + nextNode + " from " + id);
            }
            bindConditionalSequenceFlow(model.getMainProcess(), id, nextNode, conditionMap.get(nextNode).toString());
          }
        }
        if ("BPMN_INCLUSIVE_JOIN".equals(getClassName(cell.getShapeId()))) {
          String to = cell.getTo();
          String id = cell.getId();
          // Inclusive gateway join 처리한다.

          bindInclusiveJoinGateway(model.getMainProcess(), id, cell.getLabel(), properties, cell.getShapeId());
          // 다음 노드를 처리한다.
          String[] nextNodes = splitPreserveAllTokens(to, ",");
          for (String nextNode : nextNodes) {
            bindSequenceFlow(model.getMainProcess(), id, nextNode);
          }
        }
      }
    }
    model.getMainProcess().addFlowElement(endEvent);
    return model;
  }

  private Opengraph.Cell getCellById(String cellId, List cells) {
    Opengraph.Cell targetcell = null;
    for (Object cell1 : cells) {
      Opengraph.Cell cell = (Opengraph.Cell) cell1;
      if (cell.getId().equals(cellId)) {
        targetcell = cell;
      }
    }
    return targetcell;
  }


  private Map<String, Object> filter(Map properties) {
    Map<String, Object> filteredProps = new HashMap<>();
    if (properties != null) {
      Set set = properties.keySet();
      for (Object obj : set) {
        String key = (String) obj;

        if (!in(key)) {
          filteredProps.put(key, properties.get(key));
        }
      }
    }
    return filteredProps;
  }

  private boolean in(String key) {
    boolean in = false;
    String[] excludes = new String[]{"numberfield", "Theme"};
    for (String exclude : excludes) {
      if (key.startsWith(exclude)) {
        in = true;
        break;
      }
    }
    return in;
  }

  public String createBpmnXML(BpmnModel bpmnModel) throws Exception {
    byte[] xml = new BpmnXMLConverter().convertToXML(bpmnModel);
    String str = new String(xml);
    String unescapeXml = StringEscapeUtils.unescapeXml(str);
    logger.info("BPMN XML = \n{}", unescapeXml);
    converter.validateModel(new InputStreamSource(new ByteArrayInputStream(unescapeXml.getBytes())));
    return unescapeXml;
  }

  public String convertUengineBpmnXml(String bpmnXML) {
    String activityString = "activiti:class=\"";
    String uengineString = "implementation=\"java:";
    bpmnXML = bpmnXML.replaceAll(activityString, uengineString);
    return bpmnXML;
    //activiti:class="
    //implementation="java:
  }

  private BpmnModel createBpmnModel(String id, String name) {
    BpmnModel model = new BpmnModel();
    Process process = new Process();
    process.setId("W" + id);
    process.setName(StringUtils.unescape(name));
    model.addProcess(process);
    return model;
  }

  private void bindStart(Process process, String id) {
    StartEvent event = new StartEvent();
    event.setId(id);
    event.setName("Start");
    process.addFlowElement(event);
  }

  private EndEvent getEnd(Process process, String id) {
    EndEvent event = new EndEvent();
    event.setId(id);
    event.setName("End");
    return event;
  }

  private void bindSequenceFlow(Process process, String source, String target) {
    SequenceFlow flow = new SequenceFlow();
    flow.setId("SF" + JVMIDUtils.generateUUID());
    flow.setSourceRef(source);
    flow.setTargetRef(target);

    flow.setConditionExpression("");
    process.addFlowElement(flow);
  }

  private void bindConditionalSequenceFlow(Process process, String source, String target, String script) {
    SequenceFlow flow = new SequenceFlow();
    flow.setId("SF" + JVMIDUtils.generateUUID());
    flow.setSourceRef(source);
    flow.setTargetRef(target);
    flow.setConditionExpression(script);

    process.addFlowElement(flow);
  }

  private void bindSubProcess(Process process, String id, String name, Map<String, Object> properties, Map metadata) {
    SubProcess subProcess = new SubProcess();
    subProcess.setId(id);
    subProcess.setName(name);
    process.addFlowElement(subProcess);
  }

  private void bindInclusiveForkGateway(Process process, String id, String name, Map<String, Object> properties, String shapeId) {
    InclusiveGateway gateway = new InclusiveGateway();

    gateway.setAsynchronous(true);
    gateway.setNotExclusive(false);


    gateway.setId(id);
    gateway.setName(StringUtils.unescape(name));
    process.addFlowElement(gateway);
  }

  private void bindInclusiveJoinGateway(Process process, String id, String name, Map<String, Object> properties, String shapeId) {
    InclusiveGateway gateway = new InclusiveGateway();

    gateway.setAsynchronous(true);
    gateway.setNotExclusive(false);

    gateway.setId(id);
    gateway.setName(StringUtils.unescape(name));
    process.addFlowElement(gateway);
  }

  private void bindParallelGateway(Process process, String id, String name, Map<String, Object> properties, String shapeId) {
    ParallelGateway gateway = new ParallelGateway();

    gateway.setAsynchronous(true);
    gateway.setNotExclusive(false);

    gateway.setId(id);
    gateway.setName(StringUtils.unescape(name));
    process.addFlowElement(gateway);
  }

  private void bindJoinGateway(Process process, String id, String name, Map<String, Object> properties, String shapeId) {
    ParallelGateway gateway = new ParallelGateway();

    gateway.setAsynchronous(true);
    gateway.setNotExclusive(false);

    gateway.setId(id);
    gateway.setName(StringUtils.unescape(name));

    process.addFlowElement(gateway);
  }

  private void bindBlockTask(Process process, String id, String name, Map<String, Object> properties) {
    ServiceTask task = new ServiceTask();
    task.setImplementation(getLockTaskClass());
    task.setImplementationType("class");

    task.getFieldExtensions().addAll(createFieldExtension(properties));
    task.setId(id);
    task.setName(StringUtils.unescape(name));
    process.addFlowElement(task);
  }

  private void bindServiceTask(Process process, String id, String name, Map<String, Object> properties, String shapeId) {
    ServiceTask task = new ServiceTask();
    task.setImplementation(getTaskClass(shapeId));
    task.setImplementationType("class");

    task.setId(id);
    task.setName(StringUtils.unescape(name));
    process.addFlowElement(task);
  }

  private String getLockTaskClass() {
    String className = "LOCK";
    String taskClassName = this.taskProps.getProperty(className);
    if (StringUtils.isEmpty(taskClassName)) {
      throw new ServiceException(MessageFormatter.format("{} of the Task Class does not exist.", className).getMessage());
    }
    return taskClassName;
  }

  private String getTaskClass(String fullyQualifiedName) {
    String className = this.getClassName(fullyQualifiedName);
    String taskClassName = this.taskProps.getProperty(className);
    if (StringUtils.isEmpty(taskClassName)) {
      throw new ServiceException(MessageFormatter.format("{} of the Task Class does not exist.", fullyQualifiedName).getMessage());
    }
    return taskClassName;
  }

  private String getClassName(String fullyQualifiedName) {
    String[] tokens = splitPreserveAllTokens(fullyQualifiedName, ".");
    return tokens[tokens.length - 1];
  }

  private List<FieldExtension> createFieldExtension(Map<String, Object> properties) {
    List<FieldExtension> fieldExtensions = new ArrayList<>();
    FieldExtension extension = new FieldExtension();
    extension.setFieldName("values");
    extension.setStringValue(StringUtils.escape(JsonUtils.format(properties)));
    fieldExtensions.add(extension);
    return fieldExtensions;
  }

  public void setDefaultTask(String defaultTask) {
    this.defaultTask = defaultTask;
  }


  //시퀀스데이터를 시퀀스넘버에 따라 순차배열한다.
  public String[] getSortedNextNodes(String sequenceData, String[] nextNodes) throws IOException {
    List<String> flowList = new ArrayList<>();
    Map<String, Integer> sequences = JsonUtils.unmarshal(sequenceData);
    Map<String, Integer> sorted_map = sortByValue(sequences);

    Set<String> nodeIds = sorted_map.keySet();
    for (String nodeId : nodeIds) {

      boolean nodeExist = false;
      //sequenceData의 정보가 실제 nextNodes에 있으면 리스트에 추가한다.
      for (String nextNode : nextNodes) {
        if (nextNode.equals(nodeId))
          nodeExist = true;
      }
      if (nodeExist)
        flowList.add(nodeId);
    }
    String[] stockArr = new String[flowList.size()];
    stockArr = flowList.toArray(stockArr);
    return stockArr;
  }

  public List getParallelVectorMap(String sequenceData, String[] nextNodes, String preNodeId) throws IOException {
    List<Map> gateVectorlist = new ArrayList<>();
    Map<String, List> vectorStore = new HashMap<>();
    Map<String, Integer> sequences = JsonUtils.unmarshal(sequenceData);
    Set<String> nodeIds = sequences.keySet();
    for (String nodeId : nodeIds) {
      Integer sequence = sequences.get(nodeId);
      String sequenceKey = String.valueOf(sequence);
      if (!vectorStore.containsKey(sequenceKey))
        vectorStore.put(sequenceKey, new ArrayList());
      List list = vectorStore.get(sequenceKey);
      list.add(nodeId);
    }

    Set<String> vectorKeys = vectorStore.keySet();
    for (String vectorKey : vectorKeys) {
      List list = vectorStore.get(vectorKey);
      boolean parallel = false;
      if (list.size() > 1) {
        parallel = true;
      }
      for (Object aList : list) {
        String toNode = aList.toString();
        boolean nodeExist = false;
        //sequenceData의 정보가 실제 nextNodes에 있으면 리스트에 추가한다.
        for (String nextNode : nextNodes) {
          if (nextNode.equals(toNode))
            nodeExist = true;
        }
        if (nodeExist) {
          Map<String, Object> vector = new HashMap<>();
          vector.put("fromNode", preNodeId);
          vector.put("toNode", toNode);
          vector.put("parallel", parallel);
          gateVectorlist.add(vector);
        }
      }
    }

    return gateVectorlist;
  }

  public <K, V extends Comparable<? super V>> Map<K, V> sortByValue(Map<K, V> map) {
    List<Map.Entry<K, V>> list =
            new LinkedList<>(map.entrySet());
    Collections.sort(list, new Comparator<Map.Entry<K, V>>() {
      public int compare(Map.Entry<K, V> o1, Map.Entry<K, V> o2) {
        return (o1.getValue()).compareTo(o2.getValue());
      }
    });

    Map<K, V> result = new LinkedHashMap<>();
    for (Map.Entry<K, V> entry : list) {
      result.put(entry.getKey(), entry.getValue());
    }
    return result;
  }

}

