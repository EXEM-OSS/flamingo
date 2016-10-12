package org.exem.flamingo.web.oozie;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OozieWorkflowTestFixture {

    public Map createWorkflow(String workflowName) {
        Map workflow = new HashMap();
        workflow.put("name", workflowName);
        workflow.put("actions", new ArrayList());
        return workflow;
    }

    public Map createParameters(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "parameters");
        node.put("parameters", createProperties());
        actions.add(node);

        return workflow;
    }

    public Map createGlobal(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "global");
        node.put("nameNode", "localhost:8020");
        node.put("jobTracker", "localhost:8032");
        node.put("jobXml", createList("1.xml", "2.xml", "3.xml"));
        node.put("properties", createProperties());
        actions.add(node);

        return workflow;
    }

    public Map createStart(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "start");
        node.put("name", "Start");
        node.put("to", "nextAction");
        actions.add(node);

        return workflow;
    }

    public Map createEnd(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "end");
        node.put("name", "End");
        actions.add(node);

        return workflow;
    }

    public Map createKill(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "kill");
        node.put("name", "kill");
        node.put("message", "Job Killed");
        actions.add(node);

        return workflow;
    }

    public List createProperties() {
        List list = new ArrayList();
        list.add(createProperty("1", "4", "7"));
        list.add(createProperty("2", "5", "8"));
        list.add(createProperty("3", "6", "9"));
        return list;
    }

    public Map createProperty(String name, String value, String description) {
        Map property = new HashMap();
        property.put("name", name);
        property.put("value", value);
        property.put("description", description);
        return property;
    }

    public List<String> createList(String... params) {
        List list = new ArrayList();
        for (String param : params) {
            list.add(param);
        }
        return list;
    }

}
