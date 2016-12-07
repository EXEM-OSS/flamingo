package org.exem.flamingo.web.oozie.systeminfo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.oozie.client.OozieClient;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.rest.Response;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("/oozie/systeminfo")
public class SystemInfoController {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${oozie.server.url}")
    private String OOZIE_SERVER_URL;

    @RequestMapping("/configuration")
    public Response configurationSelect() {
        Response response = new Response();
        Map dataMap = new HashMap();
        List<Map> dataList = new ArrayList<Map>();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/configuration");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, Map.class);
                }

                Object keyObjArr[] = dataMap.keySet().toArray();

                Map keyMap;
                for (Object key : keyObjArr) {
                    keyMap = new HashMap();

                    keyMap.put("key", key);
                    keyMap.put("value", dataMap.get(key));

                    dataList.add(keyMap);
                }

                Collections.sort(dataList, new KeyValueComparator());
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("Configuration 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/javaSystemProp")
    public Response javaSystemPropsSelect() {
        Response response = new Response();
        Map dataMap = new HashMap();
        List<Map> dataList = new ArrayList<Map>();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/java-sys-properties");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, Map.class);
                }
                Object keyObjArr[] = dataMap.keySet().toArray();

                Map keyMap;
                for (Object key : keyObjArr) {
                    keyMap = new HashMap();

                    keyMap.put("key", key);
                    keyMap.put("value", dataMap.get(key));

                    dataList.add(keyMap);
                }

                Collections.sort(dataList, new KeyValueComparator());
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("Java System Properties 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping("/osEnv")
    public Response osEnvSelect() {
        Response response = new Response();
        Map dataMap = new HashMap();
        List<Map> dataList = new ArrayList<Map>();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/os-env");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, Map.class);
                }
                Object keyObjArr[] = dataMap.keySet().toArray();

                Map keyMap;
                for (Object key : keyObjArr) {
                    keyMap = new HashMap();

                    keyMap.put("key", key);
                    keyMap.put("value", dataMap.get(key));

                    dataList.add(keyMap);
                }

                Collections.sort(dataList, new KeyValueComparator());
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            throw new ServiceException("OS Env 정보를 가져오는 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }

        response.getList().addAll(dataList);
        response.setSuccess(true);
        return response;
    }

    @RequestMapping(value = "/configuration/download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity downloadConfiguration(HttpServletResponse res) {

        Map dataMap = new HashMap();
        Document doc = new Document();
        Element root = new Element("configuration");

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/configuration");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, Map.class);
                }
                for (Object key : dataMap.keySet()) {
                    Element property = new Element("property");
                    Element name = new Element("name");
                    Element value = new Element("value");

                    name.setText(key.toString());
                    value.setText(dataMap.get(key).toString());

                    property.addContent(name);
                    property.addContent(value);

                    root.addContent(property);
                }
                doc.setRootElement(root);
            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();

            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat().setEncoding("UTF-8"));
            byte[] bytes = outputter.outputString(doc).getBytes();

            res.setHeader("Content-Length", "" + bytes.length);
            res.setHeader("Content-Type", MediaType.APPLICATION_OCTET_STREAM_VALUE);
            res.setHeader("Content-Disposition", MessageFormatter.format("attachment; path={}; filename={}", "oozie_configuration", "oozie_configuration" + ".xml").getMessage());
            res.setStatus(200);
            FileCopyUtils.copy(bytes, res.getOutputStream());
            res.flushBuffer();

        } catch (Exception e) {
            throw new ServiceException("Download 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/properties/download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity downloadProperties(HttpServletResponse res) {

        Map dataMap = new HashMap();
        StringBuilder propertiesStr = new StringBuilder();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/java-sys-properties");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;

                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, SortedMap.class);
                }

                List<Map> sortList = new ArrayList<>();

                Object keyObjArr[] = dataMap.keySet().toArray();

                Map keyMap;
                for (Object key : keyObjArr) {
                    keyMap = new HashMap();

                    keyMap.put("key", key);
                    keyMap.put("value", dataMap.get(key));

                    sortList.add(keyMap);
                }

                Collections.sort(sortList, new KeyValueComparator());

                for (Map key : sortList) {
                    propertiesStr.append(key.get("key") + "=" + key.get("value"));
                    propertiesStr.append("\n");
                }

            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();

            byte[] bytes = propertiesStr.toString().getBytes();

            res.setHeader("Content-Length", "" + bytes.length);
            res.setHeader("Content-Type", MediaType.APPLICATION_OCTET_STREAM_VALUE);
            res.setHeader("Content-Disposition", MessageFormatter.format("attachment; path={}; filename={}", "oozie_properties", "oozie_properties" + ".properties").getMessage());
            res.setStatus(200);
            FileCopyUtils.copy(bytes, res.getOutputStream());
            res.flushBuffer();

        } catch (Exception e) {
            throw new ServiceException("Download 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/shellscript/download", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity downloadShellScript(HttpServletResponse res) {

        Map dataMap = new HashMap();
        StringBuilder propertiesStr = new StringBuilder();

        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(OOZIE_SERVER_URL + "/v1/admin/os-env");
        try {
            HttpResponse httpResponse = httpClient.execute(httpGet);
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpResponse.getEntity().getContent()));
                String line = null;

                while ((line = br.readLine()) != null) {
                    dataMap = objectMapper.readValue(line, SortedMap.class);
                }

                List<Map> sortList = new ArrayList<>();

                Object keyObjArr[] = dataMap.keySet().toArray();

                Map keyMap;
                for (Object key : keyObjArr) {
                    keyMap = new HashMap();

                    keyMap.put("key", key);
                    keyMap.put("value", dataMap.get(key));

                    sortList.add(keyMap);
                }

                Collections.sort(sortList, new KeyValueComparator());

                for (Map key : sortList) {
                    propertiesStr.append(key.get("key") + "=" + key.get("value"));
                    propertiesStr.append("\n");
                }

            }
            httpGet.abort();
            httpClient.getConnectionManager().shutdown();

            byte[] bytes = propertiesStr.toString().getBytes();

            res.setHeader("Content-Length", "" + bytes.length);
            res.setHeader("Content-Type", MediaType.APPLICATION_OCTET_STREAM_VALUE);
            res.setHeader("Content-Disposition", MessageFormatter.format("attachment; path={}; filename={}", "oozie_shellscript", "oozie_shellscript" + ".sh").getMessage());
            res.setStatus(200);
            FileCopyUtils.copy(bytes, res.getOutputStream());
            res.flushBuffer();

        } catch (Exception e) {
            throw new ServiceException("Download 중 오류가 발생하였습니다.", e);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    private class KeyValueComparator implements Comparator {
        public int compare(Object o1, Object o2) {
            Map map1 = (Map) o1;
            Map map2 = (Map) o2;

            return map1.get("key").toString().compareTo(map2.get("key").toString());
        }
    }
}
