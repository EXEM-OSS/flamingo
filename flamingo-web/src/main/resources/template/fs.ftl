    <fs>
        <name-node>${action.data.nameNode}</name-node>

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
                    </property>
                </#list>
            </configuration>
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

        <#if (action.data.delete)??>
            <delete path="${source}"/>
        </#if>
        <#if (action.data.mkdir)??>
            <mkdir path="${source}"/>
        </#if>
        <#if (action.data.move)??>
            <move source="${source}" target="${target}"/>
        </#if>
        <#if (action.data.chmod)??>
            <chmod path="${source}" permissions="${permissions}" dir-files="${files}">
                <#if (action.data.recursive)??>
                    <recursive/>
                </#if>
            </chmod>
        </#if>
        <#if (action.data.touchz)??>
            <touchz path="${source}"/>
        </#if>
        <#if (action.data.chgrp)??>
            <chgrp path="${path}" group="${grouop}" dir-files="${files}">
                <#if (action.data.recursive)??>
                    <recursive/>
                </#if>
            </chgrp>
        </#if>
    </fs>
