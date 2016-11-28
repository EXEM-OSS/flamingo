    <shell xmlns="${version!"uri:oozie:shell-action:0.3"}">
        <#if (action.data.jobTracker)??>
            <job-tracker>${action.data.jobTracker}</job-tracker>
        </#if>
        <#if (action.data.nameNode)??>
            <name-node>${action.data.nameNode}</name-node>
        </#if>
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

        <#if (action.data.jobXml)??>
            <#list action.data.jobXml as xml>
                <job-xml>${xml}</job-xml>
            </#list>
        </#if>

        <#if (action.data.configuration)??>
            <configuration>
                <#list action.data.configurations as configuration>
                    <property>
                        <name>${configuration.name}</name>
                        <value>${configuration.value}</value>
                        <#if (configuration.description) ??>
                            <description>${configuration.description}</description>
                        </#if>
                    </property>
                </#list>
            </configuration>
        </#if>

        <exec>${action.data.exec}</exec>

        <#if (action.data.args)??>
            <#list action.data.args as arg>
                <argument>${arg}</argument>
            </#list>
        </#if>

        <#if (action.data.envVars)??>
            <#list action.data.envVars as envVar>
                <env-var>${envVar}</env-var>
            </#list>
        </#if>

        <#if (action.data.files)??>
            <#list action.data.files as file>
                <file>${file}</file>
            </#list>
        </#if>

        <#if (action.data.archives)??>
            <#list action.data.archives as archive>
                <archive>${archive}</archive>
            </#list>
        </#if>

        <#if (action.data.captureOutput)??>
            <capture-output/>
        </#if>
    </shell>