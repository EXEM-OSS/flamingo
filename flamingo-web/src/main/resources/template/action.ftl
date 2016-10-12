    <action name="${action.name}" <#if (action.cred)??>cred="${action.cred}"</#if> <#if (action.retryMax)??>retry-max="${action.retryMax}"</#if> <#if (action.retryInterval)??>retry-interval="${action.retryInterval}"</#if>>
    <#if (action.data.type)??>
    <#switch action.data.type>
        <#case "mapreduce">
            <#include "mapreduce.ftl">
            <#break>
        <#default>
    </#switch>
    </#if>
    </action>
