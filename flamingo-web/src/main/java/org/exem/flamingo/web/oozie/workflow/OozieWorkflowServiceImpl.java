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
import org.apache.commons.io.FileUtils;
import org.apache.hadoop.fs.Path;
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

import java.io.*;
import java.util.*;

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

  public String saveWorkflow(Map param){

    oozieWorkflowRepository.insertWorkflow(param);

    return "success";
  }
}
