/**
 * Created by seungmin on 2016. 7. 13..
 */

Ext.define('Flamingo.view.oozie.coordinator.CoordinatorJobDefinition', {
    extend: 'Ext.panel.Panel',
    xtype: 'coorddefinition',

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
        reference: 'definitionEditor',
        parser: 'xml',
        forceFit: true,
        theme: 'eclipse',
        printMargin: false,
        readOnly: true
    }],
    tbar: [{
        xtype: 'textfield',
        reference: 'txtDefinitionJobId',
        width: 300,
        labelWidth: 50,
        labelAlign: 'right',
        readOnly: true,
        fieldLabel: 'Job ID',
        margin: '0 5 0 0'
    },{
        xtype: 'textfield',
        reference: 'txtDefinitionJobName',
        width: 400,
        labelWidth: 50,
        labelAlign: 'right',
        readOnly: true,
        fieldLabel: 'Name'
    },'->',{
        xtype: 'button',
        reference: 'updateBtn',
        iconCls: 'fi icon-fm-document-edit',
        text: 'Edit',
        handler: 'onEditorUpdate',
        margin: '0 10 0 0'
    },{
        xtype: 'button',
        reference: 'cancelBtn',
        text: 'Cancel',
        handler: 'onEditorCancel',
        iconCls: 'fi icon-fm-x',
        margin: '0 10 0 0',
        hidden: true
    }]

});