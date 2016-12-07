package org.exem.flamingo.web.oozie.workflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.apache.commons.lang.SystemUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.oozie.client.OozieClient;
import org.apache.oozie.client.OozieClientException;
import org.apache.oozie.client.WorkflowJob;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.shared.core.security.SessionUtils;
import org.exem.flamingo.web.filesystem.FileSystemService;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/oozie/workflow")
public class WorkflowController {

    @Autowired
    private OozieClient oozieClient;

    @Value("#{hadoop['namenode.agent.address']}")
    private String namenodeAgentAddress;

    @Value("#{hadoop['namenode.agent.port']}")
    private String namenodeAgentPort;

    @Value("#{hadoop['wap.address']}")
    private String wapAddress;

    @Value("#{hadoop['wap.port']}")
    private String wapPort;

    @Autowired
    HttpClient httpClient;

    @Autowired
    FileSystemService fileSystemService;

    @Value("${oozie.server.url}")
    private String OOZIE_SERVER_URL;

    @Value("${oozie.query.url}")
    private String OOZIE_QUERY_URL;

    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping("/select")
    public Response selectWorkflow(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient= new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        Map dataMap = new HashMap();
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/searchWorkFlowJob");
            httpPost.setEntity(new StringEntity(gson.toJson(params), ContentType.APPLICATION_JSON));
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, Map.class);
                }
            }
            dataList = (List<Map>) dataMap.get("data");
            httpPost.abort();;
            httpClient.getConnectionManager().shutdown();
            for (Map data : dataList) {
                if (data.get("start_time") != null) {
                    data.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));
                }
                if (data.get("end_time") != null) {
                    data.put("end_time", getTimeZone(data.get("end_time").toString(), timezoneId));
                }
                if (data.get("created_time") != null) {
                    data.put("created_time", getTimeZone(data.get("created_time").toString(), timezoneId));
                }
                if (data.get("last_modified_time") != null) {
                    data.put("last_modified_time", getTimeZone(data.get("last_modified_time").toString(), timezoneId));
                }
            }
        } catch (Exception e) {
            throw new ServiceException("Workflow 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(dataList);
        response.setTotal(Integer.parseInt(dataMap.get("totalCount").toString()));
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/definition/select")
    public Response selectJobDefinition(@RequestParam Map param) {
        Response response = new Response();
        try {
            response.getMap().put("jobDefinition", oozieClient.getJobDefinition(param.get("jobId").toString()));
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job Definition 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }
    @RequestMapping("/job/configuration/select")
    public Response selectJobConfiguration(@RequestParam Map param) {
        Response response = new Response();
        try {
            WorkflowJob job = oozieClient.getJobInfo(param.get("jobId").toString());
            response.getMap().put("jobConfiguration", job.getConf());
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job Configuration 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/log/select")
    public Response selectJobLog(@RequestParam Map param) {
        Response response = new Response();
        try {
            String log = oozieClient.getJobLog(param.get("jobId").toString());

            response.getMap().put("jobLog", log);
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job Log 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/detail")
    public Response selectJobDetail(@RequestParam Map param) {
        Response response = new Response();
        try {
            WorkflowJob job = oozieClient.getJobInfo(param.get("jobId").toString());
            response.getMap().put("jobConfiguration", job.getConf());
            response.getMap().put("jobDefinition", oozieClient.getJobDefinition(param.get("jobId").toString()));
            String log = oozieClient.getJobLog(param.get("jobId").toString());

            response.getMap().put("jobLog", log);
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job Log 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/action/select")
    public Response selectWorkflowAction(@RequestParam Map params) {
        Response response = new Response();
        List<Map> actionList = new ArrayList<Map>();
        Map wfMap = new HashMap();
        String jobId = params.get("jobId").toString();
        String timezoneId = params.get("timezoneId").toString();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v2/job/" + jobId + "?show=info&timezone=" + timezoneId);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    wfMap = objectMapper.readValue(line, Map.class);
                }
                actionList = (List<Map>) wfMap.get("actions");
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);
                for (Map action : actionList) {
                    action.put("wf_app_name", wfMap.get("appName"));
                    action.put("wf_app_path", wfMap.get("appPath"));
                    action.put("wf_parent", wfMap.get("parentId"));
                    action.put("wf_conf", wfMap.get("conf"));
                    action.put("wf_job_id", wfMap.get("id"));
                    if (action.get("startTime") != null) {
                        action.put("startTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("startTime").toString()).getTime()), timezoneId));
                    }
                    if (action.get("endTime") != null) {
                        action.put("endTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("endTime").toString()).getTime()), timezoneId));
                    }
                }
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("WorkflowAction 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(actionList);
        response.setSuccess(true);
        return response;
    }

	@RequestMapping("/job/resume")
    public Response jobRestart(@RequestParam Map param) {
        Response response = new Response();
        try {
            oozieClient.resume(param.get("jobId").toString());
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job을 재시작 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/suspend")
    public Response suspendJob(@RequestParam Map param) {
        Response response = new Response();
        try {
            oozieClient.suspend(param.get("jobId").toString());
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job을 일시중지 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/kill")
    public Response killJob(@RequestParam Map param) {
        Response response = new Response();
        try {
            oozieClient.kill(param.get("jobId").toString());
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow Job을 종료하는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/definition/save")
    public Response definitionSave(@RequestParam Map params) throws IOException {
        Response response = new Response();

        String fileName = params.get("fileName").toString();
        if (fileName.endsWith("W")) {
            fileName = "workflow.xml";
        } else if (fileName.endsWith("C")) {
            fileName = "coordinator.xml";
        } else if (fileName.endsWith("B")) {
            fileName = "bundle.xml";
        }
        boolean checked = Boolean.parseBoolean(params.get("checked").toString());
        String fullyQualifiedPath = params.get("path").toString().equals("/") ? params.get("path").toString() + fileName
                : params.get("path").toString() + SystemUtils.FILE_SEPARATOR + fileName;
        String username = SessionUtils.getUsername();
        String definition = params.get("definition").toString();

        InputStream inputStream = new ByteArrayInputStream(definition.getBytes());

        if (checked) {
            List<String> deletedFiles = fileSystemService.deleteFiles(fileName, fullyQualifiedPath, username);
        }

        String namenodeAgentUrl =
                MessageFormatter.arrayFormat("http://{}:{}/remote/agent/transfer/upload?fullyQualifiedPath={}&username={}",
                        new Object[]{namenodeAgentAddress, namenodeAgentPort,
                                URLEncoder.encode(fullyQualifiedPath, "UTF-8"), username}).getMessage();

        HttpPost httpPost = new HttpPost(namenodeAgentUrl);
        HttpEntity reqEntity = new InputStreamEntity(inputStream);
        httpPost.setEntity(reqEntity);
        HttpResponse execute = execute = httpClient.execute(httpPost);

        if (execute.getStatusLine().getStatusCode() == 500) {
            response.setSuccess(false);
            response.getError().setMessage("동일한 파일명이 존재합니다.");
        } else if (execute.getStatusLine().getStatusCode() == 600) {
            response.setSuccess(false);
            response.getError().setMessage("루트(/)는 권한을 변경할 수 없습니다.");
        } else {
            response.setSuccess(true);
        }

        inputStream.close();
        httpPost.releaseConnection();
        return response;
    }

    @RequestMapping("/action/childUrl")
    public Response childUrl(@RequestParam Map params) {
        Response response = new Response();
        List<Map> actionList = new ArrayList<Map>();
        List<Map> resultList = new ArrayList<Map>();
        Map wfMap = new HashMap();
        String jobId = params.get("jobId").toString();
        String timezoneId = params.get("timezoneId").toString();
        String actionId = params.get("actionId").toString();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v2/job/" + jobId + "?show=info&timezone=" + timezoneId);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    wfMap = objectMapper.readValue(line, Map.class);
                }
                actionList = (List<Map>) wfMap.get("actions");
                for (Map action : actionList) {
                    if (action.get("externalChildIDs") == null) continue;
                    if (action.get("id").toString().equals(actionId)) {
                        String[] children = action.get("externalChildIDs").toString().split(",");
                        for (int i=0; i<children.length; i++) {
                            Map child = new HashMap();
                            child.put("child_url", "http://" + wapAddress + ":" + wapPort + "/proxy/" + children[i].replace("job", "application"));
                            resultList.add(child);
                        }
                    }
                }
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("Child Url 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(resultList);
        response.setSuccess(true);
        return response;
    }

    public static String getTimeZone(String gmt, String timezoneId) {
        Date date = new Date(Long.parseLong(gmt));
        String format = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setTimeZone(TimeZone.getTimeZone(timezoneId));
        return sdf.format(date);
    }
}
