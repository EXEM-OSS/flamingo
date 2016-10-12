package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Map;

public class FreemarkerUtils {

    public static String evaluate(Configuration cfg, String templateFile, Map<String, Object> model) throws IOException, TemplateException {
        Template template = cfg.getTemplate(templateFile);
        StringWriter writer = new StringWriter();
        template.process(model, writer);
        return writer.toString();
    }

}
