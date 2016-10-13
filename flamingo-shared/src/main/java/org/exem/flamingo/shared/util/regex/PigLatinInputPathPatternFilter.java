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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Pig Latin Script의 Input Path를 Regular Expression Pattern을 이용하여 추출하는 필터.
 *
 * @author Byoung Gon, Kim
 * @author Chiwan Park
 * @version 0.3
 */
public class PigLatinInputPathPatternFilter implements RegExPatternFilter {

    public final static String NAME = "PIG";

    private Pattern pattern = Pattern.compile("(?i)(LOAD) '?([/-_0-9a-zA-Z]+)'?");

    @Override
    public List<String> filter(String message) {
        List<String> filtered = new ArrayList<String>();
        Matcher matcher = pattern.matcher(message);
        while (matcher.find())
            filtered.add(matcher.group(2));

        return filtered;
    }

}
