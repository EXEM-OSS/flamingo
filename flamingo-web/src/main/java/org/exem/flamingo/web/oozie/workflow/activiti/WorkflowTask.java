package org.exem.flamingo.web.oozie.workflow.activiti;

import java.util.Map;

/**
 * Created by sanghyunbak on 2016. 12. 6..
 */
public class WorkflowTask {

  private String taskId;
  private String taskName;
  private String wid;
  private String activiti;
  private Map properties;

  public WorkflowTask() {

  }

  public WorkflowTask(String taskId, String taskName, String wid, String activiti, Map properties) {
    this.taskId = taskId;
    this.taskName = taskName;
    this.wid = wid;
    this.activiti = activiti;
    this.properties = properties;
  }

  public String getTaskId() {
    return taskId;
  }

  public void setTaskId(String taskId) {
    this.taskId = taskId;
  }

  public String getTaskName() {
    return taskName;
  }

  public void setTaskName(String taskName) {
    this.taskName = taskName;
  }

  public String getWid() {
    return wid;
  }

  public void setWid(String wid) {
    this.wid = wid;
  }

  public String getActiviti() {
    return activiti;
  }

  public void setActiviti(String activiti) {
    this.activiti = activiti;
  }

  public Map getProperties() {
    return properties;
  }

  public void setProperties(Map properties) {
    this.properties = properties;
  }

  @Override
  public String toString() {
    return "WorkflowTask{" +
            "taskId='" + taskId + '\'' +
            ", taskName='" + taskName + '\'' +
            ", wid='" + wid + '\'' +
            ", activiti='" + activiti + '\'' +
            ", properties=" + properties +
            '}';
  }
}
