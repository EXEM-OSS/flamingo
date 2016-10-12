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

    public Map createCredentials(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "credentials");
        node.put("name", "Credentials");
        node.put("type", "Credentials Type");
        node.put("properties", createProperties());
        actions.add(node);

        return workflow;
    }

    public Map createDecision(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "decision");
        node.put("name", "Decision");
        node.put("dcs", createDecisionCases());
        actions.add(node);

        return workflow;
    }

    public List createDecisionCases() {
        List list = new ArrayList();
        list.add(createDecisionCase_Case());
        list.add(createDecisionCase_Default());
        return list;
    }

    public Map createDecisionCase_Case() {
        Map property = new HashMap();
        property.put("type", "case");
        property.put("to", "To");
        property.put("predicate", "Predicate");
        return property;
    }

    public Map createDecisionCase_Default() {
        Map property = new HashMap();
        property.put("type", "default");
        property.put("to", "To");
        return property;
    }

    public Map createJoin(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "join");
        node.put("name", "Join");
        node.put("to", "Next");
        actions.add(node);

        return workflow;
    }

    public Map createFork(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "fork");
        node.put("name", "Join");
        node.put("forks", createForkItem("1", "2", "3"));
        actions.add(node);

        return workflow;
    }

    public List<String> createForkItem(String... params) {
        List list = new ArrayList();
        for (String param : params) {
            list.add(param);
        }
        return list;
    }

    public Map createAction(Map workflow) {
        ArrayList actions = (ArrayList) workflow.get("actions");

        Map node = new HashMap();
        node.put("category", "action");
        node.put("name", "MapReduce");
        node.put("cred", "1");
        node.put("retryMax", "2");
        node.put("retryInterval", "3");
        actions.add(node);

        return workflow;
    }

}
