Ext.define('Flamingo.view.oozie.dashboard.monitoring.TimeGridDetailPop', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.oozie.dashboard.monitoring.TimeGridDetailPopController',
        'Flamingo.view.oozie.workflow.WorkflowModel',
        'Flamingo.view.oozie.workflow.WorkflowGridDetail'
    ],

    layout: 'fit',

    modal: true,
    resizable: false,

    controller: 'timeGridDetailPopController',
    viewModel: 'workflowModel',

    items: [{
        xtype: 'container',
        flex: 1,
        padding: 20,
        layout: 'border',
        items: [{
            region: 'east',
            xtype: 'panel',
            reference: 'detail',
            split: true,
            frame: true,
            cls: 'panel-shadow',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'workflowgriddetail',
                flex: 1,
                reference: 'workflowgriddetail',
                title: 'Actions',
                bind: {
                    store: '{workflowActionStore}'
                },
                listeners: {
                    itemdblclick: 'onActionRowDblClick'
                }
            },{
                xtype: 'tabpanel',
                reference: 'actionTab',
                layout: 'fit',
                flex: 1,
                items: [{
                    title: 'Action Info',
                    xtype: 'form',
                    reference: 'actionForm',
                    border: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: 10,
                    scrollable: true,
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'Name',
                        name: 'app_name',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Type',
                        name: 'type',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Transition',
                        name: 'transition',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Start Time',
                        name: 'start_time',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'End Time',
                        name: 'end_time',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Status',
                        name: 'status',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Error Code',
                        name: 'error_code',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Error Message',
                        name: 'error_message',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'External ID',
                        name: 'external_id',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'External Status',
                        name: 'external_status',
                        readOnly: true
                    },{
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Console URL',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'console_url',
                            flex: 1,
                            readOnly: true
                        },{
                            xtype: 'button',
                            handler: 'onConsoleURL',
                            margin: '0 0 0 5',
                            text: 'Go'
                        }]

                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Tracker URI',
                        name: 'tracker_uri',
                        readOnly: true
                    },{
                        xtype: 'grid',
                        reference: 'childgrid',
                        bind: {
                            store: '{childStore}'
                        },
                        title: 'Child Job URLs',
                        columnLines: true,
                        columns: [
                            {xtype: 'rownumberer', width: 40},
                            {text: "URL", flex: 1, dataIndex: 'child_url', align: 'center'}
                        ]
                    }]

                },{
                    title: 'Action Configuration',
                    xtype: 'abstractEditor',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    reference: 'configuration',
                    parser: 'xml',
                    forceFit: true,
                    theme: 'eclipse',
                    printMargin: false,
                    readOnly: true
                }],
                listeners: {
                    tabchange: 'onActionDetailTabChange'
                }
            }]
        },{
            region: 'center',
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            frame: true,
            cls: 'panel-shadow',
            items: [{
                xtype: 'form',
                reference: 'wfForm',
                flex: 1,
                title: 'Info',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                bodyPadding: 10,
                scrollable: true,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Job ID',
                    name: 'id',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Name',
                    name: 'app_name',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'App Path',
                    name: 'app_path',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Run',
                    name: 'run',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Status',
                    name: 'status',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'User',
                    name: 'user_name',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Group',
                    name: 'group_name',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Parent Coord',
                    name: 'parent_id',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Create Time',
                    name: 'created_time',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Start Time',
                    name: 'start_time',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Last Modified',
                    name: 'last_modified_time',
                    readOnly: true
                },{
                    xtype: 'textfield',
                    fieldLabel: 'End Time',
                    name: 'end_time',
                    readOnly: true
                }]
            },{
                xtype: 'tabpanel',
                reference: 'wfDetail',
                flex: 1,
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
                    tabchange: 'onWfTabChangePop'
                }
            }]
        }]
    }],
    listeners: {
        afterrender: 'onAfterrender'
    }
});