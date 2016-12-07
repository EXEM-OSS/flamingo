/**
 * Created by seungmin on 2016. 7. 4..
 */
Ext.define('Flamingo.view.oozie.workflow.WorkflowGridDetail', {
    extend: 'Ext.grid.Panel',
    xtype: 'workflowgriddetail',

    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: "Action ID", width: 340, dataIndex: 'jobId', align: 'center', menuDisabled: true},
        {text: "Name", dataIndex: 'app_name', minWidth: 180, flex:2, style: 'text-align:center', menuDisabled: true},
        {text: "Type", dataIndex: 'type', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: "Status", dataIndex: 'status', width: 160, style: 'text-align:center', renderer: 'statusRenderer', menuDisabled: true},
        {text: "Transition", dataIndex: 'transition', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: "Duration", dataIndex: 'duration', flex: 1, minWidth: 140, align: 'center', menuDisabled: true},
        {text: "Started", dataIndex: 'start_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: "Ended", dataIndex: 'end_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: "Workflow Name", dataIndex: 'wf_app_name', hidden: true, menuDisabled: true},
        {text: "Workflow Path", dataIndex: 'wf_app_path', hidden: true, menuDisabled: true},
        {text: "Workflow Parent ID", dataIndex: 'wf_parent', hidden: true, menuDisabled: true},
        {text: "Workflow Configuration", dataIndex: 'wf_conf', hidden: true, menuDisabled: true}
    ],
    columnLines: true
});

