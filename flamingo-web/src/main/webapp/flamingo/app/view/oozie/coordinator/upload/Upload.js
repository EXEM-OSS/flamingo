Ext.define('Flamingo.view.oozie.coordinator.upload.Upload', {
    extend: 'Ext.window.Window',
    xtype: 'coordinatorUpload',

    requires: [
        'Flamingo.view.oozie.coordinator.upload.UploadController',
        'Flamingo.view.oozie.coordinator.upload.UploadModel'
    ],

    controller: 'coordinatorUpload',
    viewModel: 'coordinatorUpload',

    title: 'Oozie Coordinator Run',
    bodyPadding: 15,
    modal: true,
    width: 700,
    height: 400,

    tbar: ['->',{
        text: 'HDFS Browser',
        iconCls: 'fi icon-fm-server',
        handler: 'onHdfsBrowserClick'
    },{
        text: 'Run',
        iconCls: 'fi icon-fm-play',
        handler: 'onRunClick'
    }],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'fieldcontainer',
        layout: 'hbox',
        margin: '0 0 10 0 ',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Coordinator XML',
            reference: 'xmlPath',
            flex: 1
        },{
            xtype: 'textfield',
            reference: 'parentPath',
            hidden: true
        },{
            xtype: 'button',
            text: 'Browse',
            handler: 'onBrowseClick',
            margin: '0 0 0 10'
        }]
    },{
        xtype: 'grid',
        title: 'Properties',
        reference: 'propertyGrid',
        flex: 1,
        bind: {
            store: '{properties}'
        },
        tbar: ['->',{
            text: 'Add',
            iconCls: 'fi icon-fm-plus',
            handler: 'onAddClick'
        },{
            text: 'Delete',
            iconCls: 'fi icon-fm-minus',
            handler: 'onDelClick'
        }],
        columns: [{
            text: 'Path',
            dataIndex: 'path',
            flex: 1,
            style: 'text-align: center;',
            menuDisabled: true
        },{
            xtype: 'actioncolumn',
            text: '',
            align: 'center',
            menuDisabled: true,
            width: 50,
            items: [{
                iconCls: 'fi icon-fm-document-search',
                handler: 'onColumBrowseClick'
            }]
        }]
    }]
});