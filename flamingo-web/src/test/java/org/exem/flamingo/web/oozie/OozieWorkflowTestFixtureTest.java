package org.exem.flamingo.web.oozie;

import freemarker.template.Configuration;
import org.exem.flamingo.web.util.FreeMarkerUtils;
import org.exem.flamingo.web.util.XmlFormatter;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.Map;

public class OozieWorkflowTestFixtureTest {

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

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

    @Test
    public void global() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createGlobal(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
    }

    @Test
    public void start() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createStart(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<start name=\"Start\" to=\"nextAction\"/>"));
    }

    @Test
    public void end() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createEnd(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<end name=\"End\"/>"));
    }

    @Test
    public void kill() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createKill(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<kill name=\"kill\">"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<message>Job Killed</message>"));
    }

    @Test
    public void credentials() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createCredentials(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<credentials>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<credential name=\"Credentials\" type=\"Credentials Type\">"));
    }

    @Test
    public void decision() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createDecision(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<decision name=\"Decision\">"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<case to=\"To\">Predicate</case>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<default to=\"To\"/>"));
    }

    @Test
    public void join() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createJoin(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<join name=\"Join\" to=\"Next\"/>"));
    }

    @Test
    public void fork() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createFork(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<fork name=\"Join\">"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<path start=\"1\"/>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<path start=\"2\"/>"));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "<path start=\"3\"/>"));
    }

    @Test
    public void action() throws Exception {
        Map workflow = fixture.createWorkflow("Hello WF");
        fixture.createAction(workflow);

        String evaluated = FreeMarkerUtils.evaluate(conf, "workflow.ftl", workflow);
        System.out.println(XmlFormatter.format(evaluated));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "cred=\"1\""));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "name=\"MapReduce\""));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "retry-interval=\"3\""));
        Assert.assertEquals(1, StringUtils.countOccurrencesOf(evaluated, "retry-max=\"2\""));
    }
}