    <global>
        <#if (action.jobTracker)??>
            <job-tracker>${action.jobTracker}</job-tracker>
        </#if>

        <#if (action.nameNode)??>
            <name-node>${action.nameNode}</name-node>
        </#if>

        <#if (action.jobXml)??>
            <#list action.jobXml as xml>
                <job-xml>${xml}</job-xml>
            </#list>
        </#if>

        <#if (action.properties)??>
            <configuration>
                <#list action.properties as property>
                    <property>
                        <#if (property.name)??>
                            <name>${property.name}</name>
                        </#if>
                        <#if (property.value)??>
                            <value>${property.value}</value>
                        </#if>
                        <#if (property.description)??>
                            <description>${property.description}</description>
                        </#if>
                    </property>
                </#list>
            </configuration>
        </#if>
    </global>
