package org.exem.flamingo.web.oozie.workflow.model;

import org.exem.flamingo.web.model.rest.WorkflowStatusType;

import java.sql.Timestamp;
import java.util.ArrayList;

/**
 * Created by sanghyunbak on 2016. 11. 28..
 */
public class Workflow {
  private long id;

  private String workflowId;

  private String workflowName;

  private String description;

  private String variable;

  private String workflowXml;

  private String designerXml;

  private Timestamp createDate;

  private String username;

  private WorkflowStatusType status;

  private long workflowTreeId;

  private String name;

  private String startTo;

  private String endName;

  private ArrayList<Action> actions;

  public Workflow() {
  }

  public Workflow(long id) {
    this.id = id;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getWorkflowId() {
    return workflowId;
  }

  public void setWorkflowId(String workflowId) {
    this.workflowId = workflowId;
  }

  public String getWorkflowName() {
    return workflowName;
  }

  public void setWorkflowName(String workflowName) {
    this.workflowName = workflowName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getVariable() {
    return variable;
  }

  public void setVariable(String variable) {
    this.variable = variable;
  }

  public Timestamp getCreateDate() {
    return createDate;
  }

  public void setCreateDate(Timestamp createDate) {
    this.createDate = createDate;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getWorkflowXml() {
    return workflowXml;
  }

  public void setWorkflowXml(String workflowXml) {
    this.workflowXml = workflowXml;
  }

  public WorkflowStatusType getStatus() {
    return status;
  }

  public void setStatus(WorkflowStatusType status) {
    this.status = status;
  }

  public long getWorkflowTreeId() {
    return workflowTreeId;
  }

  public void setWorkflowTreeId(long workflowTreeId) {
    this.workflowTreeId = workflowTreeId;
  }

  public String getDesignerXml() {
    return designerXml;
  }

  public void setDesignerXml(String designerXml) {
    this.designerXml = designerXml;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getStartTo() {
    return startTo;
  }

  public void setStartTo(String startTo) {
    this.startTo = startTo;
  }

  public String getEndName() {
    return endName;
  }

  public void setEndName(String endName) {
    this.endName = endName;
  }

  public ArrayList<Action> getActions() {
    return actions;
  }

  public void setActions(ArrayList<Action> actions) {
    this.actions = actions;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Workflow workflow = (Workflow) o;

    if (id != workflow.id) return false;

    return true;
  }

  @Override
  public int hashCode() {
    return (int) (id ^ (id >>> 32));
  }

  @Override
  public String toString() {
    return "Workflow{" +
            "id=" + id +
            ", workflowId='" + workflowId + '\'' +
            ", workflowName='" + workflowName + '\'' +
            ", description='" + description + '\'' +
            ", variable='" + variable + '\'' +
            ", workflowXml='" + workflowXml + '\'' +
            ", designerXml='" + designerXml + '\'' +
            ", createDate=" + createDate +
            ", username='" + username + '\'' +
            ", status=" + status +
            ", workflowTreeId=" + workflowTreeId +
            '}';
  }
}
