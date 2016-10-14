    <spark xmlns="${version!"uri:oozie:spark-action:0.1"}">
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

        <#if (action.data.master)??>
            <master>${action.data.master}</master>
        </#if>

        <#if (action.data.mode)??>
            <mode>${action.data.mode}</mode>
        </#if>

        <#if (action.data.name)??>
            <name>${action.data.name}</name>
        </#if>

        <#if (action.data.class)??>
            <class>${action.data.class}</class>
        </#if>

        <#if (action.data.jar)??>
            <jar>${action.data.jar}</jar>
        </#if>

        <#if (action.data.sparkOpts)??>
            <spark-opts>${action.data.sparkOpts}</spark-opts>
        </#if>

        <#if (action.data.args)??>
            <#list action.data.args as arg>
                <arg>${arg}</arg>
            </#list>
        </#if>
    </spark>
