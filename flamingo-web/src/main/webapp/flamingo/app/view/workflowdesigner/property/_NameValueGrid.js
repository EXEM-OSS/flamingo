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
Ext.define('Flamingo.view.workflowdesigner.property._NameValueGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._nameValueGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'variableNames'},
            {name: 'variableValues'},
            {name: 'variableDescriptions'}
        ],
        data: []
    }),
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    columns: [
        {
            text: 'Key',
            dataIndex: 'variableNames',
            width: 100,
            editor: {
                allowBlank: true,
                vtype: 'alphanum',
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 50);
                    }
                }
            }
        },
        {
            text: 'Value',
            dataIndex: 'variableValues',
            width: 100,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 30);
                    }
                }
            }
        },
        {
            text: 'Description',
            dataIndex: 'variableDescriptions',
            width: 200,
            editor: {
                vtype: 'exceptcomma',
                allowBlank: true
            }
        }
    ]
});