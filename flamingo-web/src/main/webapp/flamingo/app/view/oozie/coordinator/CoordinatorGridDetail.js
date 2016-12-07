/**
 * Created by seungmin on 2016. 7. 11..
 */

Ext.define('Flamingo.view.oozie.coordinator.CoordinatorGridDetail', {
    extend: 'Ext.grid.Panel',
    xtype: 'coordinatorgriddetail',
    columnLines: true,

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: 'Action ID', dataIndex: 'jobId', width: 350, align: 'center', menuDisabled: true},
        {text: 'Status', dataIndex: 'status', width: 140, style: 'text-align:center', menuDisabled: true},
        {text: 'External ID', dataIndex: 'external_id', minWidth: 300, align: 'center', menuDisabled: true},
        {text: 'Created Time', dataIndex: 'created_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Nominal Time', dataIndex: 'nominal_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Last Modified Time', dataIndex: 'last_modified_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Error Code', dataIndex: 'error_code', flex: 3, minWidth: 140, align: 'center', menuDisabled: true},
        {text: 'Coord Job Name', dataIndex: 'coordJobName', hidden: true, menuDisabled: true}
    ],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        bind: {
            store: '{coordinatorActionStore}'
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



