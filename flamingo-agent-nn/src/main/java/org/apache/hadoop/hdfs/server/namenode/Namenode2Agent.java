/*
 * Copyright (C) 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.hadoop.hdfs.server.namenode;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.util.VersionInfo;
import org.exem.flamingo.agent.nn.ResourceUtils;
import org.exem.flamingo.agent.nn.SortedProperties;
import org.exem.flamingo.agent.nn.SystemUtils;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.Log4jConfigurer;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Namenode가 구동할 때 Aspect를 통해서 같이 동작하는 Agent.
 *
 * @author Byoung Gon, Kim
 * @since 0.1
 */
public class Namenode2Agent {

    /**
     * Apache Hadoop Namenode
     */
    public static NameNode namenode;

    /**
     * Hadoop Configuration
     */
    public static Configuration configuration;

    /**
     * Is initialized?
     */
    private static boolean isInitialized;

    /**
     * Spring Framework Application Context
     */
    private static AbstractApplicationContext context;

    public static final long MEGA_BYTES = 1024 * 1024;

    public static final String UNKNOWN = "Unknown";

    private static final Log LOG = LogFactory.getLog(Namenode2Agent.class);

    /**
     * Namenode Monitoring Agent를 시작한다.
     *
     * @param args Apache Hadoop Namenode, Configuration
     * @throws RuntimeException 초기화할 수 없는 경우
     */
    public static void start(Object nn, Object[] args) {
        Namenode2Agent.namenode = (NameNode) nn;
        Namenode2Agent.configuration = (Configuration) args[0];

        if (!isInitialized) {
            isInitialized = true;

            Thread t = new Thread(new ThreadGroup("Flamingo"), new Runnable() {
                @Override
                public void run() {
                    try {
                        startup();
                        context = new ClassPathXmlApplicationContext("applicationContext-namenode2.xml");

                        try {
                            Thread.sleep(3000);
                        } catch (InterruptedException e) {
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Flamingo :: Cannot initialized.", e);
                    }
                }
            }, "Namenode 2 Agent");
            t.start();
        }
    }

    private static void startup() throws Exception {
        System.setProperty("PID", SystemUtils.getPid());

        try {
            Log4jConfigurer.initLogging(System.getProperty("location"), Long.parseLong(System.getProperty("refreshInterval")));
        } catch (Exception ex) {
            System.out.println("Flamingo 2 :: Cannot load Log4J configuration file. Use Resource Manager Log4J.");
        }

        StringBuilder builder = new StringBuilder();

        LOG.info("============================================================\n" +
            "Now starting Flamingo 2 - Namenode 2 Agent (" + SystemUtils.getPid() + ") ....\n" +
            "============================================================");

        builder.append("    ________                _                      __  __          __                     ___                    __ \n" +
            "   / ____/ /___ _____ ___  (_)___  ____ _____     / / / /___ _____/ /___  ____  ____     /   | ____ ____  ____  / /_\n" +
            "  / /_  / / __ `/ __ `__ \\/ / __ \\/ __ `/ __ \\   / /_/ / __ `/ __  / __ \\/ __ \\/ __ \\   / /| |/ __ `/ _ \\/ __ \\/ __/\n" +
            " / __/ / / /_/ / / / / / / / / / / /_/ / /_/ /  / __  / /_/ / /_/ / /_/ / /_/ / /_/ /  / ___ / /_/ /  __/ / / / /_  \n" +
            "/_/   /_/\\__,_/_/ /_/ /_/_/_/ /_/\\__, /\\____/  /_/ /_/\\__,_/\\__,_/\\____/\\____/ .___/  /_/  |_\\__, /\\___/_/ /_/\\__/  \n" +
            "                                /____/                                      /_/             /____/                  ");

        SortedProperties properties = new SortedProperties();
        InputStream is = ResourceUtils.getResource("classpath:/version.properties").getInputStream();
        properties.load(is);
        is.close();

        printHeader(builder, "Application Information");
        SortedProperties appProps = new SortedProperties();
        appProps.put("Application", "Flamingo Hadoop Namenode 2 Monitoring Agent");
        appProps.put("Version", properties.get("version"));
        appProps.put("Build Date", properties.get("build.timestamp"));
        appProps.put("Build Number", properties.get("build.number"));
        appProps.put("Revision Number", properties.get("revision.number"));
        appProps.put("Build Key", properties.get("build.key"));

        SortedProperties systemProperties = new SortedProperties();
        systemProperties.putAll(System.getProperties());
        appProps.put("Java Version", systemProperties.getProperty("java.version", UNKNOWN) + " - " + systemProperties.getProperty("java.vendor", UNKNOWN));
        appProps.put("Current Working Directory", systemProperties.getProperty("user.dir", UNKNOWN));

        print(builder, appProps);

        printHeader(builder, "Hadoop Information");

        SortedProperties hadoopProps = new SortedProperties();
        hadoopProps.put("Version", VersionInfo.getVersion()); // FIXME
        hadoopProps.put("Build Version", VersionInfo.getBuildVersion());

        print(builder, hadoopProps);

        printHeader(builder, "JVM Heap Information");

        Properties memPros = new Properties();
        final Runtime rt = Runtime.getRuntime();
        final long maxMemory = rt.maxMemory() / MEGA_BYTES;
        final long totalMemory = rt.totalMemory() / MEGA_BYTES;
        final long freeMemory = rt.freeMemory() / MEGA_BYTES;
        final long usedMemory = totalMemory - freeMemory;

        memPros.put("Total Memory", totalMemory + "MB");
        memPros.put("Maximum Allowable Memory", maxMemory + "MB");
        memPros.put("Used Memory", usedMemory + "MB");
        memPros.put("Free Memory", freeMemory + "MB");

        print(builder, memPros);

        printHeader(builder, "Java System Properties");
        SortedProperties sysProps = new SortedProperties();
        for (final Map.Entry<Object, Object> entry : systemProperties.entrySet()) {
            sysProps.put(entry.getKey(), entry.getValue());
        }

        print(builder, sysProps);

        printHeader(builder, "System Environments");
        Map<String, String> getenv = System.getenv();
        SortedProperties envProps = new SortedProperties();
        Set<String> strings = getenv.keySet();
        for (String key : strings) {
            String message = getenv.get(key);
            envProps.put(key, message);
        }

        print(builder, envProps);

/*
        LogbackConfigurer.initLogging("classpath:/logback.xml");
*/

        System.out.println(builder.toString());

        System.out.println("================================================================================================");
        System.out.println(" Flamingo Hadoop Namenode 2 Monitoring Agent starting... (" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()) + ")");
        System.out.println("================================================================================================");
    }

    /**
     * 헤더값을 출력한다.
     *
     * @param builder {@link StringBuilder}
     * @param message 출력할 메시지
     */
    private static void printHeader(StringBuilder builder, String message) {
        builder.append("\n== " + message + " =====================\n").append("\n");
    }

    /**
     * Key Value 속성을 출력한다.
     *
     * @param builder {@link StringBuilder}
     * @param props   출력할 Key Value 속성
     */
    private static void print(StringBuilder builder, Properties props) {
        int maxLength = getMaxLength(props);
        Enumeration<Object> keys = props.keys();
        while (keys.hasMoreElements()) {
            String key = (String) keys.nextElement();
            String value = props.getProperty(key);
            builder.append("  ").append(key).append(getCharacter(maxLength - key.getBytes().length, " ")).append(" : ").append(value).append("\n");
        }
    }

    /**
     * 콘솔에 출력할 Key Value 중에서 가장 긴 Key 문자열의 길이를 반환한다.
     *
     * @param props {@link Properties}
     * @return Key 문자열 중에서 가장 긴 문자열의 길이
     */
    private static int getMaxLength(Properties props) {
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

    public static AbstractApplicationContext getContext() {
        return context;
    }
}
