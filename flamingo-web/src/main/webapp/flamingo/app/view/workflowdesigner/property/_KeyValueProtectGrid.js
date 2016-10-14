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
Ext.define('Flamingo.view.workflowdesigner.property._KeyValueProtectGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._keyValueProtectGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'keys'},
            {name: 'values'},
            {name: 'protected'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Key',
            dataIndex: 'keys',
            flex: 1,
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
            dataIndex: 'values',
            flex: 1,
            editor: {
                allowBlank: true,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 30);
                    }
                }
            }
        },
        {
            xtype: 'checkcolumn',
            text: 'Fix Value',
            dataIndex: 'protected',
            width: 50,
            editor: {}
        }
    ]
});