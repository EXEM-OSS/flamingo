/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ext.define('Flamingo.view.workflowdesigner.workflowTree.WorkflowTree', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.workflowTree',

    layout: 'border',

    requires: [
        'Flamingo.view.workflowdesigner.workflowTree.WorkflowTreeController',
        'Flamingo.view.workflowdesigner.workflowTree.WorkflowTreeModel'
    ],

    controller: 'workflowTreeController',

    viewModel: {
        type: 'workflowTreeModel'
    },

    forceFit: true,

    items: [
        {
            itemId: 'workflowTreePanel',
            region: 'center',
            xtype: 'treepanel',
            bind: {
                store: '{workflowTreeStore}'
            },
            reference: 'treepanel',
            useArrows: true,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            iconCls: 'common-expand',
                            text: 'Elapse all',
                            tooltip: 'Elapse the tree.',
                            handler: 'onWorkflowTreeExpand'
                        },
                        {
                            iconCls: 'common-collapse',
                            text: 'Collapse all',
                            tooltip: 'Collapse the tree.',
                            handler: 'onWorkflowTreeCollapse'
                        },
                        '->',
                        {
                            itemId: 'refreshButton',
                            text: 'Refresh',
                            tooltip: 'Refresh the tree.',
                            iconCls: 'common-refresh',
                            reference: 'refreshButton',
                            handler: 'onWorkflowTreeRefresh'
                        }
                    ]
                }
            ],
            listeners: {
                load: 'onWorkflowTreeLoad',
                render: 'onWorkflowTreeRender',
                itemappend: 'onWorkflowTreeItemappend',
                itemdblclick: 'onWorkflowTreeItemdblclick',
                itemcontextmenu: 'onWorkflowTreeItemcontextmenu'
            }
        }
    ]
});