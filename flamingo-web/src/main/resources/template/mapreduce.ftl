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
