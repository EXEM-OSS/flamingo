<workflow-app xmlns="uri:oozie:workflow:0.5" name="${name}">

    <#include "parameter.ftl">

    <#include "global.ftl">

    <start name="${workflow.startName}" to="${workflow.startTo}"/>

    <#list actions as action>
    <action name="${actionName}" to="${action.to}">
        <#if action.type == 'MAPREDUCE'>
        <map-reduce>
            <job-tracker>${action.jobTracker}</job-tracker>
            <name-node>${action.nameNode}</name-node>
            <#list action.prepares as prepare>
            <prepare>
                <#if prepare.type == 'DELETE'>
                <delete path="${prepare.path}"/>
                <#elseif prepare.type == 'MKDIR'>
                <mkdir path="${prepare.path}"/>
                </#if>
                </prepare>
            </#list>

            <#if action.configuration.size > 0>
            <configuration>
                <#list action.configurations as configuration>
                <property>
                    <name>${configuration.name}</name>
                    <value>${configuration.value}</value>
                </property>
                </#list>
            </configuration>
            </#if>
        </map-reduce>
        </#if>
    </action>
    </#list>

    <end name="${workflow.endName}"/>

</workflow-app>
