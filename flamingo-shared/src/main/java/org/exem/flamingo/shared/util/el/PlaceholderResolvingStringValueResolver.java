/*
 * Copyright 2002-2013 the original author or authors.
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
package org.exem.flamingo.shared.util.el;

import org.springframework.beans.BeansException;
import org.springframework.util.PropertyPlaceholderHelper;
import org.springframework.util.StringValueResolver;

import java.util.Properties;

public class PlaceholderResolvingStringValueResolver implements StringValueResolver {

    protected String nullValue;

    public static final String DEFAULT_PLACEHOLDER_PREFIX = "${";

    public static final String DEFAULT_PLACEHOLDER_SUFFIX = "}";

    public static final String DEFAULT_VALUE_SEPARATOR = ":";

    protected String placeholderPrefix = DEFAULT_PLACEHOLDER_PREFIX;

    protected String placeholderSuffix = DEFAULT_PLACEHOLDER_SUFFIX;

    protected String valueSeparator = DEFAULT_VALUE_SEPARATOR;

    protected boolean ignoreUnresolvablePlaceholders = false;

    private final PropertyPlaceholderHelper helper;

    private final PropertyPlaceholderHelper.PlaceholderResolver resolver;

    public PlaceholderResolvingStringValueResolver(Properties props) {
        this.helper = new PropertyPlaceholderHelper(placeholderPrefix, placeholderSuffix, valueSeparator, ignoreUnresolvablePlaceholders);
        this.resolver = new PropertyPlaceholderConfigurerResolver(props);
    }

    @Override
    public String resolveStringValue(String strVal) throws BeansException {
        String value = this.helper.replacePlaceholders(strVal, this.resolver);
        return (value.equals(nullValue) ? null : value);
    }
}