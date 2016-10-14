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
/**
 * Inner Grid : InputPath Grid
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property._Grid
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property._InputGrid', {
    extend: 'Flamingo.view.workflowdesigner.property._Grid',
    alias: 'widget._inputGrid',

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'input'}
        ]
    }),

    minRecordLength: 0,
    selType: 'rowmodel',
    forceFit: true,
    columnLines: true,
    fileBrowser: true,
    columns: [
        {
            text: 'Path',
            dataIndex: 'input',
            editor: {
                allowBlank: false,
                listeners: {
                    errorchange: function (comp, error, eopts) {
                        comp.focus(false, 50);
                    }
                }
            }
        }
    ]
});