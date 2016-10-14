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
Ext.define('Flamingo.view.workflowdesigner.workflowFolderTree.FolderTree', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.folderTree',

    layout: 'border',

    requires: [
        'Flamingo.view.workflowdesigner.workflowFolderTree.FolderTreeController',
        'Flamingo.view.workflowdesigner.workflowFolderTree.FolderTreeModel'
    ],

    controller: 'folderTreeController',

    viewModel: {
        type: 'folderTreeModel'
    },

    forceFit: true,

    items: [
        {
            itemId: 'folderTreeTreePanel',
            region: 'center',
            xtype: 'treepanel',
            reference: 'folderTreeTreePanel',
            rootVisible: true,
            useArrows: true,
            bind: {
                store: '{folderTree}'
            },
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop',
                    enableDrop: true,
                    enableDrag: true,
                    allowContainerDrop: true
                }
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            iconCls: 'common-expand',
                            text: 'Elapse all',
                            tooltip: 'Elapse the tree.',
                            handler: 'onTreeExpand'
                        },
                        {
                            iconCls: 'common-collapse',
                            text: 'Collapse all',
                            tooltip: 'Collapse the tree.',
                            handler: 'onTreeCollapse'
                        },
                        '->',
                        {
                            tooltip: 'Refresh the tree.',
                            text: 'Refresh',
                            iconCls: 'common-refresh',
                            handler: 'onTreeRefresh'
                        }
                    ]
                }
            ],
            listeners: {
                render: 'onTreeRender'
            }
        }
    ]
});