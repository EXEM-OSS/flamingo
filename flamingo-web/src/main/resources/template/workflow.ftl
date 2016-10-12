<workflow-app xmlns="uri:oozie:workflow:0.5" name="${name}">

    <#list actions as action>
    <#switch action.category>
        <#case "parameters">
            <#include "parameters.ftl">
            <#break>
        <#case "global">
            <#include "global.ftl">
            <#break>
        <#case "start">
            <#include "start.ftl">
        <#case "end">
            <#include "end.ftl">
        <#case "kill">
            <#include "kill.ftl">
            <#break>
        <#default>
    </#switch>
    </#list>

</workflow-app>
