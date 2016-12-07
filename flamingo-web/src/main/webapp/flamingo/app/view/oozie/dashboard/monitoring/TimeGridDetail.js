Ext.define('Flamingo.view.oozie.dashboard.monitoring.TimeGridDetail', {
    extend: 'Ext.grid.Panel',
    xtype: 'timegriddetail',

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: "Job ID", width: 300, dataIndex: 'id', align: 'center', menuDisabled: true},
        {text: "Name", flex: 2, minWidth: 150, dataIndex: 'app_name', style: 'text-align:center', menuDisabled: true},
        {text: "Status", flex: 1, minWidth: 100, dataIndex: 'status', style: 'text-align:center', renderer: 'statusRenderer', menuDisabled: true},
        {text: "Run", flex: 1, minWidth: 50, dataIndex: 'run', align: 'center', menuDisabled: true},
        {text: "User", flex: 1, minWidth: 80, dataIndex: 'user_name', align: 'center', menuDisabled: true},
        {text: "Duration", flex: 1, minWidth: 80, dataIndex: 'duration', align: 'center', menuDisabled: true},
        {text: "Group", flex: 1, minWidth: 80, dataIndex: 'group_name', hidden: true, menuDisabled: true},
        {text: "Created", flex: 1, minWidth: 140, dataIndex: 'created_time', align: 'center', menuDisabled: true},
        {text: "Started", flex: 1, minWidth: 140, dataIndex: 'start_time', align: 'center', menuDisabled: true},
        {text: "Last Modified", flex: 1, minWidth: 140, dataIndex: 'last_modified_time', align: 'center', menuDisabled: true},
        {text: "Ended", flex: 1, minWidth: 140, dataIndex: 'end_time', align: 'center', menuDisabled: true}
    ],
    columnLines: true
});