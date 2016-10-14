/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.web.configuration;

import org.exem.flamingo.shared.util.el.ELUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import static org.apache.commons.lang.StringUtils.isEmpty;

/**
 * Configuration를 Singleton Instance로 접근하기 위한 Helper.
 *
 * @author Byoung Gon, Kim
 * @since 2.0
 */
@Component
public class ConfigurationHelper implements InitializingBean {

    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(ConfigurationHelper.class);

    @Autowired
    @Qualifier("app")
    private Properties app;

    @Autowired
    @Qualifier("config")
    private Properties config;

    @Autowired
    @Qualifier("hadoop")
    private Properties hadoop;

    /**
     * Property Key Value를 담고 있는 map
     */
    private Map<String, String> map = new HashMap<>();

    /**
     * Property Key Value를 담고 있는 properties.
     */
    private Properties props = new Properties();

    /**
     * ResourceBundleHelper의 Singleton Instance
     */
    private static ConfigurationHelper helper;

    /**
     * Default constructor.
     */
    public ConfigurationHelper() {
    }

    /**
     * ConfigurationHelper의 Singleton Instance를 반환한다.
     *
     * @return ConfigurationHelper의 Singleton Instance
     */
    public static ConfigurationHelper getHelper() {
        return helper;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.helper = this;
        inject(app);
        inject(config);
        inject(hadoop);
    }

    public void inject(Properties config) {
        Set<Object> configs = config.keySet();
        for (Object obj : configs) {
            String key = (String) obj;
            String value;
            if (!isEmpty(System.getProperty(key))) {
                value = System.getProperty(key);
            } else {
                value = config.getProperty(key);
            }

            String resolvedValue;
            try {
                resolvedValue = ELUtils.resolve(getMergedProperties(), value);
            } catch (Exception ex) {
                resolvedValue = value;
            }

            this.map.put(key, resolvedValue);
            this.props.put(key, resolvedValue);

            logger.debug("Loaded {}={}", key, resolvedValue);
        }
    }

    private Properties getMergedProperties() {
        Properties properties = new Properties(System.getProperties());
        properties.putAll(config);
        return properties;
    }

    public Properties getProperties() {
        return this.props;
    }

    /**
     * 설정 정보의 크기를 반환한다.
     *
     * @return 크기
     */
    public int size() {
        return map.size();
    }

    /**
     * 지정한 Key의 Value를 평가한다.
     *
     * @param key Key
     * @return Key의 Value에 대해서 평가한 문자열
     */
    public String get(String key) {
        return map.get(key);
    }

    /**
     * 지정한 Key의 Value를 평가한다.
     *
     * @param key          Key
     * @param defaultValue 기본값
     * @return Key의 Value에 대해서 평가한 문자열
     */
    public String get(String key, String defaultValue) {
        String value = map.get(key);
        if (!isEmpty(value)) {
            return value;
        }
        return defaultValue;
    }

    /**
     * 지정한 Key가 존재하는지 확인한다.
     *
     * @param key 존재 여부를 확인할 Key
     * @return 존재하지 않는다면 <tt>false</tt>
     */
    public boolean containsKey(String key) {
        return map.containsKey(key);
    }

    /**
     * 지정한 Key에 대해서 Long Value를 반환한다.
     *
     * @param key Key
     * @return Key에 대한 Long Value
     */
    public long getLong(String key) {
        return Long.parseLong(get(key));
    }

    /**
     * 지정한 Key에 대해서 Boolean Value를 반환한다.
     *
     * @param key Key
     * @return Key에 대한 Boolean Value
     */
    public boolean getBoolean(String key) {
        try {
            return Boolean.parseBoolean(get(key));
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * 지정한 Key에 대해서 Boolean Value를 반환한다.
     *
     * @param key          Key
     * @param defaultValue 기본값
     * @return Key에 대한 Boolean Value
     */
    public boolean getBoolean(String key, boolean defaultValue) {
        if (containsKey(key)) {
            return Boolean.parseBoolean(get(key));
        } else {
            return defaultValue;
        }
    }

    /**
     * 지정한 Key에 대해서 Long Value를 반환한다. 값이 없다면 기본값을 반환한다.
     *
     * @param key          Key
     * @param defaultValue 기본값
     * @return Key에 대한 Long Value
     */
    public long getLong(String key, long defaultValue) {
        if (containsKey(key)) {
            return Long.parseLong(get(key));
        } else {
            return defaultValue;
        }
    }
}
