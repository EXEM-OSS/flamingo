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
Ext.define('Flamingo.view.workflowdesigner.property._FileSelCmbField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._fileSelCmbField',

    fieldLabel: 'Browse',
    defaults: {
        hideLabel: true
    },
    layout: 'hbox',
    items: [
        {
            xtype: 'combo',
            name: 'selectionType',
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
                    {name: 'As the path', value: 'NO', description: ''},
                    {name: 'Recent File', value: 'RECENT', description: ''},
                    {name: 'String Pattern', value: 'PATTERN', description: ''},
                    {name: 'A few days ago', value: 'DAY', description: ''}
                ]
            }),
            listeners: {
                change: function (combo, newValue, oldValue, eOpts) {
                    // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                    var customValueField = combo.nextSibling('textfield');
                    if (newValue === 'PATTERN' || newValue === 'DAY') {
                        customValueField.enable();
                        customValueField.isValid();
                    } else {
                        customValueField.disable();
                        customValueField.setValue('');
                    }
                }
            }
        },
        {
            xtype: 'textfield',
            name: 'selectionValue',
            flex: 1,
            value: '',
            disabled: true,
            allowBlank: false
        }
    ]
});