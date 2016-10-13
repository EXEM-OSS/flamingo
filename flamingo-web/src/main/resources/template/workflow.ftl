<workflow-app xmlns="${version!"uri:oozie:workflow:0.5"}" name="${name}">

    <#list actions as action>
        <#switch action.category>
            <#case "parameters">
                <#include "parameters.ftl">
                <#break>
            <#case "global">
                <#include "global.ftl">
                <#break>
            <#case "credentials">
                <#include "credentials.ftl">
                <#break>
            <#case "start">
                <#include "start.ftl">
                <#break>
            <#case "end">
                <#include "end.ftl">
                <#break>
            <#case "kill">
                <#include "kill.ftl">
                <#break>
            <#case "decision">
                <#include "decision.ftl">
                <#break>
            <#case "fork">
                <#include "fork.ftl">
                <#break>
            <#case "join">
                <#include "join.ftl">
                <#break>
            <#case "action">
                <#include "action.ftl">
                <#break>
            <#default>
        </#switch>
    </#list>

</workflow-app>
