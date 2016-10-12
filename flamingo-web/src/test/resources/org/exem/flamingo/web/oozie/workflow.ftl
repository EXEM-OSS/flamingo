<workflow-app xmlns="uri:oozie:workflow:0.4" name="${workflow.name}">

    <#if parameters.size > 0>
    <parameters>
    <#list parameters as parameter>
        <property>
            <name>${parameter}</name>
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
                <#elseif prepare.type == 'DELETE'>
                </#if>
                </prepare>
            </#list>
            <configuration>
                <property>
                    <name>mapred.mapper.class</name>
                    <value>com.myBiz.mr.MyMapClass</value>
                </property>
                <property>
                    <name>mapred.reducer.class</name>
                    <value>com.myBiz.mr.MyRedClass</value>
                </property>
                <property>
                    <name>mapred.job.reduce.memory.mb</name>
                    <value>8192</value>
                </property>
                <property>
                    <name>mapred.input.dir</name>
                    <value>/hdfs/user/joe/input</value>
                </property>
                <property>
                    <name>mapred.output.dir</name>
                    <value>/hdfs/user/joe/output</value>
                </property>
            </configuration>
        </map-reduce>
        </#if>
    </action>
    </#list>

    <end name="${workflow.endName}"/>

</workflow-app>
