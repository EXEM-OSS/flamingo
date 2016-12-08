/**
 * Created by seungmin on 2016. 8. 23..
 */

Ext.define('Flamingo.view.oozie.bundle.BundleWorkflowActionList', {
    extend: 'Ext.grid.Panel',
    xtype: 'bundleworkflowactionlist',

    columns: [
        {xtype: 'rownumberer'},
        {text: "Action ID", width: 340, dataIndex: 'jobId', align: 'center', menuDisabled: true},
        {text: "Name", dataIndex: 'app_name', minWidth: 180, flex: 2, style: 'text-align:center', menuDisabled: true},
        {text: "Type", dataIndex: 'type', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: "Status", dataIndex: 'status', width: 160, style: 'text-align:center', renderer: 'statusRenderer', menuDisabled: true},
        {text: "Transition", dataIndex: 'transition', flex: 1, minWidth: 80, align: 'center', menuDisabled: true},
        {text: "Duration", dataIndex: 'duration', flex: 1, minWidth: 80, align: 'center', menuDisabled: true},
        {text: "Started", dataIndex: 'start_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: "Ended", dataIndex: 'end_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true}
    ],
    columnLines: true,
    listeners: {
        itemdblclick: 'onWorkflowActionListRowDblClick'
    }
});


