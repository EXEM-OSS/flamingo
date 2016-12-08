/**
 * Created by seungmin on 2016. 8. 22..
 */


Ext.define('Flamingo.view.oozie.bundle.BundleCoordActionList', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundlecoordactionlist',
    columnLines: true,

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: 'Action ID', dataIndex: 'jobId', width: 340, align: 'center', menuDisabled: true},
        {text: 'Status', dataIndex: 'status', width: 140, style: 'text-align:center', menuDisabled: true},
        {text: 'External ID', dataIndex: 'external_id', minWidth: 300, align: 'center', menuDisabled: true},
        {text: 'Created Time', dataIndex: 'created_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Nominal Time', dataIndex: 'nominal_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Last Modified Time', dataIndex: 'last_modified_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Error Code', dataIndex: 'error_code', flex: 3, minWidth: 140, align: 'center', menuDisabled: true}
    ],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        bind: {
            store: '{bundleCoordActionList}'
        },
        dock: 'bottom',
        layout: {
            pack:'center'
        },
        displayInfo: true,
        listeners:{
            afterRender:function(){
                this.down('#refresh').hide();
                this.down('#displayItem').prev().destroy();
            }
        }
    }],
    listeners: {
        itemdblclick: 'onCoordActionListRowDblClick',
        itemclick: 'onCoordActionListRowClick'
    }
});



