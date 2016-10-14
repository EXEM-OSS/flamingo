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
Ext.define('Flamingo.view.workflowdesigner.property._HiveColumnGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._hiveColumnGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'name'},
            {name: 'type'},
            {name: 'collection'},
            {name: 'comment'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Name',
            dataIndex: 'name',
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
            text: 'Data type',
            dataIndex: 'type',
            width: 80,
            sortable: false,
            editor: {
                xtype: 'combo',
                allowBlank: false,
                editable: false,
                triggerAction: 'all',
                queryMode: 'local',
                mode: 'local',
                store: new Ext.data.ArrayStore(
                    {
                        id: 0,
                        fields: ['typeId', 'typeString'],
                        data: [
                            ['tinyint', 'tinyint'],
                            ['smallint', 'smallint'],
                            ['int', 'int'],
                            ['bigint', 'bigint'],
                            ['boolean', 'boolean'],
                            ['float', 'float'],
                            ['double', 'double'],
                            ['string', 'string'],
                            ['timestamp', 'timestamp'],
                            ['binary', 'binary'],
                            ['struct', 'struct'],
                            ['map', 'map'],
                            ['array', 'array']
                        ]
                    }
                ),
                valueField: 'typeString',
                displayField: 'typeString',
                listClass: 'x-combo-list-small'
            }
        },
        {
            xtype: 'actioncolumn',
            itemId: 'collection',
            width: 20,
            items: [
                {
                    getClass: function (v, meta, record) {
                        var type = record.get('type');

                        if (type == 'struct' || type == 'map' || type == 'array') {
                            return 'common-find';
                        }
                    }
                }
            ]
        },
        {
            text: 'Comment',
            dataIndex: 'comment',
            width: 150,
            sortable: false,
            editor: {
                allowBlank: true
            }
        }
    ],

    /**
     * Minimum Record
     */
    minRecordLength: 1
});