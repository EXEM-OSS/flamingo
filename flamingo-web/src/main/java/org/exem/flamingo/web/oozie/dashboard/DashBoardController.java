package org.exem.flamingo.web.oozie.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.oozie.client.*;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.rest.Response;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/oozie/dashboard")
public class DashBoardController {

    @Autowired
    private OozieClient oozieClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${oozie.query.url}")
    private String OOZIE_QUERY_URL;

    @Value("${oozie.server.url}")
    private String OOZIE_SERVER_URL;

    @Autowired
    private DashBoardTimelineService dashboardTimelineService;

    @RequestMapping("/monitoring/workflow")
    public Response monitoringWorkflow(@RequestParam Map params) {
        Response response = new Response();
        List<Map> oozieJobs = new ArrayList<Map>();
        List<WorkflowJob> workflowJobList = new ArrayList<WorkflowJob>();
        String filter = null;
        String timezoneId = params.get("timezoneId").toString();

        if (params.get("filter") != null) {
            filter = params.get("filter").toString();
        }

        try {
            workflowJobList.addAll(oozieClient.getJobsInfo(filter));
            for (WorkflowJob wf : workflowJobList) {
                WorkflowJob wfJob = oozieClient.getJobInfo(wf.getId());

                Map oozieMap = new HashMap();
                oozieMap.put("id", wfJob.getId());
                oozieMap.put("app_name", wfJob.getAppName());
                oozieMap.put("app_path", wfJob.getAppPath());
                oozieMap.put("group_name", wfJob.getGroup());
                oozieMap.put("status", wfJob.getStatus());
                oozieMap.put("run", wfJob.getRun());
                oozieMap.put("user_name", wfJob.getUser());
                oozieMap.put("created_time", getTimeZone(String.valueOf(wfJob.getCreatedTime().getTime()), timezoneId));
                oozieMap.put("start_time", getTimeZone(String.valueOf(wfJob.getStartTime().getTime()), timezoneId));
                oozieMap.put("last_modified_time", getTimeZone(String.valueOf(wfJob.getLastModifiedTime().getTime()), timezoneId));
                if (wfJob.getEndTime() != null) {
                    oozieMap.put("end_time", getTimeZone(String.valueOf(wfJob.getEndTime().getTime()), timezoneId));
                }
                oozieMap.put("parent_id", wfJob.getParentId());
                oozieMap.put("definition", oozieClient.getJobDefinition(wfJob.getId()));
                oozieMap.put("configuration", wfJob.getConf());
                oozieMap.put("log", oozieClient.getJobLog(wfJob.getId()));
                oozieJobs.add(oozieMap);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Workflow 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.getList().addAll(oozieJobs);
        response.setTotal(oozieJobs.size());
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/coordinator")
    public Response monitoringCoordinator(@RequestParam Map params) {
        Response response = new Response();
        List<Map> coordJobs = new ArrayList<Map>();
        List<CoordinatorJob> coordinatorJobList = new ArrayList<CoordinatorJob>();
        String filter = null;
        String timezoneId = params.get("timezoneId").toString();
        if (params.get("filter") != null) {
            filter = params.get("filter").toString();
        }
        try {
            coordinatorJobList.addAll(oozieClient.getCoordJobsInfo(filter, 1, 50));
            for (CoordinatorJob coord : coordinatorJobList) {
                CoordinatorJob coordJob = oozieClient.getCoordJobInfo(coord.getId());

                Map coordMap = new HashMap();
                coordMap.put("id", coordJob.getId());
                coordMap.put("app_name", coordJob.getAppName());
                coordMap.put("app_path", coordJob.getAppPath());
                coordMap.put("group_name", coordJob.getGroup());
                coordMap.put("status", coordJob.getStatus());
                coordMap.put("frequency", coordJob.getFrequency());
                coordMap.put("user_name", coordJob.getUser());
                coordMap.put("time_unit", coordJob.getTimeUnit());
                coordMap.put("start_time", getTimeZone(String.valueOf(coordJob.getStartTime().getTime()), timezoneId));
                coordMap.put("next_matd_time", getTimeZone(String.valueOf(coordJob.getNextMaterializedTime().getTime()), timezoneId));
                if (coordJob.getEndTime() != null) {
                    coordMap.put("end_time", getTimeZone(String.valueOf(coordJob.getEndTime().getTime()), timezoneId));
                }
                coordJobs.add(coordMap);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Coordinator 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.getList().addAll(coordJobs);
        response.setTotal(coordJobs.size());
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/bundle")
    public Response monitoringBundle(@RequestParam Map params) {
        Response response = new Response();
        List<Map> bundleJobs = new ArrayList<Map>();
        List<BundleJob> bundleJobList = new ArrayList<BundleJob>();
        String filter = null;
        String timezoneId = params.get("timezoneId").toString();
        if (params.get("filter") != null) {
            filter = params.get("filter").toString();
        }
        try {
            bundleJobList.addAll(oozieClient.getBundleJobsInfo(filter, 1, 50));
            for (BundleJob bundle : bundleJobList) {
                BundleJob bundleJob = oozieClient.getBundleJobInfo(bundle.getId());

                Map bundleMap = new HashMap();
                bundleMap.put("id", bundleJob.getId());
                bundleMap.put("app_name", bundleJob.getAppName());
                bundleMap.put("app_path", bundleJob.getAppPath());
                bundleMap.put("group_name", bundleJob.getGroup());
                bundleMap.put("status", bundleJob.getStatus());
                bundleMap.put("user_name", bundleJob.getUser());
                bundleMap.put("kickoff_time", getTimeZone(String.valueOf(bundleJob.getKickoffTime().getTime()), timezoneId));
                bundleMap.put("created_time", bundleJob.getCreatedTime());
                bundleJobs.add(bundleMap);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Bundle 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.getList().addAll(bundleJobs);
        response.setTotal(bundleJobs.size());
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/workflowAction")
    public Response workflowAction(@RequestParam Map param) {
        Response response = new Response();
        List<Map> oozieActions = new ArrayList<Map>();
        List<WorkflowAction> workflowActionList = new ArrayList<WorkflowAction>();
        String timezoneId = param.get("timezoneId").toString();
        try {
            workflowActionList.addAll(oozieClient.getJobInfo(param.get("jobId").toString()).getActions());
            for (WorkflowAction wfa : workflowActionList) {
                Map oozieMap = new HashMap();
                oozieMap.put("id", wfa.getId());
                oozieMap.put("name", wfa.getName());
                oozieMap.put("type", wfa.getType());
                oozieMap.put("status", wfa.getStatus());
                oozieMap.put("transition", wfa.getTransition());
                oozieMap.put("start_time", getTimeZone(String.valueOf(wfa.getStartTime().getTime()), timezoneId));
                if (wfa.getEndTime() != null) {
                    oozieMap.put("end_time", getTimeZone(String.valueOf(wfa.getEndTime().getTime()), timezoneId));
                }
                oozieMap.put("errorCode", wfa.getErrorCode());
                oozieMap.put("externalStatus", wfa.getExternalStatus());
                oozieMap.put("errorMessage", wfa.getErrorMessage());
                oozieMap.put("consoleUrl", wfa.getConsoleUrl());
                oozieMap.put("externalId", wfa.getExternalId());
                oozieMap.put("trackerUri", wfa.getTrackerUri());
                oozieMap.put("configuration", wfa.getConf());
                oozieActions.add(oozieMap);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("WorkflowAction 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.getList().addAll(oozieActions);
        response.setTotal(oozieActions.size());
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/ganttGrid")
    public Response ganttGrid(@RequestParam Map param) {
        Response response = new Response();

        List<Map> ganttList = new ArrayList<Map>();
        List<Map> dataList = new ArrayList<Map>();
        HttpClient httpClient = new DefaultHttpClient();
        String timezoneId = param.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getWorkFlowJobByDateWithGroup");
            httpPost.setEntity(new StringEntity(gson.toJson(param), ContentType.APPLICATION_JSON));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataList = objectMapper.readValue(line, ArrayList.class);
                }
            }
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();

            String oldAppName = null;
            int hour = 0;
            String status = null;

            for (Map data : dataList) {

                if (oldAppName != null && oldAppName.equals(data.get("app_name").toString())) continue;

                oldAppName = data.get("app_name").toString();

                Map resultMap = new HashMap();

                resultMap.put("app_name", data.get("app_name"));

                for (Map data2 : dataList) {
                    if (data2.get("status").toString().equals("FAILED") ||
                            data2.get("status").toString().equals("SUCCEEDED") ||
                            data2.get("status").toString().equals("KILLED")) {
                        if (!data.get("app_name").toString().equals(data2.get("app_name").toString())) continue;

                        String strDate = getTimeZone(data2.get("start_time").toString(), timezoneId);
                        hour = Integer.parseInt(strDate.substring(strDate.indexOf(" ") + 1, strDate.indexOf(" ") + 3));

                        switch (data2.get("status").toString()) {
                            case "SUCCEEDED":
                                status = "S";
                                break;
                            case "FAILED":
                                status = "F";
                                break;
                            case "KILLED":
                                status = "K";
                                break;
                        }

                        Map map = new HashMap();

                        map.put("start_time", data2.get("start_time"));
                        map.put("status", data2.get("status"));
                        map.put("count", data2.get("count"));

                        resultMap.put("get" + status + hour, map);
                    }
                }
                ganttList.add(resultMap);
            }
        } catch (Exception e) {
                throw new ServiceException("GanttGrid 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(ganttList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/ganttGridDetail")
    public Response ganttGridDetail(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient = new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getWorkFlowJobByAppNameAndStatus");
            httpPost.setEntity(new StringEntity(gson.toJson(params), ContentType.APPLICATION_JSON));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataList = objectMapper.readValue(line, ArrayList.class);
                }
            }
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();

            for (Map data : dataList) {
                data.put("created_time", getTimeZone(data.get("created_time").toString(), timezoneId));
                data.put("last_modified_time", getTimeZone(data.get("last_modified_time").toString(), timezoneId));
                data.put("end_time", getTimeZone(data.get("end_time").toString(), timezoneId));
                data.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));
            }
        } catch (Exception e) {
            throw new ServiceException("GanttGridDetail 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/wfCount")
    public Response wfCount(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient= new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        List<Map> resultList = new ArrayList<Map>();
        Map resultMap = null;
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getWorkFlowJobCountByHour");
            httpPost.setEntity(new StringEntity(gson.toJson(params), ContentType.APPLICATION_JSON));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataList = objectMapper.readValue(line, ArrayList.class);
                }
            }
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();

            String time = "";
            for (Map data : dataList) {
                if (data.get("start_time") == null || !time.equals(data.get("start_time").toString())) {
                    if (resultMap != null) resultList.add(resultMap);

                    resultMap = new HashMap();

                    resultMap.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));

                    switch (data.get("status").toString()) {
                        case "SUCCEEDED":
                            resultMap.put("succeeded", data.get("count"));
                            resultMap.put("failed", 0);
                            resultMap.put("killed", 0);
                            break;
                        case "FAILED":
                            resultMap.put("succeeded", 0);
                            resultMap.put("failed", data.get("count"));
                            resultMap.put("killed", 0);
                            break;
                        case "KILLED":
                            resultMap.put("succeeded", 0);
                            resultMap.put("failed", 0);
                            resultMap.put("killed", data.get("count"));
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (data.get("status").toString()) {
                        case "SUCCEEDED":
                            resultMap.put("succeeded", data.get("count"));
                            break;
                        case "FAILED":
                            resultMap.put("failed", data.get("count"));
                            break;
                        case "KILLED":
                            resultMap.put("killed", data.get("count"));
                            break;
                        default:
                            break;
                    }
                }
                time = data.get("start_time").toString();
            }
            resultList.add(resultMap);
        } catch (Exception e) {
            throw new ServiceException("Workflow Count 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(resultList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/coordCount")
    public Response coordCount(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient = new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getCoordJobByStatus");
            httpPost.setEntity(new StringEntity(gson.toJson(params), ContentType.APPLICATION_JSON));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataList = objectMapper.readValue(line, ArrayList.class);
                }
            }
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();

            for (Map data : dataList) {
                data.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));
            }
        } catch (Exception e) {
            throw new ServiceException("Coordinator Count 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/bundleCount")
    public Response bundleCount(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient = new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getBundleJobByStatus");
            httpPost.setEntity(new StringEntity(gson.toJson(params), ContentType.APPLICATION_JSON));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataList = objectMapper.readValue(line, ArrayList.class);
                }
            }
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();

            for (Map data : dataList) {
                data.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));
            }
        } catch (Exception e) {
            throw new ServiceException("Bundle Count 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/totalCount")
    public Response totalCount(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient = new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getWorkFlowJobTotal");
            httpPost.setEntity(new StringEntity(gson.toJson(params), ContentType.APPLICATION_JSON));

            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataList = objectMapper.readValue(line, ArrayList.class);
                }
            }
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();

