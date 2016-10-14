/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.shared.util.el;

import org.exem.flamingo.shared.core.exception.ServiceException;
import org.exem.flamingo.shared.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Expression Language Service Implementation.
 *
 * @author Byoung Gon, Kim
 * @version 0.2
 */
public class ELServiceImpl implements InitializingBean, DisposableBean, ELService {

    /**
     * SLF4J Logging
     */
    private static Logger logger = LoggerFactory.getLogger(ELServiceImpl.class);

    /**
     * Flamingo Site XML에 정의하는 EL의 Prefix
     */
    public static final String CONF_PREFIX = "EL.";

    /**
     * Flamingo Site XML에 정의하는 Constant EL의 Key
     */
    public static final String CONF_CONSTANTS = CONF_PREFIX + "constants";

    /**
     * Flamingo Site XML에 정의하는 Function EL의 Key
     */
    public static final String CONF_FUNCTIONS = CONF_PREFIX + "functions";

    /**
     * EL Function 목록. Key는 구분자.
     */
    private HashMap<String, List<ELConstant>> constants;

    /**
     * EL Function 목록. Key는 구분자.
     */
    private HashMap<String, List<ELFunction>> functions;

    /**
     * EL Definition(Functions and Constants) Map.
     */
    private Map<String, String> definitions;

    @Override
    public void afterPropertiesSet() throws Exception {
        constants = new HashMap<String, List<ELConstant>>();
        functions = new HashMap<String, List<ELFunction>>();

        // EL Constants
        List<ELConstant> tmpConstants = new ArrayList<ELConstant>();
        tmpConstants.addAll(extractConstants(definitions, CONF_CONSTANTS));
        constants.put(CONF_CONSTANTS, tmpConstants);

        // EL Functions
        List<ELFunction> tmpFunctions = new ArrayList<ELFunction>();
        tmpFunctions.addAll(extractFunctions(definitions, CONF_FUNCTIONS));
        functions.put(CONF_FUNCTIONS, tmpFunctions);

        logger.info("Registered expression definitions");
    }

    /**
     * Comma Separated String을 배열로 변환한다.
     * 배열로 변환시 Trim 처리를 한다.
     *
     * @param commaSeparatedList Comma Separated String
     * @return 문자열 배열
     */
    private String[] split(String commaSeparatedList) {
        List<String> params = new ArrayList<String>();
        String[] values = org.apache.commons.lang.StringUtils.splitPreserveAllTokens(commaSeparatedList.trim(), ",");
        for (String value : values) {
            params.add(value.trim());
        }
        return StringUtils.collectionToStringArray(params);
    }

    /**
     * EL로 사용할 수 있는 상수를 표현하는 모델 클래스.
     * 모든 상수는 <tt>PREFIX:NAME</tt>으로 사용한다.
     */
    private static class ELConstant {

        private String name;

        private Object value;

        private ELConstant(String prefix, String name, Object value) {
            if (prefix.length() > 0) {
                name = prefix + ":" + name;
            }
            this.name = name;
            this.value = value;
        }
    }

    /**
     * EL로 사용할 수 있는 함수를 표현하는 모델 클래스.
     */
    private static class ELFunction {
        private String prefix;
        private String name;
        private Method method;

        private ELFunction(String prefix, String name, Method method) {
            this.prefix = prefix;
            this.name = name;
            this.method = method;
        }
    }

    private List<ELConstant> extractConstants(Map<String, String> props, String key) throws ServiceException {
        List<ELConstant> list = new ArrayList<ELConstant>();
        if (props.get(key) != null && props.get(key).trim().length() > 0) {
            for (String function : split(props.get(key))) {
                if (!StringUtils.isEmpty(function)) {
                    String[] parts = parseDefinition(function);
                    list.add(new ELConstant(parts[0], parts[1], findConstant(parts[2], parts[3])));
                    logger.debug("Registered prefix:constant[{}:{}] for class#field[{}#{}]", (Object[]) parts);
                }
            }
        }
        return list;
    }

    private List<ELFunction> extractFunctions(Map<String, String> props, String key) throws ServiceException {
        List<ELFunction> list = new ArrayList<ELFunction>();
        if (props.get(key) != null && props.get(key).trim().length() > 0) {
            for (String function : split(props.get(key))) {
                if (!StringUtils.isEmpty(function)) {
                    String[] parts = parseDefinition(function);
                    list.add(new ELFunction(parts[0], parts[1], findMethod(parts[2], parts[3])));
                    logger.debug("Registered prefix:constant[{}:{}] for class#field[{}#{}]", (Object[]) parts);
                }
            }
        }
        return list;
    }

    /**
     * Destroy the EL service.
     */
    @Override
    public void destroy() {
        constants = null;
        functions = null;
    }

    /**
     * Return an {@link ELEvaluator} pre-configured with the constants and functions for the specific group of
     * EL-functions and variables defined in the model. If the group name doesn't exist,
     * IllegalArgumentException is thrown
     *
     * @return a preconfigured {@link ELEvaluator}.
     */
    public ELEvaluator createEvaluator() {
        ELEvaluator.Context context = new ELEvaluator.Context();
        for (ELConstant constant : constants.get(ELServiceImpl.CONF_CONSTANTS)) {
            context.setVariable(constant.name, constant.value);
        }
        for (ELFunction function : functions.get(ELServiceImpl.CONF_FUNCTIONS)) {
            context.addFunction(function.prefix, function.name, function.method);
        }
        return new ELEvaluator(context);
    }

    private static String[] parseDefinition(String str) throws ServiceException {
        try {
            str = str.trim();
            if (!str.contains(":")) {
                str = ":" + str;
            }
            String[] parts = str.split(":");
            String prefix = parts[0];
            parts = parts[1].split("=");
            String name = parts[0];
            parts = parts[1].split("#");
            String klass = parts[0];
            String method = parts[1];
            return new String[]{prefix, name, klass, method};
        } catch (Exception ex) {
            throw new ServiceException("Cannot parsing EL definitions", ex);
        }
    }

    public static Method findMethod(String className, String methodName) throws ServiceException {
        Method method = null;
        try {
            Class clazz = Thread.currentThread().getContextClassLoader().loadClass(className);
            for (Method m : clazz.getMethods()) {
                if (m.getName().equals(methodName)) {
                    method = m;
                    break;
                }
            }
            if (method == null) {
                // throw new ServiceException(ErrorCode.E0111, className, methodName);
            }
            if ((method.getModifiers() & (Modifier.PUBLIC | Modifier.STATIC)) != (Modifier.PUBLIC | Modifier.STATIC)) {
                // throw new ServiceException(ErrorCode.E0112, className, methodName);
            }
        } catch (ClassNotFoundException ex) {
            // throw new ServiceException(ErrorCode.E0113, className);
        }
        return method;
    }

    public static Object findConstant(String className, String constantName) throws ServiceException {
        try {
            Class clazz = Thread.currentThread().getContextClassLoader().loadClass(className);
            Field field = clazz.getField(constantName);
            if ((field.getModifiers() & (Modifier.PUBLIC | Modifier.STATIC)) != (Modifier.PUBLIC | Modifier.STATIC)) {
                // throw new ServiceException(ErrorCode.E0114, className, constantName);
            }
            return field.get(null);
        } catch (Exception ex) {
            throw new ServiceException(ex);
        }
    }

    ////////////////////////////////////////////////////
    // Spring Framework Setter Injection
    ////////////////////////////////////////////////////

    /**
     * EL Definition을 설정한다.
     *
     * @param definitions EL Definition
     */
    public void setDefinitions(Map<String, String> definitions) {
        this.definitions = definitions;
    }
}