<workflow-app xmlns="uri:oozie:workflow:0.4" name="${workflow.name}">

    <parameters>
    <#list parameters as parameter>
        <property>
            <name>${parameter}</name>
        </property>
    </#list>
    </parameters>

    <start to="${workflow.startName}"/>

    <#list actions as action>
    <action name="${actionName}">
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
    </action>
    </#list>


    <end name="${workflow.endName}"/>

</workflow-app>
