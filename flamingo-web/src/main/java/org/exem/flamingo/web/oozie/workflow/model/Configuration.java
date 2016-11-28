package org.exem.flamingo.web.oozie.workflow.model;

/**
 * Created by sanghyunbak on 2016. 11. 24..
 */
public class Configuration {
  private String name;
  private String value;
  private String description;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
