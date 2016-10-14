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
Ext.define('Flamingo.view.workflowdesigner.property.HADOOP_PIG', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.HADOOP_PIG',

    requires: [
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid'
    ],

    width: 600,
    height: 400,

    items: [
        {
            title: 'Pig Latin Script',
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
                                mode: 'text/x-pig',
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
            title: 'Script Variable',
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
            title: 'Hadoop Configuration',
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
                    value: '<a href="http://pig.apache.org/docs/r0.15.0/" target="_blank">Apache Pig</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://pig.apache.org/docs/r0.15.0/start.html" target="_blank">Getting Started</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://pig.apache.org/docs/r0.15.0/basic.html" target="_blank">Pig Latin Basics</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://pig.apache.org/docs/r0.15.0/func.html" target="_blank">Built In Functions</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://pig.apache.org/docs/r0.15.0/udf.html" target="_blank">User Defined Functions</a>'
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