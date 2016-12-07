/**
 * Created by seungmin on 2016. 7. 4..
 */

Ext.define('Flamingo.view.oozie.workflow.WorkflowGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'workflowgrid',
    
    requires: [
        'Flamingo.view.oozie.workflow.WorkflowModel',
        'Flamingo.view.oozie.workflow.WorkflowController'
    ],
    bind: {
        store: '{workflowStore}'
    },
    columns: [
        {xtype: 'rownumberer', width: 40},
        {text: 'Job ID', dataIndex: 'jobId', width: 300, align: 'center', menuDisabled: true},
        {text: 'Started', dataIndex: 'start_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Status', dataIndex: 'status', width: 120, style: 'text-align:center', menuDisabled: true},
        {text: 'Name', dataIndex: 'app_name', flex: 2, minWidth: 180, style: 'text-align:center', menuDisabled: true},
        {text: 'Duration', dataIndex: 'duration', flex: 1, minWidth: 70, align: 'center', menuDisabled: true},
        {text: 'User', dataIndex: 'user', flex: 1, minWidth: 70, align: 'center', menuDisabled: true},
        {text: 'Last Modified', dataIndex: 'last_modified_time', flex: 1, minWidth: 135, align: 'center', menuDisabled: true},
        {text: 'Parent Coord', dataIndex: 'parent_id', flex: 2, minWidth: 280, style: 'text-align:center', menuDisabled: true},
        {text: 'App Path', dataIndex: 'app_path', flex: 2, minWidth: 350, style: 'text-align:center', menuDisabled: true},
        {
            width: 50,
            xtype: 'actioncolumn',
            align: 'center',
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-search',
                handler: 'onAppPathClick'
            }]
        }
    ],
    columnLines: true,
    dockedItems: [{
        xtype: 'pagingtoolbar',
        bind: {
            store: '{workflowStore}'
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
        itemdblclick: 'onWorkflowRowdblClick',
        itemclick: 'onWorkflowRowClick',
        afterrender: 'onAfterrender'
    }
});


