package org.exem.flamingo.shared.util;

import org.apache.oozie.client.OozieClient;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Properties;

/**
 * Created by cloudine on 2016. 7. 15..
 */
public class OozieClientFactoryBean implements FactoryBean<OozieClient>, InitializingBean {

    @Autowired
    @Qualifier("config")
    private Properties config;

    private OozieClient oozieClient;

    @Override
    public OozieClient getObject() throws Exception {
        return this.oozieClient;
    }

    @Override
    public Class<?> getObjectType() {
        return OozieClient.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        oozieClient = new OozieClient(config.getProperty("oozie.server.url"));
    }
}
