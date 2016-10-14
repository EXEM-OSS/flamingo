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
 * Apache Hive Property View
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property._NODE_HADOOP
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property.INHERIT', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.INHERIT',

    requires: [
        'Flamingo.view.workflowdesigner.property._ConfigurationBrowserField',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._ColumnGrid_Prev',
        'Flamingo.view.workflowdesigner.property._ColumnGrid',
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid',
        'Flamingo.view.workflowdesigner.property._HiveBrowser'
    ],

    width: 600,
    height: 400,

    items: [
        {
            title: 'Input Form',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Value',
                            flex: 1,
                            name: 'value'
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'Inherit',
                            labelWidth: 30,
                            name: 'value_INHERIT'
                        }
                    ]
                }
            ]
        }
    ]
});