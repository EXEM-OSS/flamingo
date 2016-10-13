    <parameters>
        <#list action.parameters as parameter>
            <property>
                <#if (parameter.name)??>
                    <name>${parameter.name}</name>
                </#if>
                <#if (parameter.value)??>
                    <value>${parameter.value}</value>
                </#if>
                <#if (parameter.description)??>
                    <description>${parameter.description}</description>
                </#if>
            </property>
        </#list>
    </parameters>
