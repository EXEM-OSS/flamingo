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
package org.exem.flamingo.shared.util.regex;

import java.util.ArrayList;
import java.util.List;

/**
 * Regular Expression Pattern 기반 문자열 패턴 필터를 하나 이상 적용할 수 있는 필터 체인 기본 구현체.
 *
 * @author Byoung Gon, Kim
 * @version 0.3
 */
public class RegExPatternFilterChainImpl implements RegExPatternFilterChain {

    List<RegExPatternFilter> filters;

    @Override
    public List<String> filter(String message) {
        List<String> filtered = new ArrayList<String>();
        for (RegExPatternFilter filter : filters) {
            filtered.addAll(filter.filter(message));
        }
        return filtered;
    }

    public void setFilters(List<RegExPatternFilter> filters) {
        this.filters = filters;
    }

    public List<RegExPatternFilter> getFilters() {
        if (filters == null) {
            filters = new ArrayList<RegExPatternFilter>();
        }
        return filters;
    }

}
