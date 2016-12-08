/**
 * Created by seungmin on 2016. 7. 19..
 */

Ext.define('Flamingo.view.oozie.bundle.BundleJobDefinition', {
    extend: 'Ext.panel.Panel',
    xtype: 'bundledefinition',

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
        parser: 'xml',
        forceFit: true,
        reference: 'definitionEditor',
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
        text: 'Edit',
        iconCls: 'fi icon-fm-document-edit',
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