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
Ext.define('Flamingo.view.workflowdesigner.property._HiveTableCreator', {
    extend: 'Ext.panel.Panel',
    alias: 'widget._hiveTableCreator',

    requires: [
        'Flamingo.view.workflowdesigner.property._HiveDelimiterSelCmbField',
        'Flamingo.view.workflowdesigner.property._HiveColumnGrid'
    ],

    layout: 'border',

    border: false,

    initComponent: function () {
        this.items = [
            {
                xtype: 'form',
                region: 'north',
                bodyPadding: 5,
                items: [
                    {
                        xtype: 'fieldcontainer',
                        layout: 'vbox',
                        defaults: {
                            width: 340
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'tableName',
                                itemId: 'tableName',
                                fieldLabel: 'Table Name',
                                allowBlank: false,
                                vtype: 'alphanum',
                                value: ''
                            },
                            {
                                xtype: 'textfield',
                                name: 'comment',
                                itemId: 'comment',
                                fieldLabel: 'Comment'
                            },
                            {
                                itemId: 'delimiter',
                                xtype: '_hiveDelimiterSelCmbField'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            width: 340
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'location',
                                itemId: 'location',
                                fieldLabel: 'Location',
                                vtype: 'alphanum'
                            },
                            {
                                xtype: 'button',
                                text: 'Browse',
                                width: 60,
                                handler: function () {
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Column',
                region: 'center',
                border: false,
                layout: 'fit',
                items: [
                    {
                        itemId: 'columnGrid',
                        xtype: '_hiveColumnGrid'
                    }
                ]
            },
            {
                title: 'Partition',
                region: 'south',
                height: 150,
                border: false,
                layout: 'fit',
                items: [
                    {
                        itemId: 'partitionGrid',
                        xtype: '_hiveColumnGrid'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});