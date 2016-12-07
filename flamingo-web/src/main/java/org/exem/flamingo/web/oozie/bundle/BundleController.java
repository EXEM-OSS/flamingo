package org.exem.flamingo.web.oozie.bundle;

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
import org.apache.oozie.client.BundleJob;
import org.apache.oozie.client.OozieClient;
import org.apache.oozie.client.OozieClientException;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.rest.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by seungmin on 2016. 8. 16..
 */

@RestController
@RequestMapping("/oozie/bundle")
public class BundleController {

    @Autowired
    private OozieClient oozieClient;

    @Value("${oozie.server.url}")
    private String OOZIE_SERVER_URL;

    @Value("${oozie.query.url}")
    private String OOZIE_QUERY_URL;

    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping("/select")
    public Response selectBundle(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient= new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        Map dataMap = new HashMap();
        String timezoneId = params.get("timezoneId").toString();

        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/searchBundleJob");
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
                if (data.get("kickoff_time") != null) {
                    data.put("kickoff_time", getTimeZone(data.get("kickoff_time").toString(), timezoneId));
                }
                if (data.get("pause_time") != null) {
                    data.put("pause_time", getTimeZone(data.get("pause_time").toString(), timezoneId));
                }
                if (data.get("start_time") != null) {
                    data.put("start_time", getTimeZone(data.get("start_time").toString(), timezoneId));
                }
                if (data.get("end_time") != null) {
                    data.put("end_time", getTimeZone(data.get("end_time").toString(), timezoneId));
                }
                if (data.get("created_time") != null) {
                    data.put("created_time", getTimeZone(data.get("created_time").toString(), timezoneId));
                }
            }
        } catch (Exception e) {
            throw new ServiceException("Bundle 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        response.getList().addAll(dataList);
        response.setTotal(Integer.parseInt(dataMap.get("totalCount").toString()));
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/resume")
    public Response jobRestart(@RequestParam Map param) {
        Response response = new Response();
        String[] items = param.get("param").toString().split(",");
        try {
            for (int i = 0; i < items.length; i++) {
                oozieClient.resume(items[i]);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Bundle Job을 재시작 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/suspend")
    public Response suspendJob(@RequestParam Map param) {
        Response response = new Response();
        String[] items = param.get("param").toString().split(",");
        try {
            for (int i = 0; i < items.length; i++) {
                oozieClient.suspend(items[i]);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Bundle Job을 일시중지 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/kill")
    public Response killJob(@RequestParam Map param) {
        Response response = new Response();
        String[] items = param.get("param").toString().split(",");
        try {
            for (int i = 0; i < items.length; i++) {
                oozieClient.kill(items[i]);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Bundle Job을 종료하는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }
    @RequestMapping("/action/select")
    public Response selectBundleAction(@RequestParam Map params) {
        Response response = new Response();
        List<Map> actionList = new ArrayList<Map>();
        Map bundleMap = new HashMap();
        String offset = params.get("start").toString();
        String len = params.get("limit").toString();
        String jobId = params.get("jobId").toString();
        String timezoneId = params.get("timezoneId").toString();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v2/job/" + jobId + "?show=info&order=desc&offset=" + offset +
                "&len=" + len + "&timezone=" + timezoneId);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    bundleMap = objectMapper.readValue(line, Map.class);
                }
                actionList = (List<Map>) bundleMap.get("bundleCoordJobs");
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);
                for (Map action : actionList) {
                    action.put("bundleJobName", bundleMap.get("bundleJobName"));
                    if (action.get("lastAction") != null) {
                        action.put("lastAction", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("lastAction").toString()).getTime()), timezoneId));
                    }
                    if (action.get("startTime") != null) {
                        action.put("startTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("startTime").toString()).getTime()), timezoneId));
                    }
                    if (action.get("nextMaterializedTime") != null) {
                        action.put("nextMaterializedTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("nextMaterializedTime").toString()).getTime()), timezoneId));
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
            throw new ServiceException("Bundle Action 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(actionList);
        response.setTotal(actionList.size());
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/definition/select")
    public Response selectJobDefinition(@RequestParam Map param) {
        Response response = new Response();
        try {
            response.getMap().put("jobDefinition", oozieClient.getJobDefinition(param.get("jobId").toString()));
        } catch (OozieClientException e) {
            throw new ServiceException("Coordinator Job Definition 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/configuration/select")
    public Response selectJobConfiguration(@RequestParam Map param) {
        Response response = new Response();
        try {
            BundleJob job = oozieClient.getBundleJobInfo(param.get("jobId").toString());
            response.getMap().put("jobConfiguration", job.getConf());
        } catch (OozieClientException e) {
            throw new ServiceException("Coordinator Job Configuration 정보를 가져오는 중 오류가 발생하였습니다.", e);
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
            throw new ServiceException("Coordinator Job Log 정보를 가져오는 중 오류가 발생하였습니다.", e);
        }
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