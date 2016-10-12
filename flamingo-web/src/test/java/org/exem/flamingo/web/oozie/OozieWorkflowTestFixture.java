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

        Map parameters = new HashMap();
        parameters.put("category", "parameters");
        parameters.put("parameters", createProperties());
        actions.add(parameters);

        return workflow;
    }

    public Map createGlobal(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map global = new HashMap();
        global.put("category", "global");
        global.put("nameNode", "localhost:8020");
        global.put("jobTracker", "localhost:8032");
        global.put("jobXml", createList("1.xml", "2.xml", "3.xml"));
        global.put("properties", createProperties());
        actions.add(global);

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
