/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Map;

/**
 * Apache FreeMaker 유틸리티.
 *
 * @author Byoung Gon, Kim
 * @since 1.0
 */
public class FreeMarkerUtils {

    /**
     * Apache FreeMaker의 템플릿 파일을 해석한다
     *
     * @param cfg          Apache FreeMaker의 Configuration
     * @param templateFile 템플릿 파일
     * @param model        템플릿 해석에 필요한 파라미터의 모델
     * @return 템플릿 해석 결과
     * @throws IOException       템플릿을 로딩할 수 없는 경우
     * @throws TemplateException 템플릿을 처리할 수 없는 경우
     */
    public static String evaluate(Configuration cfg, String templateFile, Map<String, Object> model) throws IOException, TemplateException {
        Template template = cfg.getTemplate(templateFile);
        StringWriter writer = new StringWriter();
        template.process(model, writer);
        return writer.toString();
    }

}
