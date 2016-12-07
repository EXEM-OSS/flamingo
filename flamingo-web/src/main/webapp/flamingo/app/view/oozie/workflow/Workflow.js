Ext.define('Flamingo.view.oozie.workflow.Workflow', {
    extend: 'Ext.panel.Panel',
    xtype: 'oozieworkflow',
    requires: [
        'Flamingo.view.oozie.workflow.WorkflowController',
        'Flamingo.view.oozie.workflow.WorkflowModel',
        'Flamingo.view.oozie.workflow.WorkflowGrid',
        'Flamingo.view.oozie.workflow.WorkflowGridDetail',
        'Flamingo.view.oozie.workflow.WorkflowJobConf',
        'Flamingo.view.oozie.workflow.WorkflowJobDefinition',
        'Flamingo.view.oozie.workflow.WorkflowJobLog'
    ],

    controller: 'workflowController',
    viewModel: 'workflowModel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyStyle: {
        background: '#dcdcdc'
    },

    items: [{
        xtype: 'container',
        height: 60,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'component',
            flex: 1,
            style: {
                background: '#FFFFFF'
            },
            html: '<h2 style="padding: 0; margin:20px 0 0 20px;">Oozie Workflow</h2>'
        },{
            xtype: 'container',
            style: {
                background: '#FFFFFF'
            },
            layout: {
                type: 'vbox'
            },
            items: [{
                xtype: 'component',
                flex: 1
            },{
                xtype: 'combo',
                width: 350,
                fieldLabel: 'Timezone',
                labelAlign: 'right',
                emptyText: 'Select a timezone...',
                reference: 'cbxTimezone',
                margin: '0 20 15 0',
                bind: {
                    store: '{timeZones_store}'
                },
                displayField: 'timezoneDisplayName',
                valueField: 'timezoneId',
                queryMode: 'local',
                publishes: 'value',
                triggerAction: 'all',
                value: Ext.state.Manager.get("TimezoneId", "GMT"),
                listConfig: {
                    itemTpl: [
                        '<div data-qtip="{timezoneDisplayName}">{timezoneDisplayName}</div>'
                    ]
                },
                listeners: {
                    select: 'onTimezoneSelect'
                }
            }]
        }]
    }, {
        xtype: 'form',
        reference: 'wfForm',
        margin: '20 20 7 20',
        cls: 'panel-shadow',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        bodyPadding: 10,
        items: [{
            xtype: 'panel',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                flex: 1,
                items: [{
                    xtype: 'datefield',
                    reference: 'startDate',
                    editable: false,
                    format: 'Y-m-d',
                    width: 110,
                    value: new Date(),
                    name: 'startDate'
                }, {
                    xtype: 'panel',
                    html: '~',
                    margin: '0 5 0 5'
                }, {
                    xtype: 'datefield',
                    reference: 'endDate',
                    editable: false,
                    format: 'Y-m-d',
                    width: 110,
                    value: new Date(),
                    name: 'endDate'
                }, {
                    xtype: 'combobox',
                    reference: 'cbxStatus',
                    name: 'status',
                    fieldLabel: 'Status',
                    displayField: 'key',
                    editable: false,
                    triggerAction: 'all',
                    valueField: 'name',
                    queryMode: 'local',
                    labelWidth: 50,
                    labelAlign: 'right',
                    multiSelect: true,
                    bind: {
                        store: '{statusStore}'
                    },
                    listeners: {
                        change: 'onCbxStatusChange',
                        afterrender: 'onCbxAfterrender'
                    },
                    listConfig: {
                        getInnerTpl: function() {
                            return '<div class="x-combo-list-item"><img src="' + Ext.BLANK_IMAGE_URL + '" class="chkCombo-default-icon chkCombo" />&nbsp;&nbsp;{key}</div>'
                        }
                    }

                }, {
                    xtype: 'combobox',
                    reference: 'cbxGubun',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'key',
                    value: 'app_name',
                    editable: false,
                    width: 80,
                    bind: {
                        store: '{comboboxStore}'
                    },
                    name: 'cbxGubun',
                    margin: '0 5 0 5'
                }, {
                    xtype: 'textfield',
                    reference: 'txtFind',
                    width: 250,
                    name: 'txtFind',
                    margin: '0 5 0 0',
                    enableKeyEvents: true,
                    listeners: {
                        keydown: 'onKeyDown'
                    }
                }, {
                    xtype: 'button',
                    text: 'Find',
                    iconCls: 'fi icon-fm-search',
                    handler: 'onFindClick'
                }]
            },{
                xtype: 'button',
                text: 'Action',
                menu: [{
                    text: 'Resume',
                    iconCls: 'fi icon-fm-play',
                    handler: 'onJobResumeBtnClick'
                }, {
                    text: 'Suspend',
                    iconCls: 'fi icon-fm-pause',
                    handler: 'onJobSuspendBtnClick'
                }, {
                    text: 'Kill',
                    iconCls: 'fi icon-fm-x',
                    handler: 'onJobKillBtnClick'
                }]
            }]

        }]
    },{
        xtype: 'container',
        flex: 1,
        scrollable: true,
        layout: {
            type: 'accordion',
            multi: true,
            animate: true
        },
        items: [{
            xtype: 'workflowgrid',
            reference: 'workflowgrid',
            margin: '7 20 7 20',
            padding: '0 0 10 0',
            cls: 'panel-shadow',
            title: 'Workflow',
            titleCollapse: false,
            hideCollapseTool: true,
            frame : true,
            flex: 1,
            tbar: [{
                xtype: 'textfield',
                reference: 'txtJobId',
                width: 300,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Job ID',
                margin: '0 5 0 0'
            },{
                xtype: 'textfield',
                reference: 'txtName',
                width: 400,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Name'
            },'->',
                {
                    xtype: 'button',
                    text: 'Detail',
                    iconCls: 'fi icon-fm-info',
                    handler: 'onBtnDetail'
                }]
        },{
            xtype: 'workflowgriddetail',
            margin: '7 20 20 20',
            padding: '0 0 10 0',
            maxHeight: 400,
            cls: 'panel-shadow',
            frame: true,
            collapsed: true,
            flex: 1,
            reference: 'workflowgriddetail',
            title: 'Actions',
            bind: {
                store: '{workflowActionStore}'
            },
            listeners: {
                itemdblclick: 'onActionRowDblClick'
            }
        }]
    }]
});