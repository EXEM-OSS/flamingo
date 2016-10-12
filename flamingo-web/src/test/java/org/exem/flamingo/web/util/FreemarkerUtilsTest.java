package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import org.exem.flamingo.web.oozie.OozieWorkflowTestFixture;
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
    public void testParameter() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        OozieWorkflowTestFixture fixture = new OozieWorkflowTestFixture();
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createParameters(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

    @Test
    public void testGlobal() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        OozieWorkflowTestFixture fixture = new OozieWorkflowTestFixture();
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createGlobal(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

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
        System.out.println(evaluated);
        Assert.assertEquals(2, StringUtils.countOccurrencesOf(evaluated, "<name>adsf</name>"));
    }

    public void global() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        Map params = new HashMap();
        params.put("name", "Hello WF");

        Map global = new HashMap();
        global.put("jobTracker", "localhost:8032");
        global.put("nameNode", "localhost:8020");

        ArrayList jobXmls = new ArrayList();
        jobXmls.add("1.xml");
        jobXmls.add("2.xml");
        jobXmls.add("3.xml");
        global.put("jobXml", jobXmls);

        ArrayList properties = new ArrayList();
        HashMap one = new HashMap();
        one.put("name", "adsf");
        one.put("value", "qwer");
        properties.add(one);
        properties.add(one);
        global.put("properties", properties);

        params.put("global", global);

        String evaluated = FreemarkerUtils.evaluate(conf, "global_wf.ftl", params);
        System.out.println(evaluated);
        Assert.assertEquals(2, StringUtils.countOccurrencesOf(evaluated, "<name>adsf</name>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<job-xml>1.xml</job-xml>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<job-xml>2.xml</job-xml>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<job-xml>3.xml</job-xml>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<job-tracker>localhost:8032</job-tracker>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<name-node>localhost:8020</name-node>"));
    }

}