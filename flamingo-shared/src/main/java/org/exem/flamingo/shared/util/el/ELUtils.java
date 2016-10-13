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

import org.exem.flamingo.shared.util.StringUtils;

import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Expression Language 유틸리티.
 *
 * @author Byoung Gon, Kim
 * @since 0.2
 */
public class ELUtils {

    /**
     * <pre>${var}</pre> 형식의 변수를 찾을 때 사용하는 Regular Expression
     */
    private static Pattern variableRegex = Pattern.compile("\\$\\{[^\\}\\$\u0020]+\\}");

    /**
     * EL을 포함하는 문자열에서 EL을 추출하여 변환한다.
     *
     * @param props Key Value 형식의 값
     * @param value EL을 포함하는 문자열
     * @return EL을 해석한 문자열
     */
    public static String resolve(Properties props, String value) {
        if (StringUtils.isEmpty(value.trim())) {
            throw new IllegalArgumentException("Required string to evaluate. '" + value + "'");
        }
        Matcher matcher = variableRegex.matcher(value);
        String resolvedString = value;
        while (matcher.find()) {
            String var = matcher.group();
            String eliminated = var.substring(2, var.length() - 1); // ${ .. } 제거
            String property = props.getProperty(eliminated);
            String finalValue;
            /* 변수값이 Properties에 존재하지 않는 경우 System Properties를 찾아나간다. */
            if (property == null) {
                String systemValue = System.getProperty(eliminated);
                if (!StringUtils.isEmpty(systemValue)) {
                    finalValue = systemValue;
                } else {
                    /* System Properties에도 존재하지 않는다면 변수명을 다시 복원한다. */
                    finalValue = var;
                }
            } else {
                finalValue = resolve(props, property);
            }
            resolvedString = org.apache.commons.lang.StringUtils.replace(resolvedString, var, finalValue);
        }
        return resolvedString;
    }

    public static String resolve(Properties props, String value, ELEvaluator evaluator) {
        if (StringUtils.isEmpty(value.trim())) {
            throw new IllegalArgumentException("Required string to evaluate. '" + value + "'");
        }
        Matcher matcher = variableRegex.matcher(value);
        String resolvedString = value;
        while (matcher.find()) {
            String var = matcher.group();
            String eliminated = var.substring(2, var.length() - 1); // ${ .. } 제거
            String property = props.getProperty(eliminated);
            String finalValue;
            /* 변수값이 Properties에 존재하지 않는 경우 System Properties를 찾아나간다. */
            if (property == null) {
                String systemValue = System.getProperty(eliminated);
                if (!StringUtils.isEmpty(systemValue)) {
                    finalValue = systemValue;
                } else {
                    /* System Properties에도 존재하지 않는다면 변수명을 다시 복원한다. */
                    finalValue = "";
                    if (eliminated.contains("(")) {
                        String substring = eliminated.substring(0, eliminated.indexOf("("));
                        if (evaluator.getContext().getFunction(substring) != null) {
                            finalValue = var;
                        }
                    }else{
                        if (evaluator.getContext().getVariable(eliminated) != null) {
                            finalValue = var;
                        }
                    }
                }
            } else {
                finalValue = resolve(props, property, evaluator);
            }
            resolvedString = org.apache.commons.lang.StringUtils.replace(resolvedString, var, finalValue);
        }
        return resolvedString;
    }

    /**
     * EL을 포함하는 문자열에서 EL을 추출하여 변환한다. EL을 해석할 때에는
     * 가장 먼저 사용자가 제공한 Key Value 속성값, 그리고 시스템 속성 그리고 Function 및 Constant 순서로 해석한다.
     *
     * @param evaluator EL Service의 evaluator
     * @param props     Key Value 형식의 값
     * @param value     EL을 포함하는 문자열
     * @return EL을 해석한 문자열
     */
    public static String evaluate(ELEvaluator evaluator, Properties props, String value) throws Exception {
        String resolved = resolve(props, value, evaluator);
        return evaluator.evaluate(resolved, String.class);
    }

    public static String parse(String value) {
        PlaceholderResolvingStringValueResolver configurer = new PlaceholderResolvingStringValueResolver(System.getProperties());
        return configurer.resolveStringValue(value);
    }

    public static String parse(String value, Properties props) {
        PlaceholderResolvingStringValueResolver configurer = new PlaceholderResolvingStringValueResolver(props);
        return configurer.resolveStringValue(value);
    }
}

