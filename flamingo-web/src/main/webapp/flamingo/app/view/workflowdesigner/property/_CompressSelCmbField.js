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
 * Inner FieldContainer : CompressSelCmbField
 *
 * @class
 * @extends Ext.form.FieldContainer
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property._CompressSelCmbField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._compressSelCmbField',

    fieldLabel: 'Compression Method',

    defaults: {
        hideLabel: true
    },
    layout: 'hbox',
    items: [
        {
            xtype: 'combo',
            name: 'compressionType',
            value: 'NO',
            flex: 1,
            forceSelection: true,
            editable: false,
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            queryMode: 'local',
            disabled: true,
            triggerAction: 'all',
            tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value', 'description'],
                data: [
                    {
                        name: 'Not Compressed',
                        value: 'NO',
                        description: 'Not Compressed'
                    },
                    {
                        name: 'Snappy',
                        value: 'SNAPPY',
                        description: 'Snappy compression'
                    },
                    {
                        name: 'LZO',
                        value: 'LZO',
                        description: 'LZO compression'
                    },
                    {
                        name: 'BZIP',
                        value: 'BZIP',
                        description: 'BZIP compression'
                    }
                ]
            })
        },
        {
            xtype: 'checkboxfield',
            name: 'isGetMerge',
            boxLabel: 'Get Merge',
            flex: 1
        }
    ]
});