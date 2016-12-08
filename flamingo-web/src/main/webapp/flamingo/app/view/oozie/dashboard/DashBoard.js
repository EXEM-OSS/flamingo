Ext.define('Flamingo.view.oozie.dashboard.DashBoard', {
    extend: 'Ext.panel.Panel',
    xtype: 'ooziedashboard',
    requires: [
        'Flamingo.model.oozie.dashboard.monitoring.WorkflowModel',
        'Flamingo.model.oozie.dashboard.monitoring.CoordModel',
        'Flamingo.model.oozie.dashboard.monitoring.BundleModel',
        'Flamingo.model.oozie.dashboard.monitoring.GanttModel',
        'Flamingo.model.oozie.dashboard.monitoring.JobCountModel',
        'Flamingo.model.oozie.dashboard.monitoring.Timeline',
        'Flamingo.view.oozie.dashboard.DashBoardController',
        'Flamingo.view.oozie.dashboard.DashBoardModel',
        'Flamingo.view.oozie.dashboard.monitoring.MonitoringGantt',
        'Flamingo.view.oozie.dashboard.monitoring.MonitoringGrid',
        'Flamingo.view.oozie.dashboard.monitoring.TimeGrid',
        'Flamingo.view.oozie.dashboard.monitoring.Timeline',
        'Flamingo.view.oozie.dashboard.count.WorkflowChart',
        'Flamingo.view.oozie.dashboard.count.CoordinatorChart',
        'Flamingo.view.oozie.dashboard.count.BundleChart',
        'Flamingo.view.oozie.dashboard.count.TotalCountChart',
        'Flamingo.view.oozie.dashboard.WorkflowInfo',
        'Flamingo.view.oozie.dashboard.WorkflowActionGrid',
        'Flamingo.view.oozie.dashboard.count.CoordBundleRunningCount',
        'Flamingo.view.oozie.dashboard.count.WorkflowTotalCount',
        'Flamingo.view.editor.AceEditor',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.chart.*'
    ],

    controller: 'dashBoardController',
    viewModel: 'dashBoardModel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyStyle: {
        background: '#dcdcdc'
    },

    itemId: 'oozieDashBoard',

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
            html: '<h2 style="padding: 0; margin:20px 0 0 20px;">Oozie Timeline</h2>'
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
    },{
        cls: 'panel-shadow',
        margin: '20 20 7 20',
        tbar: [{
            xtype: 'button',
            iconCls: 'fa fa-chevron-left',
            handler: 'onPrevDate'
        },{
            xtype: 'datefield',
            reference: 'currentDate',
            editable: false,
            format: 'Y-m-d',
            width: 120,
            value: new Date(),
            listeners: {
                select: 'onFind'
            }
        },{
            xtype: 'button',
            iconCls: 'fa fa-chevron-right',
            handler: 'onNextDate'
        },'->',{
            xtype: 'button',
            iconCls: 'fa fa-refresh',
            text: 'Refresh',
            handler: 'onRefresh'
        }]
    },{
        xtype: 'panel',
        layout: 'fit',
        flex: 4,
        margin: '7 20 7 20',
        frame: true,
        minHeight: 500,
        cls: 'panel-shadow',
        items: [{
            xtype: 'monitoringgantt',
            reference: 'monitoringGantt'
        }]
    },/*{
        xtype: 'monitoringgrid',
        reference: 'realTimeGrid',
        margin: '7 20 7 20',
        minHeight: 250,
        title: 'Running Workflow Job',
        emptyText: '실행 중인 Job 없음',
        bind: {
            store: '{workflowStore}'
        },
        flex: 3,
        listeners: {
            afterrender: 'onAfterrenderGrid',
            itemdblclick: 'onItemDblClick'
        }
    },*/{
        xtype: 'panel',
        reference: 'jobCount',
        margin: '7 20 20 20',
        title: 'Accumulated Statistics Per Day',
        flex: 3,
        frame: true,
        cls: 'panel-shadow',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        minHeight: 350,
        maxHeight: 550,
        items: [{
            xtype: 'panel',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'workflowtotalcount',
                flex: 3
            },{
                xtype: 'coordbundlerunningcount',
                flex: 1
            }]
        },{
            flex: 1,
            xtype: 'workflowchart'
        }]

    }],

    listeners: {
        afterrender: 'onAfterrender'
    }
});