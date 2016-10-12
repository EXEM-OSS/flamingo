        <#if (action.subworkflow)??>
        <sub-workflow>
            <#if (action.subworkflow.appPath)??>
            <app-path>${action.subworkflow.appPath}</app-path>
            </#if>
            <#if (action.subworkflow.propagate)??>
            <propagate-configuration>${action.subworkflow}</propagate-configuration>
            </#if>
            <#if (action.subworkflow.properties)??>
            <configuration>
                <#list action.subworkflow.properties as property>
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
        </sub-workflow>
        </#if>
