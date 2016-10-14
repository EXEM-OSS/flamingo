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
package org.exem.flamingo.web.remote;

import org.springframework.remoting.httpinvoker.HttpInvokerProxyFactoryBean;

import static org.slf4j.helpers.MessageFormatter.arrayFormat;

public class RemoteInvocation {

    public <T> T getRemoteService(String url, Class<T> clazz) {
        HttpInvokerProxyFactoryBean factoryBean = new HttpInvokerProxyFactoryBean();
        factoryBean.setServiceUrl(url);
        factoryBean.setServiceInterface(clazz);
        factoryBean.afterPropertiesSet();
        return (T) factoryBean.getObject();
    }

    public String getRemoteServiceUrl(String ip, int port, String serviceName) {
        return arrayFormat("http://{}:{}/remote/agent/{}", new Object[]{ip, port, serviceName}).getMessage();
    }
}
