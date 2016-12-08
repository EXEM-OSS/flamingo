/**
 * Created by seungmin on 2016. 7. 13..
 */
Ext.define('Flamingo.view.oozie.coordinator.CoordinatorJobLog', {
    extend: 'Ext.panel.Panel',
    xtype: 'coordlog',

    layout: 'fit',
    modal:true,
    resizable: false,
    items: [{
        xtype: 'abstractEditor',
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        reference: 'logEditor',
        parser: 'plain_text',
        forceFit: true,
        theme: 'eclipse',
        printMargin: false,
        readOnly: true
    }],
    tbar: [{
        xtype: 'textfield',
        reference: 'txtLogJobId',
        width: 300,
        labelWidth: 50,
        labelAlign: 'right',
        readOnly: true,
        fieldLabel: 'Job ID',
        margin: '0 5 0 0'
    },{
        xtype: 'textfield',
        reference: 'txtLogJobName',
        width: 400,
        labelWidth: 50,
        labelAlign: 'right',
        readOnly: true,
        fieldLabel: 'Name'
    }]

});