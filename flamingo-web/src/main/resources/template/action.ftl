    <action name="${action.name}" <#if (action.cred)??>cred="${action.cred}"</#if> <#if (action.retryMax)??>retry-max="${action.retryMax}"</#if> <#if (action.retryInterval)??>retry-interval="${action.retryInterval}"</#if>>
        <#if (action.data.type)??>
            <#switch action.data.type>
                <#case "mapreduce">
                    <#include "mapreduce.ftl">
                    <#break>
                <#case "pig">
                    <#include "pig.ftl">
                    <#break>
                <#case "hive">
                    <#include "hive.ftl">
                    <#break>
                <#case "hive2">
                    <#include "hive.ftl">
                    <#break>
                <#case "shell">
                    <#include "shell.ftl">
                    <#break>
                <#case "distcp">
                    <#include "distcp.ftl">
                    <#break>
                <#case "spark">
                    <#include "spark.ftl">
                    <#break>
                <#case "fs">
                    <#include "fs.ftl">
                    <#break>
                <#case "java">
                    <#include "java.ftl">
                    <#break>
                <#case "email">
                    <#include "email.ftl">
                    <#break>
                <#default>
            </#switch>
        </#if>
    </action>
