/**
 * Created by seungmin on 2016. 7. 19..
 */

Ext.define('Flamingo.view.oozie.bundle.BundleGridDetail', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundlegriddetail',

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: 'Coord Job ID', dataIndex: 'jobId', minWidth: 300, align: 'center', menuDisabled: true},
        {text: 'Coord Job Name', dataIndex: 'app_name',minWidth: 180, flex: 1, style: 'text-align:center', menuDisabled: true},
        {text: 'Status', dataIndex: 'status', width: 140, style: 'text-align:center', menuDisabled: true},
        {text: 'User', dataIndex: 'user', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: 'Group', dataIndex: 'group', flex: 1, minWidth: 100, align: 'center', menuDisabled: true},
        {text: 'Frequency', dataIndex: 'frequency', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: 'Time Unit', dataIndex: 'time_unit', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: 'Started', dataIndex: 'start_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Ended', dataIndex: 'end_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Next Materiallized', dataIndex: 'next_materiallized_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true}
    ],

    columnLines: true,
    dockedItems: [{
        xtype: 'pagingtoolbar',
        bind: {
            store: '{bundleActionStore}'
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
        itemdblclick: 'onCoordRowDblClick',
        itemclick: 'onCoordRowClick'
    }
});

