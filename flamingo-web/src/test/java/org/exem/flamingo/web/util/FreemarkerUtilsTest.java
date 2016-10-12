package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.ArrayList;
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

    @Test
    public void parameter() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        Map params = new HashMap();
        params.put("name", "Hello WF");
        ArrayList parameters = new ArrayList();
        HashMap one = new HashMap();
        one.put("name", "adsf");
        one.put("value", "qwer");
        parameters.add(one);
        parameters.add(one);
        params.put("parameters", parameters);

        String evaluated = FreemarkerUtils.evaluate(conf, "parameter_wf.ftl", params);
        Assert.assertEquals(2, StringUtils.countOccurrencesOf(evaluated, "<name>adsf</name>"));
    }

}