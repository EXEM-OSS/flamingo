package org.exem.flamingo.web.oozie.workflowdesigner.model;

import java.util.ArrayList;

/**
 * Created by sanghyunbak on 2016. 11. 28..
 */
public class Workflow {
  private String version;
  private String name;
  private ArrayList<Action> actions;
  private String startTo;
  private String endName;

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ArrayList<Action> getActions() {
    return actions;
  }

  public void setActions(ArrayList<Action> actions) {
    this.actions = actions;
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
}
