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
Ext.define('Flamingo.view.workflowdesigner.variableGrid.VariableGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.variableGrid',

    requires: [
        'Flamingo.view.workflowdesigner.variableGrid.VariableGridController',
        'Flamingo.view.workflowdesigner.variableGrid.VariableGridModel',

        'Ext.grid.plugin.RowEditing'
    ],

    controller: 'variableGridController',

    viewModel: {
        type: 'variableGridModel'
    },

    bind: {
        store: '{variable}'
    },

    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Key',
            dataIndex: 'name',
            editor: {
                vtype: 'alphanum',
                allowBlank: true,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 50);
                    }
                }
            }
        },
        {
            text: 'Value',
            dataIndex: 'value',
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 50);
                    }
                }
            }
        }
    ],
    plugins: [
        Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2,
            pluginId: 'rowEditorPlugin',
            listeners: {
                canceledit: function (editor, e, eOpts) {
                    // Cancel Edit 시 유효하지 않으면 추가된 레코드를 삭제한다.
                    if (e.store.getAt(e.rowIdx)) {
                        if (!e.store.getAt(e.rowIdx).isValid()) {
                            e.store.removeAt(e.rowIdx);
                        }
                    }
                },
                edit: function (editor, e, eOpts) {
                    if (!e.store.getAt(e.rowIdx).isValid()) {
                        editor.startEdit(e.rowIdx, 0);
                    }
                }
            }
        })
    ],
    tools: [
        {
            type: 'plus',
            tooltip: 'Add',
            handler: 'rowplus'
        },
        {
            type: 'minus',
            tooltip: 'Remove',
            handler: 'rowminus'
        },
        {
            type: 'close',
            tooltip: 'Remove All',
            handler: 'rowclose'
        }
    ]
});

