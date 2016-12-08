Ext.define('Flamingo.view.oozie.coordinator.Coordinator', {
    extend: 'Ext.panel.Panel',
    xtype: 'ooziecoordinator',
    requires: [
        'Flamingo.view.oozie.coordinator.CoordinatorController',
        'Flamingo.view.oozie.coordinator.CoordinatorModel',
        'Flamingo.view.oozie.coordinator.CoordinatorGrid',
        'Flamingo.view.oozie.coordinator.CoordinatorGridDetail',
        'Flamingo.view.oozie.coordinator.CoordinatorJobConf',
        'Flamingo.view.oozie.coordinator.CoordinatorJobDefinition',
        'Flamingo.view.oozie.coordinator.CoordinatorJobLog'
    ],

    controller: 'coordinatorController',
    viewModel: 'coordinatorModel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyStyle: {
        background: '#dcdcdc'
    },

    scrollable: true,

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
            html: '<h2 style="padding: 0; margin:20px 0 0 20px;">Oozie Coordinator</h2>'
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
        reference: 'coordForm',
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

                },{
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
                },{
                    xtype: 'textfield',
                    reference: 'txtFind',
                    width: 250,
                    name: 'txtFind',
                    margin: '0 5 0 0',
                    enableKeyEvents: true,
                    listeners: {
                        keydown: 'onKeyDown'
                    }
                },{
                    xtype: 'button',
                    text: 'Find',
                    iconCls: 'fi icon-fm-search',
                    handler: 'onFindClick'
                }]
            },{
                xtype: 'button',
                text: 'Action',
                menu: [{
                    text: 'Upload',
                    iconCls: 'fi icon-fm-upload',
                    handler: 'onUploadClick'
                },{
                    text: 'Resume',
                    iconCls: 'fi icon-fm-play',
                    handler: 'onJobResumeBtnClick'
                },{
                    text: 'Suspend',
                    iconCls: 'fi icon-fm-pause',
                    handler: 'onJobSuspendBtnClick'
                },{
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
            xtype: 'coordinatorgrid',
            reference: 'coordinatorgrid',
            margin: '7 20 7 20',
            title: 'Coordinator',
            titleCollapse: false,
            hideCollapseTool: true,
            padding: '0 0 10 0',
            minHeight: 250,
            cls: 'panel-shadow',
            frame: true,
            flex: 1,
            bind: {
                store: '{coordinatorStore}'
            },
            tbar: [{
                xtype: 'textfield',
                reference: 'txtCoordJobId',
                width: 300,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Job ID',
                margin: '0 5 0 0'
            }, {
                xtype: 'textfield',
                reference: 'txtCoordName',
                width: 400,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Name'
            },
                '->',
                {
                    xtype: 'button',
                    iconCls: 'fi icon-fm-info',
                    text: 'Detail',
                    handler: 'onBtnCoordDetail'
                }]
        },{
            xtype: 'coordinatorgriddetail',
            reference: 'coordinatorgriddetail',
            margin: '7 20 7 20',
            padding: '0 0 10 0',
            minHeight: 280,
            cls: 'panel-shadow',
            collapsed: true,
            frame: true,
            flex: 1,
            title: 'Coordinator Actions',
            bind: {
                store: '{coordinatorActionStore}'
            },
            tbar: [{
                xtype: 'textfield',
                reference: 'txtCoordActionId',
                width: 350,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Action ID',
                margin: '0 5 0 0'
            },{
                xtype: 'textfield',
                reference: 'txtExternalId',
                width: 350,
                labelWidth: 80,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'External ID'
            },
                '->',
                {
                    xtype: 'button',
                    iconCls: 'fi icon-fm-info',
                    text: 'Detail',
                    handler: 'onBtnWfDetail'
                }]
        },{
            xtype: 'coordinatorworkflowactionlist',
            margin: '7 20 20 20',
            padding: '0 0 10 0',
            minHeight: 200,
            maxHeight: 400,
            collapsed: true,
            cls: 'panel-shadow',
            frame: true,
            flex: 1,
            reference: 'coordinatorworkflowactionlist',
            title: 'Workflow Actions',
            bind: {
                store: '{coordWorkflowActionList}'
            }
        }]
    }]
});