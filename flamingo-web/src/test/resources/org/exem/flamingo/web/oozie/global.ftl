    <#if (global)??>
    <global>
        <#if (global.jobTracker)??>
        <job-tracker>${global.jobTracker}</job-tracker>
        </#if>

        <#if (global.nameNode)??>
        <name-node>${global.nameNode}</name-node>
        </#if>

        <#if (global.jobXml)??>
        <#list global.jobXml as xml>
        <job-xml>${xml}</job-xml>
        </#list>
        </#if>

        <#if (global.properties)??>
        <configuration>
            <#list global.properties as property>
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
    </#if>