            for (Map data : dataList) {
                data.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));
            }
        } catch (Exception e) {
            throw new ServiceException("GanttGrid 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/getTimezone")
    public Response getTimezone() {
        Response response = new Response();
        List<Map> dataList = new ArrayList<Map>();
        Map map = new HashMap();

        Gson gson = new Gson();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/available-timezones");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    map = gson.fromJson(line, Map.class);
                    dataList = (List<Map>) map.get("available-timezones");
                }
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(dataList);
        response.setTotal(dataList.size());
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/workflowTimeline")
    public Response monitoringWorkflowTimeline(@RequestParam Map params) {
        Response response = new Response();

        List<Map> dataList = new ArrayList<Map>();
        List<Map> groupList = new ArrayList<Map>();
        boolean flag = true;

        dataList = dashboardTimelineService.getTimeline(params);

        for (Map data : dataList) {
            if (groupList.size() > 0) {
                for (int i=0; i<groupList.size(); i++) {
                    if (groupList.get(i).get("content").equals(data.get("app_name"))) {
                        flag = false;
                    }
                }
            }
            if (flag) {
                Map group = new HashMap();

                group.put("id", data.get("app_name"));
                group.put("content", data.get("app_name"));

                groupList.add(group);
            }
            flag = true;
        }

        response.getList().addAll(dataList);
        response.getMap().put("group", groupList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/monitoring/info")
    public Response monitoringInfo(@RequestParam Map params) {
        Response response = new Response();

        try {
            String url = MessageFormatter.arrayFormat("{}/v2/jobs?filter=status=RUNNING&len=5000",
                    new Object[]{OOZIE_SERVER_URL}
            ).getMessage().toString();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> entity = restTemplate.getForEntity(url, Map.class);
            Map map = entity.getBody();
            List<Map> workflowList = (List<Map>) map.get("workflows");

            response.getMap().put("workflow", workflowList.size());

            url = MessageFormatter.arrayFormat("{}/v2/jobs?filter=status=RUNNING&len=5000&jobtype=coord",
                    new Object[]{OOZIE_SERVER_URL}
            ).getMessage().toString();

            entity = restTemplate.getForEntity(url, Map.class);
            map = entity.getBody();

            List<Map> coordList = (List<Map>) map.get("coordinatorjobs");

            response.getMap().put("coordinator", coordList.size());

            url = MessageFormatter.arrayFormat("{}/v2/jobs?filter=status=RUNNING&len=5000&jobtype=bundle",
                    new Object[]{OOZIE_SERVER_URL}
            ).getMessage().toString();

            entity = restTemplate.getForEntity(url, Map.class);
            map = entity.getBody();

            List<Map> bundleList = (List<Map>) map.get("bundlejobs");

            response.getMap().put("bundle", bundleList.size());

        } catch (Exception ex) {
            ex.printStackTrace();
            response.setSuccess(false);
        }

        return response;
    }

    @RequestMapping("/monitoring/workflowStatusCount")
    public Response monitoringWorkflowStatusCount(@RequestParam Map params) {
        Response response = new Response();
        HttpClient httpClient = new DefaultHttpClient();
        Map dataMap = new HashMap();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getWorkFlowJobCountByDate");
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
            httpPost.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("Workflow Status Count 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getMap().put("ALL", dataMap.get("ALL") == null ? 0 : dataMap.get("ALL"));
        response.getMap().put("SUCCEEDED", dataMap.get("SUCCEEDED") == null ? 0 : dataMap.get("SUCCEEDED"));
        response.getMap().put("FAILED", dataMap.get("FAILED") == null ? 0 : dataMap.get("FAILED"));
        response.getMap().put("KILLED", dataMap.get("KILLED") == null ? 0 : dataMap.get("KILLED"));
        response.getMap().put("SUSPENDED", dataMap.get("SUSPENDED") == null ? 0 : dataMap.get("SUSPENDED"));
        response.getMap().put("RUNNING", dataMap.get("RUNNING") == null ? 0 : dataMap.get("RUNNING"));
        response.getMap().put("PREP", dataMap.get("PREP") == null ? 0 : dataMap.get("PREP"));

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
