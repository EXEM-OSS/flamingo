package exem.flamingo.agent.oz.jpa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.apache.oozie.service.JPAService;
import org.apache.oozie.service.Service;
import org.apache.oozie.service.ServiceException;
import org.apache.oozie.service.Services;
import org.apache.oozie.util.XLog;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.Executors;

public class JpaNativeQueryExecutorService implements Service {

    private static XLog LOG;

    private Properties config;

    private JPAService jpaService;

    private ObjectMapper objectMapper;

    private HttpServer httpServer;

    @Override
    public void init(Services services) throws ServiceException {
        LOG = XLog.getLog(JpaNativeQueryExecutorService.class);
        LOG.info("[Flamingo] Start init.");
        objectMapper = new ObjectMapper();
        jpaService = services.get(JPAService.class);

        loadConfig();
        LOG.info("[Flamingo] Finish init config.");

        if (!checkFunction()) {
            makeFunction();
        }

        LOG.info("[Flamingo] Start Http Server.");
        startServer();

        LOG.info("[Flamingo] Finish.");
    }

    @Override
    public void destroy() {
        httpServer.stop(0);
    }

    @Override
    public Class<? extends Service> getInterface() {
        return JpaNativeQueryExecutorService.class;
    }

    private void loadConfig() {
        config = new Properties();
        try {
            config.load(getClass().getResourceAsStream("/config.properties"));
        } catch (IOException e) {
            config.setProperty("port", "31000");
            e.printStackTrace();
        }
    }

    private boolean checkFunction() {
        boolean result = false;

        EntityManager entityManager = jpaService.getEntityManager();
        try {
            entityManager.getTransaction().begin();
            Query query = entityManager.createNativeQuery("SELECT DATE_TRUNC('hour', CURRENT_DATE)");
            Object queryResult = query.getSingleResult();
            result = true;
        } catch (Exception e) {

        } finally {
            entityManager.getTransaction().rollback();
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }

        return result;
    }

    private void makeFunction() {
        EntityManager entityManager = jpaService.getEntityManager();
        try {

            String makeFunctionQuery = "DELIMITER //\n" +
                    "create function date_trunc(vInterval varchar(7), vDate timestamp)\n" +
                    "  returns timestamp\n" +
                    "  begin\n" +
                    "    declare toReturn timestamp;\n" +
                    "\n" +
                    "    if vInterval = 'year' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(YEAR, '1900-01-01', vDate) YEAR);\n" +
                    "    elseif vInterval = 'quarter' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(QUARTER, '1900-01-01', vDate) QUARTER);\n" +
                    "    elseif vInterval = 'month' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(MONTH, '1900-01-01', vDate) MONTH);\n" +
                    "    elseif vInterval = 'week' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(WEEK, '1900-01-01', vDate) WEEK);\n" +
                    "    elseif vInterval = 'day' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(DAY, '1900-01-01', vDate) DAY);\n" +
                    "    elseif vInterval = 'hour' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(HOUR, '1900-01-01', vDate) HOUR);\n" +
                    "    elseif vInterval = 'minute' then set toReturn = date_add('1900-01-01', interval TIMESTAMPDIFF(MINUTE, '1900-01-01', vDate) MINUTE);\n" +
                    "    END IF;\n" +
                    "\n" +
                    "    return toReturn;\n" +
                    "  end//\n" +
                    "DELIMITER ;";

            entityManager.getTransaction().begin();
            Query query = entityManager.createNativeQuery(makeFunctionQuery);
            query.executeUpdate();
        } catch (Exception e) {

        } finally {
            entityManager.getTransaction().rollback();
            if (entityManager.isOpen()) {
                entityManager.close();
            }
        }
    }

