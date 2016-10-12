    <#if (kill)??>
    <kill name="${kill.name}">
        <#if (kill.message)??>
        <message>${kill.message}</message>
        </#if>
    </kill>
    </#if>
