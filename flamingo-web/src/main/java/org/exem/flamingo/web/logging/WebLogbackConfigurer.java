package org.exem.flamingo.web.logging;

import ch.qos.logback.core.joran.spi.JoranException;
import ch.qos.logback.ext.spring.LogbackConfigurer;
import org.springframework.util.ClassUtils;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.util.ServletContextPropertyUtils;
import org.springframework.web.util.WebUtils;

import javax.servlet.ServletContext;
import java.io.FileNotFoundException;
import java.lang.reflect.Method;

/**
 * Convenience class that performs custom Logback initialization for web environments,
 * allowing for log file paths within the web application.
 *
 * @author Byoung Gon, Kim
 * @see org.springframework.util.Log4jConfigurer
 * @see org.springframework.web.util.Log4jConfigListener
 * @since 1.0
 */
public class WebLogbackConfigurer {

    /**
     * Parameter specifying the prefix of the logback config file
     */
    public static final String CONFIG_LOCATION_PREFIX = "logbackConfigurationPrefix";

    /**
     * Parameter specifying the location of the logback config file
     */
    public static final String CONFIG_LOCATION_PARAM = "/WEB-INF/";

    /**
     * Parameter specifying whether to expose the web app root system property
     */
    public static final String EXPOSE_WEB_APP_ROOT_PARAM = "logbackExposeWebAppRoot";

    private WebLogbackConfigurer() {
    }

    /**
     * Initialize Logback, including setting the web app root system property.
     *
     * @param servletContext the current ServletContext
     * @see org.springframework.web.util.WebUtils#setWebAppRootSystemProperty
     */
    public static void initLogging(ServletContext servletContext) {
        // Expose the web app root system property.
        if (exposeWebAppRoot(servletContext)) {
            WebUtils.setWebAppRootSystemProperty(servletContext);
        }

        // Only perform custom Logback initialization in case of a config file.
        String locationParam = servletContext.getInitParameter(CONFIG_LOCATION_PREFIX);
        String springProfile = getSpringProfile(servletContext);
        String logbackRealPath = getRealPath(servletContext, springProfile);
        if (locationParam != null) {
            // Perform Logback initialization; else rely on Logback's default initialization.
            try {
                // Resolve context property placeholders before potentially resolving real path.
                String location = ServletContextPropertyUtils.resolvePlaceholders(logbackRealPath, servletContext);
                location = WebUtils.getRealPath(servletContext, location);

                // Write log message to server log.
                servletContext.log("Initializing Logback from [" + location + "]");

                System.out.println("==================================================");
                System.out.println(springProfile);
                System.out.println(logbackRealPath);
                System.out.println(location);
                System.out.println("==================================================");

                // Initialize
                LogbackConfigurer.initLogging(location);
            } catch (FileNotFoundException ex) {
                servletContext.log("No logback configuration file found at [" + logbackRealPath + "]");
            } catch (JoranException e) {
                throw new RuntimeException("Unexpected error while configuring logback", e);
            }
        }

        //If SLF4J's java.util.logging bridge is available in the classpath, install it. This will direct any messages
        //from the Java Logging framework into SLF4J. When logging is terminated, the bridge will need to be uninstalled
        try {
            Class<?> julBridge = ClassUtils.forName("org.slf4j.bridge.SLF4JBridgeHandler", ClassUtils.getDefaultClassLoader());

            Method removeHandlers = ReflectionUtils.findMethod(julBridge, "removeHandlersForRootLogger");
            if (removeHandlers != null) {
                servletContext.log("Removing all previous handlers for JUL to SLF4J bridge");
                ReflectionUtils.invokeMethod(removeHandlers, null);
            }

            Method install = ReflectionUtils.findMethod(julBridge, "install");
            if (install != null) {
                servletContext.log("Installing JUL to SLF4J bridge");
                ReflectionUtils.invokeMethod(install, null);
            }
        } catch (ClassNotFoundException ignored) {
            // Indicates the java.util.logging bridge is not in the classpath. This is not an indication of a problem.
            servletContext.log("JUL to SLF4J bridge is not available on the classpath");
        }
    }

    private static String getRealPath(ServletContext servletContext, String springProfile) {
        if (StringUtils.isEmpty(springProfile)) {
            return "/WEB-INF/logback.xml";
        }
        return CONFIG_LOCATION_PARAM + servletContext.getInitParameter(CONFIG_LOCATION_PREFIX) + "-" + springProfile + ".xml";
    }

    private static String getSpringProfile(ServletContext servletContext) {
        if (!StringUtils.isEmpty(System.getProperty("spring.profiles.active"))) {
            return System.getProperty("spring.profiles.active");
        }

        if (!StringUtils.isEmpty(servletContext.getInitParameter("spring.profiles.active"))) {
            return servletContext.getInitParameter("spring.profiles.active");
        } else {
            if (!StringUtils.isEmpty(System.getProperty("spring.profiles.default"))) {
                return System.getProperty("spring.profiles.default");
            }

            if (!StringUtils.isEmpty(servletContext.getInitParameter("spring.profiles.default"))) {
                return servletContext.getInitParameter("spring.profiles.default");
            }
        }
        return "";
    }

    /**
     * Shut down Logback, properly releasing all file locks
     * and resetting the web app root system property.
     *
     * @param servletContext the current ServletContext
     * @see WebUtils#removeWebAppRootSystemProperty
     */
    public static void shutdownLogging(ServletContext servletContext) {
        //Uninstall the SLF4J java.util.logging bridge *before* shutting down the Logback framework.
        try {
            Class<?> julBridge = ClassUtils.forName("org.slf4j.bridge.SLF4JBridgeHandler", ClassUtils.getDefaultClassLoader());
            Method uninstall = ReflectionUtils.findMethod(julBridge, "uninstall");
            if (uninstall != null) {
                servletContext.log("Uninstalling JUL to SLF4J bridge");
                ReflectionUtils.invokeMethod(uninstall, null);
            }
        } catch (ClassNotFoundException ignored) {
            //No need to shutdown the java.util.logging bridge. If it's not on the classpath, it wasn't started either.
        }

        try {
            servletContext.log("Shutting down Logback");
            LogbackConfigurer.shutdownLogging();
        } finally {
            // Remove the web app root system property.
            if (exposeWebAppRoot(servletContext)) {
                WebUtils.removeWebAppRootSystemProperty(servletContext);
            }
        }
    }

    /**
     * Return whether to expose the web app root system property,
     * checking the corresponding ServletContext init parameter.
     *
     * @param servletContext the servlet context
     * @return {@code true} if the webapp's root should be exposed; otherwise, {@code false}
     * @see #EXPOSE_WEB_APP_ROOT_PARAM
     */
    @SuppressWarnings({"BooleanMethodNameMustStartWithQuestion"})
    private static boolean exposeWebAppRoot(ServletContext servletContext) {
        String exposeWebAppRootParam = servletContext.getInitParameter(EXPOSE_WEB_APP_ROOT_PARAM);
        return (exposeWebAppRootParam == null || Boolean.valueOf(exposeWebAppRootParam));
    }
}
