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
Ext.define('Flamingo.view.workflowdesigner.property._HiveDelimiterSelCmbField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._hiveDelimiterSelCmbField',

    fieldLabel: 'Delimiter',

    defaults: {
        hideLabel: true
    },
    layout: 'hbox',

    /**
     * 읽기 전용 여부
     */
    readOnly: false,

    initComponent: function () {
        this.items = [
            {
                xtype: 'combo',
                name: 'delimiterType',
                value: ',',
                flex: 1,
                forceSelection: true,
                multiSelect: false,
                editable: false,
                readOnly: this.readOnly,
                displayField: 'name',
                valueField: 'value',
                mode: 'local',
                queryMode: 'local',
                triggerAction: 'all',
                tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value', 'description'],
                    data: [
                        {name: 'Double Colon', value: '::', description: '::'},
                        {name: 'Comma', value: ',', description: ','},
                        {name: 'Pipe', value: '|', description: '|'},
                        {name: 'Tab', value: '\'\\t\'', description: '\'\\t\''},
                        {
                            name: 'Blank',
                            value: '\'\\s\'',
                            description: '\'\\s\''
                        },
                        {
                            name: 'User Defined',
                            value: 'CUSTOM',
                            description: 'User Defined'
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue, eOpts) {
                        // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                        var customValueField = combo.nextSibling('textfield');
                        if (newValue === 'CUSTOM') {
                            customValueField.enable();
                            customValueField.isValid();
                        } else {
                            customValueField.disable();
                            if (newValue) {
                                customValueField.setValue(newValue);
                            } else {
                                customValueField.setValue(',');
                            }
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'delimiterValue',
                itemId: 'delimiterValue',
                vtype: 'exceptcommaspace',
                flex: 1,
                disabled: true,
                readOnly: this.readOnly,
                allowBlank: false,
                value: ','
            }
        ];

        this.callParent(arguments);
    }
});