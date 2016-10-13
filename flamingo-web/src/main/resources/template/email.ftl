    <email xmlns="${version!"uri:oozie:email-action:0.2"}">
        <#if (action.data.to)??>
            <to>${action.data.to}</to>
        </#if>

        <#if (action.data.cc)??>
            <cc>${action.data.cc}</cc>
        </#if>

        <#if (action.data.subject)??>
            <subject>${action.data.subject}</subject>
        </#if>

        <#if (action.data.body)??>
            <body>${action.data.body}</body>
        </#if>

        <#if (action.data.contentType)??>
            <content_type>${action.data.contentType}</content_type>
        </#if>

        <#if (action.data.attachment)??>
            <attachment>${action.data.attachment}</attachment>
        </#if>
    </email>
