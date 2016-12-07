Ext.define('Flamingo.view.oozie.workflow.WorkflowDetailPop', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.oozie.workflow.WorkflowDetailPopController',
        'Flamingo.view.oozie.workflow.WorkflowJobConf',
        'Flamingo.view.oozie.workflow.WorkflowJobLog',
        'Flamingo.view.oozie.workflow.WorkflowJobDefinition',
        'Flamingo.view.editor.AbstractEditor'
    ],

    layout: 'fit',

    modal: true,
    resizable: false,

    title: 'Workflow Job',

    controller: 'wfDetailPopController',

    items: [{
        xtype: 'tabpanel',
        reference: 'ganttDetail',
        layout: 'fit',
        items: [{
            title: 'Definition',
            xtype: 'wfdefinition',
            reference: 'wfDefinition'
        },{
            title: 'Configuration',
            xtype: 'wfconfiguration',
            reference: 'wfConfiguration'
        },{
            title: 'Log',
            xtype: 'wflog',
            reference: 'wfLog'
        }],
        listeners: {
            tabchange: 'onTabChangePop'
        }
    }],
    listeners: {
        afterrender: 'onAfterrender'
    }
});