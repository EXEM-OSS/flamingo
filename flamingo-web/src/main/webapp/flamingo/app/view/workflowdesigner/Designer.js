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

    bodyStyle: {
        background: '#dcdcdc'
    },

    defaults: {
        frame: true
    },

    items: [
        {
            xtype: 'component',
            height: 60,
            style: {
                background: '#FFFFFF'
            },
            html: '<h2 style="padding: 0; margin:22px 0 0 30px;">Workflow Designer</h2>',
            margin: '0 0 20 0'
        },
        {
            xtype: 'nodeTab',
            cls: 'panel-shadow',
            height: 160,
            header: false,
            margin: '0 20 0 20'
        },
        {
            xtype: 'panel',
            cls: 'panel-shadow',
            layout: 'border',
            flex: 1,
            margin: '10 20 0 20',
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
                    xtype: 'variableGrid',
                    title: 'Workflow Variable',
                    region: 'east',
                    width: 250,
                    minWidth: 250,
                    maxWidth: 500,
                    collapsible: true,
                    split: true,
                    border: true,
                    collapsed: true
                },
                {
                    xtype: 'workflowTree',
                    title: 'Workflow',
                    region: 'west',
                    width: 250,
                    minWidth: 200,
                    maxWidth: 300,
                    collapsible: true,
                    collapsed: false,
                    border: true,
                    split: true
                }
            ]
        }
    ]
});
