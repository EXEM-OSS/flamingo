    <streaming>
        <#if (action.data.streaming.mapper)??>
            <mapper>${action.data.streaming.mapper}</mapper>
        </#if>

        <#if (action.data.streaming.reduce)??>
            <reduce>${action.data.streaming.reduce}</reduce>
        </#if>

        <#if (action.data.streaming.recordReader)??>
            <record-reader>${action.data.streaming.recordReader}</record-reader>
        </#if>

        <#if (action.data.streaming.mappings)??>
            <#list action.data.streaming.mappings as mapping>
                <record-reader-mapping>${mapping}</record-reader-mapping>
            </#list>
        </#if>

        <#if (action.data.streaming.envVars)??>
            <#list action.data.streaming.envVars as envVar>
                <env-var>${envVar}</env-var>
            </#list>
        </#if>
    </streaming>
