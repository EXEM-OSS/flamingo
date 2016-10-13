package org.exem.flamingo.shared.util;

import ch.qos.logback.ext.spring.web.WebLogbackConfigurer;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

/**
 * Application Version을 표시하는 Configurer.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
public class VersionConfigurer implements javax.servlet.ServletContextListener {

    /**
     * SLF4J Logging
     */
    private Logger logger = LoggerFactory.getLogger(VersionConfigurer.class);

    private static final long MEGA_BYTES = 1024 * 1024;

    private static final String UNKNOWN = "Unknown";

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {

        Properties properties = new Properties();
        ServletContext context = servletContextEvent.getServletContext();
        InputStream inputStream = null;
        try {
            inputStream = context.getResourceAsStream("/WEB-INF/app.properties");
            properties.load(inputStream);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Cannot load a '/WEB/INF/app.properties' file.", ex);
        } finally {
            IOUtils.closeQuietly(inputStream);
        }

        // See : http://patorjk.com/software/taag/#p=display&f=Slant&t=Flamingo%202
        StringBuilder builder = new StringBuilder();
        builder.append("    ________                _                      ___ \n" +
                "   / ____/ /___ _____ ___  (_)___  ____ _____     |__ \\\n" +
                "  / /_  / / __ `/ __ `__ \\/ / __ \\/ __ `/ __ \\    __/ /\n" +
                " / __/ / / /_/ / / / / / / / / / / /_/ / /_/ /   / __/ \n" +
                "/_/   /_/\\__,_/_/ /_/ /_/_/_/ /_/\\__, /\\____/   /____/ \n" +
                "                                /____/                 \n" +
                "                                                ");

        printHeader(builder, "Application Information");
        Properties appProps = new Properties();
        appProps.put("Instance", StringUtils.isEmpty(System.getProperty("instance")) ? "** UNKNOWN **" : System.getProperty("instance"));
        appProps.put("Version", properties.get("version"));
        appProps.put("Build Date", properties.get("build.timestamp"));
        appProps.put("Build Number", properties.get("build.number"));
        appProps.put("Revision Number", properties.get("revision.number"));
        appProps.put("Organization", properties.get("organization"));
        appProps.put("Homepage", properties.get("homepage"));

        if (context != null) {
            appProps.put("Application Server", context.getServerInfo() + " - Servlet API " + context.getMajorVersion() + "." + context.getMinorVersion());
        }

        Properties systemProperties = System.getProperties();
        appProps.put("Java Version", systemProperties.getProperty("java.version", UNKNOWN) + " - " + systemProperties.getProperty("java.vendor", UNKNOWN));
        appProps.put("Current Working Directory", systemProperties.getProperty("user.dir", UNKNOWN));

        print(builder, appProps);

        Properties memPros = new Properties();
        final Runtime rt = Runtime.getRuntime();
        final long maxMemory = rt.maxMemory() / MEGA_BYTES;
        final long totalMemory = rt.totalMemory() / MEGA_BYTES;
        final long freeMemory = rt.freeMemory() / MEGA_BYTES;
        final long usedMemory = totalMemory - freeMemory;

        memPros.put("Maximum Allowable Memory", maxMemory + "MB");
        memPros.put("Total Memory", totalMemory + "MB");
        memPros.put("Free Memory", freeMemory + "MB");
        memPros.put("Used Memory", usedMemory + "MB");

        print(builder, memPros);

        printHeader(builder, "Java System Properties");
        Properties sysProps = new Properties();
        for (final Map.Entry<Object, Object> entry : systemProperties.entrySet()) {
            sysProps.put(entry.getKey(), entry.getValue());
        }

        print(builder, sysProps);

        printHeader(builder, "System Environments");
        Map<String, String> getenv = System.getenv();
        Properties envProps = new Properties();
        Set<String> strings = getenv.keySet();
        for (String key : strings) {
            String message = getenv.get(key);
            envProps.put(key, message);
        }

        print(builder, envProps);

        WebLogbackConfigurer.initLogging(servletContextEvent.getServletContext());

        System.out.println(builder.toString());
    }

    private void printHeader(StringBuilder builder, String message) {
        builder.append(org.slf4j.helpers.MessageFormatter.format("\n== {} =====================\n", message).getMessage()).append("\n");
    }

    private void print(StringBuilder builder, Properties props) {
        int maxLength = getMaxLength(props);
        Enumeration<Object> keys = props.keys();
        while (keys.hasMoreElements()) {
            String key = (String) keys.nextElement();
            String value = props.getProperty(key);
            builder.append("  ").append(key).append(getCharacter(maxLength - key.getBytes().length, " ")).append(" : ").append(value).append("\n");
        }
    }

    private int getMaxLength(Properties props) {
        Enumeration<Object> keys = props.keys();
        int maxLength = -1;
        while (keys.hasMoreElements()) {
            String key = (String) keys.nextElement();
            if (maxLength < 0) {
                maxLength = key.getBytes().length;
            } else if (maxLength < key.getBytes().length) {
                maxLength = key.getBytes().length;
            }
        }
        return maxLength;
    }

    /**
     * 지정한 크기 만큼 문자열을 구성한다.
     *
     * @param size      문자열을 구성할 반복수
     * @param character 문자열을 구성하기 위한 단위 문자열. 반복수만큼 생성된다.
     * @return 문자열
     */
    private static String getCharacter(int size, String character) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < size; i++) {
            builder.append(character);
        }
        return builder.toString();
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        WebLogbackConfigurer.shutdownLogging(servletContextEvent.getServletContext());
    }
}