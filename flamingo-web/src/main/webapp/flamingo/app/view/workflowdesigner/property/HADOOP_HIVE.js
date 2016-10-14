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
Ext.define('Flamingo.view.workflowdesigner.property.HADOOP_HIVE', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.HADOOP_HIVE',

    requires: [
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid'
    ],

    width: 600,
    height: 400,

    items: [
        {
            xtype: 'form',
            title: 'Hive Query',
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
                    xtype: 'textareafield',
                    name: 'script',
                    flex: 1,
                    padding: '5 5 5 5',
                    layout: 'fit',
                    allowBlank: false,
                    style: {
                        'font-size': '12px'
                    },
                    listeners: {
                        boxready: function (editor, width, height) {
                            var codeMirror = CodeMirror.fromTextArea(editor.getEl().query('textarea')[0], {
                                mode: 'text/x-hive',
                                layout: 'fit',
                                theme: 'mdn-like',
                                indentUnit: 2,
                                lineWrapping: true,
                                lineNumbers: true,
                                matchBrackets: true,
                                smartIndent: true,
                                showModes: false,
                                autofocus: true
                            });

                            editor.getEl().query('textarea')[0].style.fintSize = '24px';

                            codeMirror.on('blur', function () {
                                editor.setValue(codeMirror.getValue());
                            });
                        },
                        resize: function (editor, width, height) {
                            this.getEl().query('.CodeMirror')[0].CodeMirror.setSize('100%', height);
                        }
                    }
                }
            ]
        },
        {
            xtype: 'form',
            title: 'Script Variable',
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
                    height: 40,
                    value: 'For variables, use the `${VAR}` format, and variables will be mapped to their own values. Variables are interpreted when scripts are executed. You cannot use a comma (,) with variables and values.'
                },
                {
                    xtype: '_nameValueGrid',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'form',
            title: 'Hadoop Configuration',
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
                    value: 'Enter a key and a value of Configuration.set () method used in Hadoop Mapreduce.'
                },
                {
                    xtype: '_keyValueGrid',
                    flex: 1
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
                    value: '<a href="https://cwiki.apache.org/confluence/display/Hive/Home" target="_blank">Apache Hive</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="https://cwiki.apache.org/confluence/display/Hive/GettingStarted" target="_blank">Getting Started</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://hortonworks.com/hadoop-tutorial/using-hive-data-analysis/" target="_blank">Using Hive for Data Analysis</a>'
                }
            ]
        }
    ]
});