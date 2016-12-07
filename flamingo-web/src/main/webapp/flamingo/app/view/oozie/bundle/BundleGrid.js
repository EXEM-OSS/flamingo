/**
 * Created by seungmin on 2016. 8. 16..
 */

Ext.define('Flamingo.view.oozie.bundle.BundleGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundlegrid',

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: 'Job ID', dataIndex: 'jobId', minWidth: 300, align: 'center', menuDisabled: true},
        {text: 'Name', dataIndex: 'app_name', minWidth: 180, flex: 2, style: 'text-align:center', menuDisabled: true},
        {text: 'Status', dataIndex: 'status', width: 160, style: 'text-align:center', menuDisabled: true},
        {text: 'User', dataIndex: 'user_name', flex: 1, minWidth: 160, align: 'center', menuDisabled: true},
        {text: 'Group', dataIndex: 'group_name', flex: 1, minWidth: 120, align: 'center', menuDisabled: true},
        {text: 'Kickoff Time', dataIndex: 'kickoff_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Created Time', dataIndex: 'created_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true}
    ],
    columnLines: true,
    dockedItems: [{
        xtype: 'pagingtoolbar',
        bind: {
            store: '{bundleStore}'
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
        itemdblclick: 'onRowDblClick',
        itemclick: 'onRowClick',
        afterrender: 'onAfterrender'
    }
});


