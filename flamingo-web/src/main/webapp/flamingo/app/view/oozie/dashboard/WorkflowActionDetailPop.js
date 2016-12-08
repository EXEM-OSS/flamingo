/**
 * Created by cloudine on 2016. 8. 1..
 */
Ext.define('Flamingo.view.oozie.dashboard.WorkflowActionDetailPop', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.oozie.dashboard.DashBoardController',
        'Ext.tab.Panel',
        'Flamingo.view.editor.AbstractEditor'
    ],

    controller: 'dashBoardController',
    viewModel: 'dashBoardModel',

    width: 700,
    height: 550,
    layout: 'fit',

    modal: true,
    resizable: false,

    items: [{
        xtype: 'tabpanel',
        reference: 'actionTab',
        border: true,
        layout: 'fit',
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
    }],
    listeners: {
        afterrender: 'onActionDetailPopAfterrender'
    }
});