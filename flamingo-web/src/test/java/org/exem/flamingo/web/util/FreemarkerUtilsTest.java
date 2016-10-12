package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.HashMap;
import java.util.Map;

public class FreemarkerUtilsTest {

    @Test
    public void evaluate() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        Map params = new HashMap();
        params.put("name", "Freemarker");

        String evaluated = FreemarkerUtils.evaluate(conf, "helloworld.ftl", params);
        Assert.assertEquals("Hello Freemarker", evaluated);
    }

}