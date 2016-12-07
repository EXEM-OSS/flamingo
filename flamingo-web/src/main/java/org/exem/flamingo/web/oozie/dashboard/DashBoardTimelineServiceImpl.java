package org.exem.flamingo.web.oozie.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by park on 2016. 10. 19..
 */

@Service
public class DashBoardTimelineServiceImpl implements DashBoardTimelineService {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${oozie.query.url}")
    private String OOZIE_QUERY_URL;

    private final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss";

    private final String CONTENT_STRING = "<div class=\"task-assignment-timeline-content\" " +
            "data-toggle=\"tooltip\" " +
            "data-placement=\"top\" " +
            "data-html=\"true\" " +
            "data-container=\"body\"data-title=\"State: {}<br>Start Time: {}<br>End Time: {}<br>ID: {}\">" +
            "<svg class=\"task-assignment-timeline-duration-bar\">" +
            "<rect class=\"{}\" x=\"0%\" y=\"0px\" height=\"26px\" width=\"100%\"></rect>" +
            "</svg>";

    @Override
    public List<Map> getTimeline(Map params) {
        HttpClient httpClient = new DefaultHttpClient();
        List<Map> dataList = new ArrayList<Map>();
        String timezoneId = params.get("timezoneId").toString();
        Gson gson = new Gson();

        try {
            HttpPost httpPost = new HttpPost(OOZIE_QUERY_URL + "/getWorkFlowJobByDate");
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

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATEFORMAT);
            String content;

            Collections.sort(dataList, new KeyValueComparator());

            for (Map data : dataList) {
                data.put("id", data.get("id"));
                data.put("className", "task task-assignment-timeline-object " + data.get("status"));
                data.put("start", data.get("start_time"));
                if (data.get("end_time") == null) {
                    data.put("end", "");
                } else {
                    data.put("end", data.get("end_time"));
                }
                data.put("group", data.get("app_name"));

                content = MessageFormatter.arrayFormat(CONTENT_STRING, new Object[]{
                        data.get("status"),
                        simpleDateFormat.format(data.get("start_time")),
                        data.get("end_time") == null ? "" : simpleDateFormat.format(data.get("end_time")),
                        data.get("id"),
                        data.get("status").equals("SUCCEEDED") ? "vis-item SUCCEEDED" : "vis-item FAILED"
                }).getMessage();

                data.put("content", content);
            }
        } catch (Exception e) {
            throw new ServiceException("timeline 차트를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        return dataList;
    }

    private class KeyValueComparator implements Comparator {
        public int compare(Object o1, Object o2) {
            Map map1 = (Map) o1;
            Map map2 = (Map) o2;

            return map1.get("id").toString().compareTo(map2.get("id").toString());
        }
    }
}

