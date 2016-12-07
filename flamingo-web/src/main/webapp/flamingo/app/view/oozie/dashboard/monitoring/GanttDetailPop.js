Ext.define('Flamingo.view.oozie.dashboard.monitoring.GanttDetailPop', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.oozie.dashboard.DashBoardController',
        'Flamingo.view.oozie.dashboard.DashBoardModel',
        'Flamingo.view.oozie.dashboard.monitoring.TimeGridDetail'
    ],

    width: 800,
    height: 500,
    layout: 'fit',

    modal: true,
    resizable: false,

    controller: 'dashBoardController',
    viewModel: 'dashBoardModel',

    items: [{
        xtype: 'tabpanel',
        reference: 'ganttDetail',
        layout: 'fit',
        items: [{
            title: 'Succeeded',
            xtype: 'timegriddetail',
            reference: 'ganttSuccessGrid'
        },{
            title: 'Failed / Killed',
            xtype: 'timegriddetail',
            reference: 'ganttFailGrid'
        }],
        listeners: {
            tabchange: 'onTabChangePop'
        }
    }],
    listeners: {
        afterrender: 'onGanttDetailAfterrender'
    }
});