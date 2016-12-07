/**
 * Created by seungmin on 2016. 7. 4..
 */

Ext.define('Flamingo.view.oozie.coordinator.CoordinatorGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'coordinatorgrid',

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: 'Job ID', dataIndex: 'jobId', width: 300, align: 'center', menuDisabled: true},
        {text: 'Name', dataIndex: 'app_name', flex: 2, minWidth: 180, style: 'text-align:center', menuDisabled: true},
        {text: 'Status', dataIndex: 'status', width: 140, style: 'text-align:center', menuDisabled: true},
        {text: 'Group', dataIndex: 'group', flex: 1, minWidth: 80, align: 'center', menuDisabled: true},
        {text: 'Unit', dataIndex: 'unit', flex: 1, minWidth: 120, align: 'center', menuDisabled: true},
        {text: 'Frequency', dataIndex: 'frequency', flex: 1, minWidth: 80, align: 'center', menuDisabled: true},
        {text: 'User', dataIndex: 'user', flex: 1, minWidth: 120, align: 'center', menuDisabled: true},
        {text: 'Started', dataIndex: 'start_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Next Materialization', dataIndex: 'next_materiallized_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true}
    ],
    columnLines: true,
    dockedItems: [{
        xtype: 'pagingtoolbar',
        bind: {
            store: '{coordinatorStore}'
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
        itemclick: 'onCoordinatorRowClick',
        afterrender: 'onAfterrender'
    }
});


