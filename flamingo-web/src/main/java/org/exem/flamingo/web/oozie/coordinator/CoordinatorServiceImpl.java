package org.exem.flamingo.web.oozie.coordinator;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.oozie.client.OozieClient;
import org.apache.oozie.client.OozieClientException;
import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.core.exception.WholeBodyException;
import org.exem.flamingo.shared.util.OozieClientFactoryBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * Created by cloudine on 2016. 8. 11..
 */
@Service
public class CoordinatorServiceImpl implements CoordinatorService {

    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(CoordinatorServiceImpl.class);

    @Autowired
    HttpClient httpClient;

    @Autowired
    OozieClientFactoryBean oozieClientFactoryBean;

    @Value("#{hadoop['namenode.agent.address']}")
    private String namenodeAgentAddress;

    @Value("#{hadoop['namenode.agent.port']}")
    private String namenodeAgentPort;

    private String hdfsScheme = "hdfs://";

    @Override
    public void run(Map params) {
        List<Map> properties = (List<Map>) params.get("properties");
        String appPath = params.get("apppath").toString();

        HttpResponse execute;
        String namenodeAgentUrl;
        HttpGet httpGet;
        InputStream inputStream;
        Properties prop;
        Properties merged = new Properties();
        Enumeration enumeration;
        Object key;

        for (Map propMap : properties) {

            try {
                namenodeAgentUrl = MessageFormatter.arrayFormat("http://{}:{}/remote/agent/transfer/download?fullyQualifiedPath={}", new Object[]{
                        namenodeAgentAddress, namenodeAgentPort, URLEncoder.encode(propMap.get("path").toString(), "UTF-8")}).getMessage();

                httpGet = new HttpGet(namenodeAgentUrl);
                execute = httpClient.execute(httpGet);
            } catch (Exception ex) {
                ex.printStackTrace();
                throw new WholeBodyException("File Download Failed");
            }

            if (execute.getStatusLine().getStatusCode() != 200) {
                throw new WholeBodyException("File Download Failed");
            } else {
                try {
                    prop = new Properties();
                    inputStream = execute.getEntity().getContent();

                    prop.load(inputStream);

                    enumeration = prop.keys();

                    while (enumeration.hasMoreElements()) {
                        key = enumeration.nextElement();
                        merged.setProperty(key.toString(), prop.get(key).toString());
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                    throw new WholeBodyException("File Download Failed", ex);
                }
            }
        }

        //TODO 사용자계정을 플라밍고 계정과 동기화 시키거나 별도의 Config로 받아올 수 있도록 수정.
        merged.setProperty("user.name", "oozie");
        merged.setProperty("oozie.coord.application.path", hdfsScheme + appPath);
        OozieClient oozieClient = null;
        String jobid = null;

        try {
            oozieClient = oozieClientFactoryBean.getObject();

            jobid = oozieClient.submit(merged);

            logger.info("Oozie job summitted : " + jobid);
        } catch (Exception e) {
            throw new ServiceException("Oozie 클라이언트를 불러오는 중 오류가 발생하였습니다.");
        }

        /**
         * User [?] not authorized for Coord job
         * 오류로 인해 try 구문을 별도로 처리함.
         * 정상적으로 Coordinator는 실행됨.
         * */
        //TODO E0509 오류 또는 버그에 대한 확인 필요.
        try {
            oozieClient.start(jobid);
        } catch (OozieClientException e) {

        }
    }
}
