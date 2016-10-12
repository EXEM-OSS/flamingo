package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;

public class FreemarkerUtils {

    public static void evaluate(Configuration cfg, String templateFile, Map<String, Object> model) throws IOException, TemplateException {
        Template template = cfg.getTemplate(templateFile);
        Writer out = new OutputStreamWriter(System.out);
        template.process(model, out);
        out.flush();
    }

}
