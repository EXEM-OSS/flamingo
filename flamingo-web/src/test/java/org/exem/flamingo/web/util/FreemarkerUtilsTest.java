package org.exem.flamingo.web.util;

import freemarker.template.Configuration;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class FreemarkerUtilsTest {

    @Test
    public void evaluate() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("org.exem.flamingo.web.oozie/applicationContext.xml");
        Configuration conf = ctx.getBean(Configuration.class);
    }

}