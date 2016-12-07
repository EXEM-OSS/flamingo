package exem.flamingo.agent.oz.jpa;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.oozie.service.JPAService;
import org.apache.oozie.service.Service;
import org.apache.oozie.service.ServiceException;
import org.apache.oozie.service.Services;
import org.apache.oozie.util.XLog;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.IOException;
import java.util.Properties;

public class JpaNativeQueryExecutorService implements Service {

    private static XLog LOG;

    private Properties config;

    private JPAService jpaService;

    private ObjectMapper objectMapper;

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

        LOG.info("[Flamingo] Finish.");
    }

    @Override
    public void destroy() {

    }

    @Override
    public Class<? extends Service> getInterface() {
        return null;
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
}
