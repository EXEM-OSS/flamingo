Ext.define('Flamingo.view.oozie.dashboard.monitoring.TimeGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'timegrid',
    
    columnLines: true,
    
    columns: [
        {xtype: 'rownumberer', width: 40, locked: true, lockable: false},
        {text: "Name", minWidth: 150, flex: 2, dataIndex: 'app_name', style: 'text-align:center', locked: true, lockable: false, menuDisabled: true},
        {text: "00", minWidth: 60, flex: 1, dataIndex: 'date0', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "01", minWidth: 60, flex: 1, dataIndex: 'date1', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "02", minWidth: 60, flex: 1, dataIndex: 'date2', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "03", minWidth: 60, flex: 1, dataIndex: 'date3', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "04", minWidth: 60, flex: 1, dataIndex: 'date4', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "05", minWidth: 60, flex: 1, dataIndex: 'date5', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "06", minWidth: 60, flex: 1, dataIndex: 'date6', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "07", minWidth: 60, flex: 1, dataIndex: 'date7', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "08", minWidth: 60, flex: 1, dataIndex: 'date8', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "09", minWidth: 60, flex: 1, dataIndex: 'date9', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "10", minWidth: 60, flex: 1, dataIndex: 'date10', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "11", minWidth: 60, flex: 1, dataIndex: 'date11', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "12", minWidth: 60, flex: 1, dataIndex: 'date12', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "13", minWidth: 60, flex: 1, dataIndex: 'date13', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "14", minWidth: 60, flex: 1, dataIndex: 'date14', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "15", minWidth: 60, flex: 1, dataIndex: 'date15', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "16", minWidth: 60, flex: 1, dataIndex: 'date16', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "17", minWidth: 60, flex: 1, dataIndex: 'date17', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "18", minWidth: 60, flex: 1, dataIndex: 'date18', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "19", minWidth: 60, flex: 1, dataIndex: 'date19', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "20", minWidth: 60, flex: 1, dataIndex: 'date20', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "21", minWidth: 60, flex: 1, dataIndex: 'date21', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "22", minWidth: 60, flex: 1, dataIndex: 'date22', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true},
        {text: "23", minWidth: 60, flex: 1, dataIndex: 'date23', renderer: 'gridRenderer', align: 'center', sortable : false, lockable: false, menuDisabled: true}
    ]
});