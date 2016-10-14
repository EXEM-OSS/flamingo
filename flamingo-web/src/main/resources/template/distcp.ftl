    <distcp xmlns="${version!"uri:oozie:distcp-action:0.2"}">
        <job-tracker>${action.data.jobTracker}</job-tracker>
        <name-node>${action.data.nameNode}</name-node>

        <#if (action.data.prepares)??>
            <prepare>
                <#list action.data.prepares as prepare>
                    <#if prepare.type == 'DELETE'>
                        <delete path="${prepare.path}"/>
                    <#elseif prepare.type == 'MKDIR'>
                        <mkdir path="${prepare.path}"/>
                    </#if>
                </#list>
            </prepare>
        </#if>

        <#if (action.data.configuration)??>
            <configuration>
                <#list action.data.configurations as configuration>
                    <property>
                        <name>${configuration.name}</name>
                        <value>${configuration.value}</value>
                    </property>
                </#list>
            </configuration>
        </#if>

        <#if (action.data.javaOpts)??>
            <java-opts>${action.data.javaOpts}</java-opts>
        </#if>

        <#if (action.data.args)??>
            <#list action.data.args as arg>
                <arg>${arg}</arg>
            </#list>
        </#if>
    </distcp>
