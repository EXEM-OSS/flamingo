<workflow-app xmlns="uri:oozie:workflow:0.5" name="${name}">

    <#if parameters.size > 0>
    <parameters>
    <#list parameters as parameter>
        <property>
            <#if parameter.name == 'MAPREDUCE'>
            <name>${parameter.name}</name>
            </#if>
            <#if parameter.value == 'MAPREDUCE'>
            <value>${parameter.value}</value>
            </#if>
            <#if parameter.description == 'MAPREDUCE'>
            <description>${parameter.description}</description>
            </#if>
        </property>
    </#list>
    </parameters>
    </#if>

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
