<workflow-app xmlns="uri:oozie:workflow:0.5" name="${name}">

    <#list actions as action>
    <#switch action.category>
        <#case "parameters">
            <#include "parameters.ftl">
            <#break>
        <#case "global">
            <#include "global.ftl">
            <#break>
        <#default>
    </#switch>
    </#list>

</workflow-app>
