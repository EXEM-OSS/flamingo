Ext.define('Flamingo.view.oozie.bundle.Bundle', {
    extend: 'Ext.panel.Panel',
    xtype: 'ooziebundle',
    requires: [
        'Flamingo.view.oozie.bundle.BundleController',
        'Flamingo.view.oozie.bundle.BundleModel',
        'Flamingo.view.oozie.bundle.BundleGrid',
        'Flamingo.view.oozie.bundle.BundleGridDetail',
        'Flamingo.view.oozie.bundle.BundleCoordActionList',
        'Flamingo.view.oozie.bundle.BundleJobConf',
        'Flamingo.view.oozie.bundle.BundleJobDefinition',
        'Flamingo.view.oozie.bundle.BundleJobLog'
    ],

    controller: 'bundleController',
    viewModel: 'bundleModel',

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
            html: '<h2 style="padding: 0; margin:20px 0 0 20px;">Oozie Bundle</h2>'
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
        reference: 'bundleForm',
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
                border: false,
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
            xtype: 'bundlegrid',
            reference: 'bundlegrid',
            margin: '7 20 7 20',
            padding: '0 0 10 0',
            minHeight: 250,
            title: 'Bundle',
            titleCollapse: false,
            hideCollapseTool: true,
            cls: 'panel-shadow',
            frame: true,
            flex: 1,
            bind: {
                store: '{bundleStore}'
            },
            tbar: [{
                xtype: 'textfield',
                reference: 'txtBundleJobId',
                width: 300,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Job ID',
                margin: '0 5 0 0'
            },{
                xtype: 'textfield',
                reference: 'txtBundleName',
                width: 400,
                labelWidth: 50,
                labelAlign: 'right',
                readOnly: true,
                fieldLabel: 'Name'
            },
                '->',
                {
                    xtype: 'button',
                    text: 'Detail',
                    iconCls: 'fi icon-fm-info',
                    handler: 'onBtnBundleDetail'
                }]
        },{
            xtype: 'bundlegriddetail',
            reference: 'bundlegriddetail',
            margin: '7 20 7 20',
            padding: '0 0 10 0',
            minHeight: 280,
            flex: 1,
            collapsed: true,
            cls: 'panel-shadow',
            frame: true,
            title: 'Coordinator Jobs',
            bind: {
                store: '{bundleActionStore}'
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
            },{
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
                    text: 'Detail',
                    iconCls: 'fi icon-fm-info',
                    handler: 'onBtnCoordDetail'
                }]
        },{
            xtype: 'bundlecoordactionlist',
            reference: 'bundlecoordactionlist',
            margin: '7 20 7 20',
            minHeight: 280,
            padding: '0 0 10 0',
            collapsed: true,
            cls: 'panel-shadow',
            frame: true,
            title: 'Coordinator Actions',
            flex: 1,
            bind: {
                store: '{bundleCoordActionList}'
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
                    text: 'Detail',
                    iconCls: 'fi icon-fm-info',
                    handler: 'onBtnWfDetail'
                }]
        },{
            xtype: 'bundleworkflowactionlist',
            margin: '7 20 20 20',
            padding: '0 0 10 0',
            maxHeight: 400,
            minHeight: 200,
            collapsed: true,
            cls: 'panel-shadow',
            frame: true,
            reference: 'bundleworkflowactionlist',
            title: 'Workflow Actions',
            bind: {
                store: '{bundleWorkflowActionList}'
            }
        }]
    }]
});
