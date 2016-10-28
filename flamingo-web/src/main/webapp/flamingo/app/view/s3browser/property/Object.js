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
Ext.define('Flamingo.view.s3browser.property.Object', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.s3browser.property.PropertyController'
    ],

    controller: 'propertyViewController',

    height: 480,
    width: 640,
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
                            name: 'contentType',
                            value: 'Unknown',
                            fieldLabel: 'Content-Type'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'name',
                            value: 'Unknown',
                            fieldLabel: 'Name'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'uri',
                            value: 'Unknown',
                            fieldLabel: 'Link'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'size',
                            value: 'Unknown',
                            fieldLabel: 'Size'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'lastModified',
                            value: 'Unknown',
                            fieldLabel: 'Last Modified'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'owner',
                            value: 'Unknown',
                            fieldLabel: 'Owner'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'eTag',
                            value: 'Unknown',
                            fieldLabel: 'ETag'

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