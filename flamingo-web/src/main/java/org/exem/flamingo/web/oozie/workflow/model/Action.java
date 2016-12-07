package org.exem.flamingo.web.oozie.workflow.model;

/**
 * Created by sanghyunbak on 2016. 11. 24..
 */
public class Action {

  private Data data;
  private String category;
  private String name;
  private String cred;
  private String retryMax;
  private String retryInterval;
  private String retryPolicy;
  private String okTo;
  private String errorTo;
  private String message;

  public Action(){}

  public Action(String category, String name, String message) {
    this.category = category;
    this.name = name;
    this.message = message;
  }

  public Data getData() {
    return data;
  }

  public void setData(Data data) {
    this.data = data;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCred() {
    return cred;
  }

  public void setCred(String cred) {
    this.cred = cred;
  }

  public String getRetryMax() {
    return retryMax;
  }

  public void setRetryMax(String retryMax) {
    this.retryMax = retryMax;
  }

  public String getRetryInterval() {
    return retryInterval;
  }

  public void setRetryInterval(String retryInterval) {
    this.retryInterval = retryInterval;
  }

  public String getRetryPolicy() {
    return retryPolicy;
  }

  public void setRetryPolicy(String retryPolicy) {
    this.retryPolicy = retryPolicy;
  }

  public String getOkTo() {
    return okTo;
  }

  public void setOkTo(String okTo) {
    this.okTo = okTo;
  }

  public String getErrorTo() {
    return errorTo;
  }

  public void setErrorTo(String errorTo) {
    this.errorTo = errorTo;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
