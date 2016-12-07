package exem.flamingo.agent.oz.jpa;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.oozie.service.JPAService;
import org.apache.oozie.service.Service;
import org.apache.oozie.service.ServiceException;
import org.apache.oozie.service.Services;
import org.apache.oozie.util.XLog;

public class JpaNativeQueryExecutorService implements Service {

    private static XLog LOG;

    private JPAService jpaService;

    private ObjectMapper objectMapper;


    @Override
    public void init(Services services) throws ServiceException {
        LOG = XLog.getLog(JpaNativeQueryExecutorService.class);
        LOG.info("[Flamingo] Start init.");
        objectMapper = new ObjectMapper();
        jpaService = services.get(JPAService.class);
    }

    @Override
    public void destroy() {

    }

    @Override
    public Class<? extends Service> getInterface() {
        return null;
    }
}
