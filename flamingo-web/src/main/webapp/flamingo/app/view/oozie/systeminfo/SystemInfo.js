Ext.define('Flamingo.view.oozie.systeminfo.SystemInfo', {
    extend: 'Ext.panel.Panel',
    xtype: 'ooziesysteminfo',
    requires: [
        'Flamingo.view.oozie.systeminfo.SystemInfoController',
        'Flamingo.view.oozie.systeminfo.SystemInfoModel',
        'Flamingo.view.oozie.systeminfo.RowExpanderGrid'
    ],

    controller: 'systeminfoController',
    viewModel: 'systeminfoModel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    bodyStyle: {
        background: '#dcdcdc'
    },

    items: [{
        xtype: 'component',
        height: 60,
        style: {
            background: '#FFFFFF'
        },
        html: '<h2 style="padding: 0; margin:20px 0 0 20px;">Oozie System Information</h2>'
    },{
        xtype: 'tabpanel',
        layout: 'fit',
        frame: true,
        margin: 20,
        padding: '0 0 10 0',
        cls: 'panel-shadow',
        flex: 1,
        items: [{
            title: 'Configuration',
            xtype: 'rowexpandergrid',
            reference: 'configuration',
            bind: {
                store: '{confStore}'
            }
        },{
            title: 'Java System Properties',
            xtype: 'rowexpandergrid',
            reference: 'javaSystemProps',
            bind: {
                store: '{propsStore}'
            }
        },{
            title: 'OS Environment',
            xtype: 'rowexpandergrid',
            reference: 'osEnv',
            bind: {
                store: '{envStore}'
            }
        }],
        tbar: ['->',{
            xtype: 'button',
            text: 'Download',
            iconCls: 'fi icon-fm-download',
            handler: 'onBtnDownload'
        },{
            xtype: 'button',
            iconCls: 'fi icon-fm-refresh',
            text: 'Refresh',
            handler: 'onBtnRefresh'
        }]
    }]
});