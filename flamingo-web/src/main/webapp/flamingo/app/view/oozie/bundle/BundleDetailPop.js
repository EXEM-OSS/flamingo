Ext.define('Flamingo.view.oozie.bundle.BundleDetailPop', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.oozie.bundle.BundleDetailPopController',
        'Flamingo.view.oozie.bundle.BundleJobConf',
        'Flamingo.view.oozie.bundle.BundleJobLog',
        'Flamingo.view.oozie.bundle.BundleJobDefinition',
        'Flamingo.view.editor.AbstractEditor'
    ],

    layout: 'fit',

    modal: true,
    resizable: false,

    controller: 'bundleDetailPopController',

    title: 'Bundle Job',

    items: [{
        xtype: 'tabpanel',
        reference: 'ganttDetail',
        layout: 'fit',
        items: [{
            title: 'Definition',
            xtype: 'bundledefinition',
            reference: 'bundleDefinition'
        },{
            title: 'Configuration',
            xtype: 'bundleconfiguration',
            reference: 'bundleConfiguration'
        },{
            title: 'Log',
            xtype: 'bundlelog',
            reference: 'bundleLog'
        }],
        listeners: {
            tabchange: 'onTabChangePop'
        }
    }],
    listeners: {
        afterrender: 'onAfterrender'
    }
});