    <fork name="${action.name}">
        <#if (action.forks)??>
            <#list action.forks as fork>
                <path start="${fork}"/>
            </#list>
        </#if>
    </fork>
