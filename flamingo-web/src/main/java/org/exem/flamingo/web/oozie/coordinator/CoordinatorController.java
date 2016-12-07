package org.exem.flamingo.web.oozie.coordinator;

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
import org.apache.oozie.client.CoordinatorJob;
import org.apache.oozie.client.OozieClient;
import org.apache.oozie.client.OozieClientException;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.rest.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by seungmin on 2016. 8. 11..
 */

@RestController
@RequestMapping("/oozie/coordinator")
public class CoordinatorController {

    @Autowired
    private OozieClient oozieClient;

    @Autowired
    CoordinatorService coordinatorService;

    @Value("${oozie.server.url}")
    private String OOZIE_SERVER_URL;

    @Value("${oozie.query.url}")
    private String OOZIE_QUERY_URL;

    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping(value = "run", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public Response getHdfsBrowserAuthDetail(@RequestBody Map params) {
        Response response = new Response();

        try {
            coordinatorService.run(params);

            response.setSuccess(true);
        }
        catch (Exception ex) {
            throw new ServiceException("Oozie coordinator를 실행하는 중 오류가 발생하였습니다.");
        }

        return response;
    }

    @RequestMapping("/select")
    public Response selectCoordinator(@RequestParam Map params) {
        Response response = new Response();

        HttpClient httpClient= new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        Map dataMap = new HashMap();
        String timezoneId = params.get("timezoneId").toString();
        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/searchCoordJob");
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
                if (data.get("next_matd_time") != null) {
                    data.put("next_matd_time", getTimeZone(data.get("next_matd_time").toString(), timezoneId));
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
            }
        } catch (Exception e) {
            throw new ServiceException("Coordinator 정보를 가져오는 중 오류가 발생하였습니다.", e);
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
        String [] items = param.get("param").toString().split(",");
        try {
            for (int i=0; i<items.length; i++){
                oozieClient.resume(items[i]);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Coordinator Job을 재시작 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/suspend")
    public Response suspendJob(@RequestParam Map param) {
        Response response = new Response();
        String [] items = param.get("param").toString().split(",");
        try {
            for (int i=0; i<items.length; i++){
                oozieClient.suspend(items[i]);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Coordinator Job을 일시중지 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/job/kill")
    public Response killJob(@RequestParam Map param) {
        Response response = new Response();
        String [] items = param.get("param").toString().split(",");
        try {
            for (int i=0; i<items.length; i++){
                oozieClient.kill(items[i]);
            }
        } catch (OozieClientException e) {
            throw new ServiceException("Coordinator Job을 종료하는 중 오류가 발생하였습니다.", e);
        }
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/action/select")
    public Response selectCoordinatorAction(@RequestParam Map params) {
        Response response = new Response();
        List<Map> actionList = new ArrayList<Map>();
        Map coordMap = new HashMap();
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
                    coordMap = objectMapper.readValue(line, Map.class);
                }
                actionList = (List<Map>) coordMap.get("actions");
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);
                for (Map action : actionList) {
                    action.put("coordJobName", coordMap.get("coordJobName"));
                    if (action.get("nominalTime") != null) {
                        action.put("nominalTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("nominalTime").toString()).getTime()), timezoneId));
                    }
                    if (action.get("lastModifiedTime") != null) {
                        action.put("lastModifiedTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("lastModifiedTime").toString()).getTime()), timezoneId));
                    }
                    if (action.get("createdTime") != null) {
                        action.put("createdTime", getTimeZone(String.valueOf(simpleDateFormat.parse(
                                action.get("createdTime").toString()).getTime()), timezoneId));
                    }
                }
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("Coordinator Action 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(actionList);
        response.setTotal(Integer.parseInt(coordMap.get("total").toString()));
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
            CoordinatorJob job = oozieClient.getCoordJobInfo(param.get("jobId").toString());
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

    @RequestMapping("/job/log/coordActionSelect")
    public Response selectCoordActionLog(@RequestParam Map param) {
        Response response = new Response();
        String coordActionLog = null;
        String[] arr = param.get("coordActionId").toString().split("@");
        String coordJobId = arr[0];
        String actionsList = arr[1];

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v2/job/" + coordJobId + "?show=log&type=action&scope=" + actionsList);
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    coordActionLog = line;
                }
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("Coordinator Action Log 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getMap().put("jobActionLog", coordActionLog);
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



