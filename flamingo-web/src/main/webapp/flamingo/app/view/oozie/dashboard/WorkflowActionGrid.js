Ext.define('Flamingo.view.oozie.dashboard.WorkflowActionGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'workflowactiongrid',
    
    columnLines: true,

    columns: [
        {xtype: 'rownumberer'},
        {text: "Action ID", width: 300, dataIndex: 'id', menuDisabled: true},
        {text: "Name", dataIndex: 'name', flex: 1, menuDisabled: true},
        {text: "Type", dataIndex: 'type', flex: 1, menuDisabled: true},
        {text: "Status", dataIndex: 'status', flex: 1, renderer: 'converterStatus', menuDisabled: true},
        {text: "Transition", dataIndex: 'transition', flex: 1, menuDisabled: true},
		{text: "Duration", dataIndex: 'duration', flex: 1, menuDisabled: true},
        {text: "StartTime", width: 135, dataIndex: 'start_time', menuDisabled: true},
        {text: "EndTime", width: 135, dataIndex: 'end_time', menuDisabled: true}
    ],
    listeners: {
        itemdblclick: 'onRowDblClick'
    }
});