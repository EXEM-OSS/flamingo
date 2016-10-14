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
Ext.define('Flamingo.view.workflowdesigner.property._ColumnGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._columnGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'columnNames'},
            {name: 'columnKorNames'},
            {name: 'columnTypes'},
            {name: 'columnDescriptions'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Column name (English)',
            dataIndex: 'columnNames',
            width: 100,
            sortable: false,
            editor: {
                vtype: 'alphanum',
                allowBlank: false,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 50);
                    }
                }
            }
        },
        {
            text: 'Column name (Korea)',
            dataIndex: 'columnKorNames',
            width: 100,
            sortable: false,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        },
        {
            text: 'Data type',
            dataIndex: 'columnTypes',
            width: 80,
            sortable: false,
            editor: {
                xtype: 'combo',
                allowBlank: false,
                editable: false,
                triggerAction: 'all',
                queryMode: 'local',
                mode: 'local',
                store: [
                    ['String', 'String'],
                    ['Integer', 'Integer'],
                    ['Long', 'Long'],
                    ['Float', 'Float'],
                    ['Double', 'Double'],
                    ['Bytes', 'Bytes'],
                    ['Boolean', 'Boolean'],
                    ['Map', 'Map']
                ],
                listClass: 'x-combo-list-small'
            }
        },
        {
            text: 'Comment',
            dataIndex: 'columnDescriptions',
            width: 150,
            sortable: false,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        }
    ],

    /**
     * 최소 레코드 갯수
     */
    minRecordLength: 1
});