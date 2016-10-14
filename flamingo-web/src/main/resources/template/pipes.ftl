    <pipes>
        <#if (action.data.pipes.map)??>
            <map>${action.data.pipes.map}</map>
        </#if>
        <#if (action.data.pipes.reduce)??>
            <reduce>${action.data.pipes.reduce}</reduce>
        </#if>
        <#if (action.data.pipes.inputformat)??>
            <inputformat>${action.data.pipes.inputformat}</inputformat>
        </#if>
        <#if (action.data.pipes.writer)??>
            <writer>${action.data.pipes.writer}</writer>
        </#if>
        <#if (action.data.pipes.program)??>
            <program>${action.data.pipes.program}</program>
        </#if>
    </pipes>
