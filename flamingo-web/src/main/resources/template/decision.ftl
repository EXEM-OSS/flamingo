    <decision name="${action.name}">
        <switch>
            <#list action.dcs as dc>
                <#switch dc.type>
                    <#case "case">
                        <case to="${dc.to}">${dc.predicate}</case>
                        <#break>
                    <#case "default">
                        <default to="${dc.to}"/>
                        <#break>
                    <#default>
                </#switch>
            </#list>
        </switch>
    </decision>
