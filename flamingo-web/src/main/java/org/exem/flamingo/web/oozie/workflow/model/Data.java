package org.exem.flamingo.web.oozie.workflow.model;

import freemarker.template.Configuration;

import java.util.ArrayList;

/**
 * Created by sanghyunbak on 2016. 11. 24..
 */
public class Data {

  private ArrayList<Prepare> prepares;
  private String jobTracker;
  private String nameNode;
  private String jobXml;
  private String exec;
  private String type;
  private Configuration configuration;
  private ArrayList <String> args;
  private ArrayList <String> envVars;
  private ArrayList <String> files;
  private ArrayList <String> archives;
  private Boolean captureOutput;

  public ArrayList<Prepare> getPrepares() {
    return prepares;
  }

  public void setPrepares(ArrayList<Prepare> prepares) {
    this.prepares = prepares;
  }

  public String getJobTracker() {
    return jobTracker;
  }

  public void setJobTracker(String jobTracker) {
    this.jobTracker = jobTracker;
  }

  public String getNameNode() {
    return nameNode;
  }

  public void setNameNode(String nameNode) {
    this.nameNode = nameNode;
  }

  public String getJobXml() {
    return jobXml;
  }

  public void setJobXml(String jobXml) {
    this.jobXml = jobXml;
  }

  public String getExec() {
    return exec;
  }

  public void setExec(String exec) {
    this.exec = exec;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Configuration getConfiguration() {
    return configuration;
  }

  public void setConfiguration(Configuration configuration) {
    this.configuration = configuration;
  }

  public ArrayList<String> getArgs() {
    return args;
  }

  public void setArgs(ArrayList<String> args) {
    this.args = args;
  }

  public ArrayList<String> getEnvVars() {
    return envVars;
  }

  public void setEnvVars(ArrayList<String> envVars) {
    this.envVars = envVars;
  }

  public ArrayList<String> getFiles() {
    return files;
  }

  public void setFiles(ArrayList<String> files) {
    this.files = files;
  }

  public ArrayList<String> getArchives() {
    return archives;
  }

  public void setArchives(ArrayList<String> archives) {
    this.archives = archives;
  }

  public Boolean getCaptureOutput() {
    return captureOutput;
  }

  public void setCaptureOutput(Boolean captureOutput) {
    this.captureOutput = captureOutput;
  }
}
