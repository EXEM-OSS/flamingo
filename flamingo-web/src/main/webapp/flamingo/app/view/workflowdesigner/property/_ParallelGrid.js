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
Ext.define('Flamingo.view.workflowdesigner.property._ParallelGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget._parallelGrid',

    requires: [
        'Flamingo.view.workflowdesigner.property._ParallelGridController'
    ],

    controller: 'designer._parallelGridController',

    stripeRows: true,

    margins: '0 0 0 0',

    selectableShapes: [],

    shapeElement: null,

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'node'},
            {name: 'id'},
            {name: 'sequence'},
            {name: 'parallel'}
        ],
        data: []
    }),

    columns: [
        {
            text: 'Node',
            flex: 1,
            sortable: true,
            dataIndex: 'node',
            align: 'center'
        },
        {
            text: 'Node ID',
            flex: 1,
            sortable: true,
            dataIndex: 'id',
            align: 'center'
        },
        {
            text: "Provider",
            hidden: true,
            flex: 1,
            sortable: true,
            dataIndex: 'provider',
            align: 'center'
        },
        {
            text: 'Flow',
            flex: 1,
            sortable: true,
            dataIndex: 'sequence',
            align: 'center',
            field: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0,
                maxValue: 100000
            }
        },
        {
            text: 'Proceeding',
            flex: 1,
            sortable: true,
            dataIndex: 'parallel',
            align: 'center',
            renderer: function (value) {
                if (value) {
                    return 'Simultaneous';
                }
                return 'Sequential';
            }
        }
    ],
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    reference: 'flowUp',
                    text: 'Post flow',
                    disabled: true,
                    listeners: {
                        click: 'onFlowUpClick'
                    }
                },
                {
                    reference: 'flowDown',
                    text: 'Lower flow',
                    disabled: true,
                    listeners: {
                        click: 'onFlowDownClick'
                    }
                }
            ]
        }
    ],

    tipUse: 'on',

    listeners: {
        drawGrid: 'drawGrid',
        edit: 'onCellEdit',
        select: 'onItemSelect',
        formfieldForSave: 'formfieldForSave'
    }
});