/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