    private void startServer() {
        try {
            httpServer = HttpServer.create(new InetSocketAddress(Integer.parseInt(config.getProperty("port"))), 0);
            httpServer.createContext("/getWorkFlowJobByDate", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {

                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();

                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        List<String> parameters = Arrays.asList("datetime");

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        if (parameterCheck(requestMap, "datetime")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select * " +
                                            "from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "round(extract(MONTH FROM start_time)) = ?2 and " +
                                            "round(extract(DAY FROM start_time)) = ?3 " +
                                            "order by start_time desc", Map.class);

                            setQueryParameters(query, year, month, day);

                            List resultList = query.getResultList();
                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);
                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getWorkFlowJobByDateWithGroup", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {

                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();

                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        List<String> parameters = Arrays.asList("datetime");

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        if (parameterCheck(requestMap, "datetime")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select app_name, status, date_trunc('hour', start_time) as start_time, " +
                                            "count(*) as count from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "round(extract(MONTH FROM start_time)) = ?2 and " +
                                            "round(extract(DAY FROM start_time)) = ?3 " +
                                            "group by app_name, date_trunc('hour', start_time), status " +
                                            "order by app_name, start_time", Map.class);

                            setQueryParameters(query, year, month, day);

                            List resultList = query.getResultList();
                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);
                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getWorkFlowJobCountByHour", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("datetime");

                        if (parameterCheck(requestMap, "datetime")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select status, date_trunc('hour', start_time) as start_time, count(*) as count " +
                                            "from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "extract(MONTH FROM start_time) = ?2 and round(extract(DAY FROM start_time)) = ?3 " +
                                            "and status in ('SUCCEEDED', 'FAILED', 'KILLED') " +
                                            "group by date_trunc('hour', start_time), status " +
                                            "order by start_time", Map.class);

                            setQueryParameters(query, year, month, day);

                            List<Map<String, Object>> resultList = query.getResultList();

                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getWorkFlowJobByAppNameAndStatus", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("datetime", "appName", "status");

                        if (parameterCheck(requestMap, "datetime", "appName", "status")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            String appName = requestMap.get("appName").toString();
                            String status = requestMap.get("status").toString();
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);
                            int hour = calendar.get(Calendar.HOUR_OF_DAY);

                            Query query;

                            if (status.equals("FAILED") || status.equals("KILLED")) {
                                query = entityManager.createNativeQuery(
                                        "select * from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                                "extract(MONTH FROM start_time) = ?2 and " +
                                                "round(extract(DAY FROM start_time)) = ?3 and " +
                                                "extract(HOUR FROM start_time) = ?4 and " +
                                                "app_name = ?5 and status in ('FAILED', 'KILLED')", Map.class);
                            } else if (status.equals("SUCCEEDED")) {
                                query = entityManager.createNativeQuery(
                                        "select * from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 " +
                                                "and extract(MONTH FROM start_time) = ?2 and " +
                                                "round(extract(DAY FROM start_time)) = ?3 and " +
                                                "extract(HOUR FROM start_time) = ?4 and " +
                                                "app_name = ?5 and status = 'SUCCEEDED'", Map.class);
                            } else {
                                query = entityManager.createNativeQuery(
                                        "select * from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 " +
                                                "and extract(MONTH FROM start_time) = ?2 and " +
                                                "round(extract(DAY FROM start_time)) = ?3 and " +
                                                "extract(HOUR FROM start_time) = ?4 and " +
                                                "app_name = ?5 and status in ('FAILED', 'KILLED', 'SUCCEEDED')", Map.class);
                            }

                            setQueryParameters(query, year, month, day, hour, appName);

                            List resultList = query.getResultList();
                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getCoordJobByStatus", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("datetime", "status");

                        if (parameterCheck(requestMap, "datetime", "status")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            String status = requestMap.get("status").toString();
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select status, date_trunc('hour', start_time) as start_time, count(*) as count " +
                                            "from COORD_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "extract(MONTH FROM start_time) = ?2 and " +
                                            "round(extract(DAY FROM start_time)) = ?3 and status = ?4 " +
                                            "group by date_trunc('hour', start_time), status " +
                                            "order by start_time", Map.class);

                            setQueryParameters(query, year, month, day, status);

                            List resultList = query.getResultList();
                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getBundleJobByStatus", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("datetime", "status");

                        if (parameterCheck(requestMap, "datetime", "status")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            String status = requestMap.get("status").toString();
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select status, date_trunc('hour', start_time) as start_time, count(*) as count " +
                                            "from BUNDLE_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "extract(MONTH FROM start_time) = ?2 and round(extract(DAY FROM start_time)) = ?3 " +
                                            "and status = ?4 " +
                                            "group by date_trunc('hour', start_time), status " +
                                            "order by start_time", Map.class);

                            setQueryParameters(query, year, month, day, status);

                            List resultList = query.getResultList();
                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getWorkFlowJobTotal", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("datetime");

                        if (parameterCheck(requestMap, "datetime")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select status, date_trunc('day', start_time) as start_time, count(*) as count " +
                                            "from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "extract(MONTH FROM start_time) = ?2 and round(extract(DAY FROM start_time)) = ?3 " +
                                            "group by date_trunc('day', start_time), status " +
                                            "order by status desc", Map.class);

                            setQueryParameters(query, year, month, day);

                            List resultList = query.getResultList();
                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(resultList);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/getWorkFlowJobCountByDate", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("datetime");

                        if (parameterCheck(requestMap, "datetime")) {
                            long timestamp = Long.parseLong(requestMap.get("datetime").toString());
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTimeInMillis(timestamp);
                            int year = calendar.get(Calendar.YEAR);
                            int month = calendar.get(Calendar.MONTH) + 1;
                            int day = calendar.get(Calendar.DATE);

                            Query query = entityManager.createNativeQuery(
                                    "select status, count(*) as count " +
                                            "from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "extract(MONTH FROM start_time) = ?2 and round(extract(DAY FROM start_time)) = ?3 " +
                                            "group by status", Map.class);

                            setQueryParameters(query, year, month, day);

                            List<Map<String, Object>> resultList = query.getResultList();

                            Map<String, Object> returnMap = new HashMap<>();

                            for (Map<String, Object> map : resultList) {
                                returnMap.put(map.get("status").toString(), map.get("count"));
                            }

                            Query countQuery = entityManager.createNativeQuery(
                                    "select count(*) as count " +
                                            "from WF_JOBS where round(extract(YEAR FROM start_time)) = ?1 and " +
                                            "extract(MONTH FROM start_time) = ?2 and round(extract(DAY FROM start_time)) = ?3",
                                    Integer.class);

                            setQueryParameters(countQuery, year, month, day);

                            int count = (int) countQuery.getSingleResult();

                            returnMap.put("ALL", count);

                            entityManager.getTransaction().commit();

                            responseText = objectMapper.writeValueAsString(returnMap);
                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/searchWorkFlowJob", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("startDate", "endDate", "gubun", "text", "status", "start",
                                "limit");

                        if (parameterCheck(requestMap, "startDate", "endDate", "gubun", "text", "status", "start", "limit")) {
                            long startDate = Long.parseLong(requestMap.get("startDate").toString());
                            long endDate = Long.parseLong(requestMap.get("endDate").toString());
                            endDate += 86399999L;
                            Timestamp startTimeStamp = new Timestamp(startDate);
                            Timestamp endTimeStamp = new Timestamp(endDate);
                            String targetColumn = requestMap.get("gubun").toString();
                            String text = requestMap.get("text").toString();
                            text = "%" + text + "%";
                            String status[] = requestMap.get("status").toString().split(",");
                            long start = Long.parseLong(requestMap.get("start").toString());
                            long limit = Long.parseLong(requestMap.get("limit").toString());

                            String queryString = "select * from WF_JOBS where start_time between ?1 and ?2 and " +
                                    targetColumn + " like ?3";

                            if (requestMap.get("status") != null && requestMap.get("status").toString().length() > 0) {
                                queryString += " and status in (";
                                for (int i = 0; i < status.length; i++) {
                                    queryString += "'" + status[i].trim() + "'";
                                    if (i < status.length-1) {
                                        queryString += ",";
                                    }
                                }
                                queryString += ")";
                            }

                            queryString += "ORDER BY created_time DESC LIMIT ?5 OFFSET ?4";

                            String countQueryString = "select count(*) from WF_JOBS where start_time between ?1 and ?2 and " +
                                    targetColumn + " like ?3";


                            if (requestMap.get("status") != null && requestMap.get("status").toString().length() > 0) {
                                countQueryString += " and status in (";
                                for (int i = 0; i < status.length; i++) {
                                    countQueryString += "'" + status[i].trim() + "'";
                                    if (i < status.length-1) {
                                        countQueryString += ",";
                                    }
                                }
                                countQueryString += ")";
                            }


                            Query query = entityManager.createNativeQuery(queryString, Map.class);

                            Query countQuery = entityManager.createNativeQuery(countQueryString, Long.class);

                            setQueryParameters(query, startTimeStamp, endTimeStamp, text, start, limit);
                            setQueryParameters(countQuery, startTimeStamp, endTimeStamp, text, start, limit);

                            List resultList = query.getResultList();
                            Long count = (Long) countQuery.getSingleResult();
                            entityManager.getTransaction().commit();

                            Map<String, Object> resultMap = new HashMap<>();

                            resultMap.put("totalCount", count);
                            resultMap.put("data", resultList);

                            responseText = objectMapper.writeValueAsString(resultMap);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/searchBundleJob", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("gubun", "text", "status", "start",
                                "limit");

                        if (parameterCheck(requestMap, "gubun", "text", "status", "start", "limit")) {
                            String targetColumn = requestMap.get("gubun").toString();
                            String text = requestMap.get("text").toString();
                            text = "%" + text + "%";
                            String status[] = requestMap.get("status").toString().split(",");
                            long start = Long.parseLong(requestMap.get("start").toString());
                            long limit = Long.parseLong(requestMap.get("limit").toString());

                            String queryString = "select * from BUNDLE_JOBS where " +
                                    targetColumn + " like ?1";

                            if (requestMap.get("status") != null && requestMap.get("status").toString().length() > 0) {
                                queryString += " and status in (";
                                for (int i = 0; i < status.length; i++) {
                                    queryString += "'" + status[i].trim() + "'";
                                    if (i < status.length-1) {
                                        queryString += ",";
                                    }
                                }
                                queryString += ")";
                            }

                            queryString += "ORDER BY created_time DESC LIMIT ?3 OFFSET ?2";

                            String countQuerySTring = "select count(*) from BUNDLE_JOBS where " + targetColumn + " like ?1";


                            if (requestMap.get("status") != null && requestMap.get("status").toString().length() > 0) {
                                countQuerySTring += " and status in (";
                                for (int i = 0; i < status.length; i++) {
                                    countQuerySTring += "'" + status[i].trim() + "'";
                                    if (i < status.length-1) {
                                        countQuerySTring += ",";
                                    }
                                }
                                countQuerySTring += ")";
                            }


                            Query query = entityManager.createNativeQuery(queryString, Map.class);

                            Query countQuery = entityManager.createNativeQuery(countQuerySTring, Long.class);

                            setQueryParameters(query, text, start, limit);
                            setQueryParameters(countQuery, text, start, limit);

                            List resultList = query.getResultList();
                            Long count = (Long) countQuery.getSingleResult();
                            entityManager.getTransaction().commit();

                            Map<String, Object> resultMap = new HashMap<>();

                            resultMap.put("totalCount", count);
                            resultMap.put("data", resultList);

                            responseText = objectMapper.writeValueAsString(resultMap);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/searchCoordJob", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();
                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        List<String> parameters = Arrays.asList("gubun", "text", "status", "start", "limit");

                        if (parameterCheck(requestMap, "gubun", "text", "status", "start", "limit")) {
                            String targetColumn = requestMap.get("gubun").toString();
                            String text = requestMap.get("text").toString();
                            text = "%" + text + "%";
                            String status[] = requestMap.get("status").toString().split(",");
                            long start = Long.parseLong(requestMap.get("start").toString());
                            long limit = Long.parseLong(requestMap.get("limit").toString());

                            String queryString = "select * from COORD_JOBS where " + targetColumn + " like ?1";

                            if (requestMap.get("status") != null && requestMap.get("status").toString().length() > 0) {
                                queryString += " and status in (";
                                for (int i = 0; i < status.length; i++) {
                                    queryString += "'" + status[i].trim() + "'";
                                    if (i < status.length-1) {
                                        queryString += ",";
                                    }
                                }
                                queryString += ")";
                            }

                            queryString += "ORDER BY created_time DESC LIMIT ?3 OFFSET ?2";

                            String countQuerySTring = "select count(*) from COORD_JOBS where " + targetColumn + " like ?1";


                            if (requestMap.get("status") != null && requestMap.get("status").toString().length() > 0) {
                                countQuerySTring += " and status in (";
                                for (int i = 0; i < status.length; i++) {
                                    countQuerySTring += "'" + status[i].trim() + "'";
                                    if (i < status.length-1) {
                                        countQuerySTring += ",";
                                    }
                                }
                                countQuerySTring += ")";
                            }


                            Query query = entityManager.createNativeQuery(queryString, Map.class);

                            Query countQuery = entityManager.createNativeQuery(countQuerySTring, Long.class);

                            setQueryParameters(query, text, start, limit);
                            setQueryParameters(countQuery, text, start, limit);

                            List resultList = query.getResultList();
                            Long count = (Long) countQuery.getSingleResult();
                            entityManager.getTransaction().commit();

                            Map<String, Object> resultMap = new HashMap<>();

                            resultMap.put("totalCount", count);
                            resultMap.put("data", resultList);

                            responseText = objectMapper.writeValueAsString(resultMap);

                        } else {
                            getParameterRequiredMessage(parameters);
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });

            httpServer.createContext("/query", new HttpHandler() {
                @Override
                public void handle(HttpExchange httpExchange) throws IOException {
                    EntityManager entityManager = jpaService.getEntityManager();
                    try {
                        entityManager.getTransaction().begin();

                        Map requestMap = parseRequestBody(httpExchange.getRequestBody());

                        String responseText = "";

                        httpExchange.getResponseHeaders().set("Content-type", "application/json; charset=UTF-8");

                        if (parameterCheck(requestMap, "query")) {
                            String queryString = requestMap.get("query").toString();

                            Query query = entityManager.createNativeQuery(queryString, Map.class);
                            entityManager.getTransaction().commit();

                            List resultList = query.getResultList();

                            responseText = objectMapper.writeValueAsString(resultList);
                        } else {
                            responseText = "{\"success\":false, \"message\":\"parameter 'query' is " +
                                    "required\"}";
                        }

                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } catch (Exception e) {
                        String responseText = "{\"success\":false, \"message\":" + objectMapper.writeValueAsString(e.getMessage()) + "}";
                        e.printStackTrace();
                        entityManager.getTransaction().rollback();
                        httpExchange.sendResponseHeaders(200, responseText.length());
                        OutputStream out = httpExchange.getResponseBody();
                        out.write(responseText.getBytes());
                        out.flush();
                    } finally {
                        if (entityManager.isOpen()) {
                            entityManager.close();
                        }
                    }
                    httpExchange.close();
                }
            });
            httpServer.setExecutor(Executors.newCachedThreadPool());
            httpServer.start();
            LOG.info("started");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Map parseRequestBody(InputStream requestBody) {
        Map requestMap = null;

        try {
            if (requestBody.available() > 0) {
                requestMap = objectMapper.readValue(requestBody, Map.class);
            }
        } catch (Exception e) {
            LOG.error("could not parsing request body");
        }

        return requestMap;
    }

    private boolean parameterCheck(Map map, String... parameters) {
        boolean isValidate = true;

        if (map != null) {
            for (String parameter : parameters) {
                if (map.get(parameter) == null) {
                    isValidate = false;
                }
            }
        } else {
            isValidate = false;
        }

        return isValidate;
    }

    private void setQueryParameters(Query query, Object... parameter) {
        for (int i = 0; i < parameter.length; i++) {
            query.setParameter(i+1, parameter[i]);
        }
    }

    private String getParameterRequiredMessage(List<String> parameters) {
        return  "{\"success\":false, \"message\":\"required parameter " + parameters + "\"}";
    }
}
