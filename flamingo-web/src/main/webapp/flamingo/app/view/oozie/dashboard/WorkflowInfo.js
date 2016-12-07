Ext.define('Flamingo.view.oozie.dashboard.WorkflowInfo', {
    extend: 'Ext.panel.Panel',
    xtype: 'workflowinfo',
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        scrollable: true,
        items: [{
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '15 10 10 20',
            items: [{
                xtype: 'textfield',
                reference: 'jobId',
                fieldLabel: 'Job ID',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'name',
                fieldLabel: 'Name',
                readOnly: true
            },{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin: '0 0 5 0',
                items: [{
                    xtype: 'textfield',
                    reference: 'appPath',
                    flex: 1,
                    fieldLabel: 'App Path',
                    readOnly: true
                },{
                    xtype: 'button',
                    text: '찾기',
                    margin: '0 0 0 10',
                    handler: 'onAppPathClick'
                }]
            },{
                xtype: 'textfield',
                reference: 'run',
                fieldLabel: 'Run',
                readOnly: true
            }]
        },{
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '15 10 10 10',
            items: [{
                xtype: 'textfield',
                reference: 'status',
                fieldLabel: 'Status',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'user',
                fieldLabel: 'User',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'group',
                fieldLabel: 'Group',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'parentCoord',
                fieldLabel: 'Parent Coord',
                readOnly: true
            }]
        },{
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '15 20 10 10',
            items: [{
                xtype: 'textfield',
                reference: 'createTime',
                fieldLabel: 'Create Time',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'startTime',
                fieldLabel: 'Start Time',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'lastModified',
                fieldLabel: 'Last Modified',
                readOnly: true
            },{
                xtype: 'textfield',
                reference: 'endTime',
                fieldLabel: 'End time',
                readOnly: true
            }]
        }]
    },{
        xtype: 'workflowactiongrid',
        reference: 'workflowActionGrid',
        title: 'Actions',
        flex: 1.3,
        bind: {
            store: '{workflowActionStore}'
        }
    }]
});