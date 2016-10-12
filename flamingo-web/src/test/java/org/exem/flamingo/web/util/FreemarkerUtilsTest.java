package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import org.exem.flamingo.web.oozie.OozieWorkflowTestFixture;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.Map;

public class FreemarkerUtilsTest {

    Configuration conf;

    OozieWorkflowTestFixture fixture;

    @Before
    public void before() {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org/exem/flamingo/web/oozie/applicationContext.xml");
        FreeMarkerConfigurer configurer = ctx.getBean(FreeMarkerConfigurer.class);
        this.conf = configurer.getConfiguration();
        this.fixture = new OozieWorkflowTestFixture();
    }

    @Test
    public void parameters() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createParameters(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

    @Test
    public void global() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createGlobal(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

    @Test
    public void start() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createStart(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<start name=\"Start\" to=\"nextAction\"/>"));
    }

    @Test
    public void end() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createEnd(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<end name=\"End\"/>"));
    }

    @Test
    public void kill() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createKill(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<kill name=\"kill\">"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<message>Job Killed</message>"));
    }

    @Test
    public void credentials() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createCredentials(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<credentials>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<credential name=\"Credentials\" type=\"Credentials Type\">"));
    }

    @Test
    public void decision() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createDecision(workflow);

        String evaluated = FreemarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<decision name=\"Decision\">"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<case to=\"To\">Predicate</case>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<default to=\"To\"/>"));
    }
}