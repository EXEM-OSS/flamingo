    <credentials>
        <credential name="${action.name}" type="${action.type}">
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
        </credential>
    </credentials>
