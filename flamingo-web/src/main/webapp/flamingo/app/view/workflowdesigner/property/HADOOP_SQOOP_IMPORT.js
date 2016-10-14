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
 * Sqoop Import View
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property.HADOOP_SQOOP_IMPORT
 * @author <a href="mailto:chiwanpark@icloud.com">Chiwan Park</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property.HADOOP_SQOOP_IMPORT', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.HADOOP_SQOOP_IMPORT',

    requires: [
        'Flamingo.view.workflowdesigner.property._CommandlineGrid',
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._ValueGrid',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._DelimiterSelCmbField',
        'Flamingo.view.workflowdesigner.property._EnvironmentGrid'
    ],

    width: 500,
    height: 300,

    items: [
        {
            title: 'Source (Database)',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            defaultType: 'textfield',
            items: [
                {
                    name: 'jdbcUrl',
                    fieldLabel: 'JDBC URI'
                },
                {
                    name: 'jdbcDriver',
                    fieldLabel: 'JDBC Driver'
                },
                {
                    name: 'sqoopUsername',
                    fieldLabel: 'Username'
                },
                {
                    name: 'sqoopPassword',
                    inputType: 'password',
                    fieldLabel: 'Password'
                },
                {
                    name: 'sqoopTable',
                    fieldLabel: 'JDBC Table'
                }
            ]
        },
        {
            xtype: 'form',
            title: 'Destination (HDFS)',
            border: false,
            autoScroll: true,
            defaults: {
                anchor: '100%',
                labelWidth: 100
            },
            defaultType: 'textfield',
            items: [
                {
                    name: 'output',
                    fieldLabel: 'HDFS Path',
                    xtype: '_browserField'
                }
            ]
        },
        {
            title: 'References',
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
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://sqoop.apache.org/docs/1.4.6/SqoopUserGuide.html" target="_blank">Sqoop User Guide</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://sqoop.apache.org/docs/1.4.6/SqoopDevGuide.html" target="_blank">Sqoop Developer Guide</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://sqoop.apache.org/docs/1.4.6/api/index.html" target="_blank">Sqoop API</a>'
                }
            ]
        }
    ]
});