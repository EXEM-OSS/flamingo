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
Ext.define('Flamingo.view.workflowdesigner.Designer', {
    extend: 'Ext.panel.Panel',
    xtype: 'designer',

    requires: [
        'Flamingo.view.workflowdesigner.DesignerModel',
        'Flamingo.view.workflowdesigner.canvas.Canvas',
        'Flamingo.view.workflowdesigner.nodeList.NodeTab',
        'Flamingo.view.workflowdesigner.variableGrid.VariableGrid',
        'Flamingo.view.workflowdesigner.workflowTree.WorkflowTree',
        'Flamingo.view.workflowdesigner.workflowFolderTree.FolderTree'
    ],

    viewModel: {
        type: 'designer'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    flex: 1,
    border: false,
    items: [
        {
            region: 'center',
            layout: 'fit',
            height: 160,
            collapseMode: 'mini',
            collapsible: true,
            split: false,
            header: false,
            items: {
                xtype: 'nodeTab'
            }
        },
        {
            region: 'south',
            layout: 'border',
            flex: 1,
            items: [
                {
                    region: 'center',
                    layout: 'fit',
                    items: {
                        border: true,
                        xtype: 'canvas'
                    }
                },
                {
                    title: 'Workflow Variable',
                    region: 'east',
                    layout: 'fit',
                    width: 250,
                    minWidth: 250,
                    maxWidth: 500,
                    collapsible: true,
                    split: true,
                    border: true,
                    collapsed: true,
                    items: {
                        xtype: 'variableGrid'
                    }
                },
                {
                    title: 'Workflow',
                    region: 'west',
                    layout: 'fit',
                    width: 250,
                    minWidth: 200,
                    maxWidth: 300,
                    collapsible: true,
                    collapsed: false,
                    border: true,
                    split: true,
                    items: {
                        xtype: 'workflowTree'
                    }
                }
            ]
        }
    ]
});
