    <map-reduce>
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

        <#if (action.data.configClass)??>
            <config-class>${action.data.configClass}</config-class>
        </#if>

        <#if (action.data.archives)??>
            <#list action.data.archives as archive>
                <archive>${archive}</archive>
            </#list>
        </#if>

        <#if (action.data.files)??>
            <#list action.data.files as file>
                <file>${file}</file>
            </#list>
        </#if>
    </map-reduce>
