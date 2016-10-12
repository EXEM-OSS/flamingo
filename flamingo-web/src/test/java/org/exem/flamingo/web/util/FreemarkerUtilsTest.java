package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import org.exem.flamingo.web.oozie.OozieWorkflowTestFixture;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.Map;

public class FreemarkerUtilsTest {

    @Test
    public void parameters() throws Exception {
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
    public void global() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        OozieWorkflowTestFixture fixture = new OozieWorkflowTestFixture();
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createGlobal(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

    @Test
    public void start() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        OozieWorkflowTestFixture fixture = new OozieWorkflowTestFixture();
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createStart(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<start name=\"Start\" to=\"nextAction\"/>"));
    }

    @Test
    public void end() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        OozieWorkflowTestFixture fixture = new OozieWorkflowTestFixture();
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createEnd(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<end name=\"End\"/>"));
    }

    @Test
    public void kill() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        Configuration conf = configurer.getConfiguration();

        OozieWorkflowTestFixture fixture = new OozieWorkflowTestFixture();
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createKill(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<kill name=\"kill\">"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<message>Job Killed</message>"));
    }
}