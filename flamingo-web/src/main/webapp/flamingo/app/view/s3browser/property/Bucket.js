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
Ext.define('Flamingo.view.s3browser.property.Bucket', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.s3browser.property.PropertyController'
    ],

    controller: 'propertyViewController',

    height: 240,
    width: 600,
    layout: 'fit',
    modal: true,
    closeAction: 'destroy',
    resizable: false,

    items: [
        {
            xtype: 'form',
            reference: 'objectProperty',
            hidden: false,
            autoScroll: true,
            bodyPadding: 5,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    defaults: {
                        labelAlign: 'right',
                        anchor: '100%',
                        labelWidth: 120
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            name: 'bucketName',
                            value: 'Unknown',
                            dataIndex: 'bucketName',
                            fieldLabel: 'Bucket'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'region',
                            value: 'Unknown',
                            fieldLabel: 'Region'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'creationDate',
                            value: 'Unknown',
                            fieldLabel: 'Creation Date'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'owner',
                            value: 'Unknown',
                            fieldLabel: 'Owner'
                        }
                    ]
                }
            ]
        }
    ],

    listeners: {
        afterrender: 'onAfterRender'
    }
});