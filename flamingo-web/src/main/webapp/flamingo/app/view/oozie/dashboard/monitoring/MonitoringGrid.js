Ext.define('Flamingo.view.oozie.dashboard.monitoring.MonitoringGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'monitoringgrid',


    viewModel: 'dashBoardModel',
    
    columnLines: true,
    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: "Job ID", minWidth: 300, flex: 2, dataIndex: 'id', style: 'text-align:center', menuDisabled: true},
        {text: "Name", minWidth: 150, flex: 1, dataIndex: 'app_name', style: 'text-align:center', menuDisabled: true},
        {text: "Status", width: 150, dataIndex: 'status', style: 'text-align:center', menuDisabled: true},
        {text: "Run", width: 50, dataIndex: 'run', align: 'center', menuDisabled: true},
        {text: "User", width: 100, dataIndex: 'user_name', align: 'center', menuDisabled: true},
        {text: "Duration", width: 80, dataIndex: 'duration', align: 'center', menuDisabled: true},
        {text: "Group", width: 80, dataIndex: 'group_name', hidden: true, menuDisabled: true},
        {text: "Created", width: 135, dataIndex: 'created_time', align: 'center', menuDisabled: true},
        {text: "Started", width: 135, dataIndex: 'start_time', align: 'center', menuDisabled: true},
        {text: "Last Modified", width: 135, dataIndex: 'last_modified_time', align: 'center', menuDisabled: true},
        {text: "Parent ID", width: 320, dataIndex: 'parent_id', style: 'text-align:center', menuDisabled: true},
        {text: "Ended", flex: 1, dataIndex: 'end_time', align: 'center', hidden: true, menuDisabled: true},
        {text: "App Path", dataIndex: 'app_path', hidden: true, menuDisabled: true},
        {text: "Definition", dataIndex: 'definition', hidden: true, menuDisabled: true},
        {text: "Configuration", dataIndex: 'configuration', hidden: true, menuDisabled: true},
        {text: "Log", dataIndex: 'log', hidden: true, menuDisabled: true}
    ],
    listeners: {
        afterrender: 'onAfterrenderGrid',
        itemdblclick: 'onItemDblClick'
    }
});