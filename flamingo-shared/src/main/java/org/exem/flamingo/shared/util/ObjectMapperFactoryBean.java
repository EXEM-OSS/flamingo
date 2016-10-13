package org.exem.flamingo.shared.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;

public class ObjectMapperFactoryBean implements FactoryBean<ObjectMapper>, InitializingBean {

    private ObjectMapper objectMapper;

    private boolean isIndentOutput = false;

    @Override
    public ObjectMapper getObject() throws Exception {
        return this.objectMapper;
    }

    @Override
    public Class<ObjectMapper> getObjectType() {
        return ObjectMapper.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.objectMapper = new ObjectMapper();

        if (isIndentOutput) {
            this.objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        }
    }

    public void setIndentOutput(boolean isIndentOutput) {
        this.isIndentOutput = isIndentOutput;
    }
}
