Ext.define('Flamingo.view.oozie.coordinator.CoordinatorDetailPop', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.oozie.coordinator.CoordinatorDetailPopController',
        'Flamingo.view.oozie.coordinator.CoordinatorJobConf',
        'Flamingo.view.oozie.coordinator.CoordinatorJobLog',
        'Flamingo.view.oozie.coordinator.CoordinatorJobDefinition',
        'Flamingo.view.editor.AbstractEditor'
    ],

    layout: 'fit',

    modal: true,
    resizable: false,

    controller: 'coordDetailPopController',

    title: 'Coordinator Job',

    items: [{
        xtype: 'tabpanel',
        reference: 'ganttDetail',
        layout: 'fit',
        items: [{
            title: 'Definition',
            xtype: 'coorddefinition',
            reference: 'coordDefinition'
        },{
            title: 'Configuration',
            xtype: 'coordconfiguration',
            reference: 'coordConfiguration'
        },{
            title: 'Log',
            xtype: 'coordlog',
            reference: 'coordLog'
        }],
        listeners: {
            tabchange: 'onTabChangePop'
        }
    }],
    listeners: {
        afterrender: 'onAfterrender'
    }
});