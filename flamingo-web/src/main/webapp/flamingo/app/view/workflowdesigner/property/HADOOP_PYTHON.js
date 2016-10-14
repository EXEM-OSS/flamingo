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
 * Python Script Property View
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property.HADOOP_PYTHON
 * @author <a href="mailto:fharenheit@gmail.com">Byoung Gon, Kim</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property.HADOOP_PYTHON', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.HADOOP_PYTHON',

    requires: [
        'Flamingo.view.workflowdesigner.property._CommandlineGrid',
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._ValueGrid',
        'Flamingo.view.workflowdesigner.property._EnvironmentGrid'
    ],

    width: 600,
    height: 350,

    items: [
        {
            title: 'Python Script',
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
                    xtype: 'textfield',
                    fieldLabel: 'Path',
                    name: 'path',
                    value: '/usr/bin/python',
                    editable: false,
                    padding: '2 5 0 5',   // Same as CSS ordering (top, right, bottom, left)
                    allowBlank: false,
                    listeners: {
                        render: function (p) {
                            var theElem = p.getEl();
                            var theTip = Ext.create('Ext.tip.Tip', {
                                html: 'Path',
                                margin: '25 0 0 150',
                                shadow: false
                            });
                            p.getEl().on('mouseover', function () {
                                theTip.showAt(theElem.getX(), theElem.getY());
                            });
                            p.getEl().on('mouseleave', function () {
                                theTip.hide();
                            });
                        }
                    }
                },
/*
                {
                    xtype: 'textfield',
                    fieldLabel: message.msg('workflow.common.shell.workingpath'),
                    name: 'workingDir',
                    value: '',
                    padding: '2 5 0 5',   // Same as CSS ordering (top, right, bottom, left)
                    allowBlank: true,
                    listeners: {
                        render: function (p) {
                            var theElem = p.getEl();
                            var theTip = Ext.create('Ext.tip.Tip', {
                                html: message.msg('workflow.common.shell.workingpath'),
                                margin: '25 0 0 150',
                                shadow: false
                            });
                            p.getEl().on('mouseover', function () {
                                theTip.showAt(theElem.getX(), theElem.getY());
                            });
                            p.getEl().on('mouseleave', function () {
                                theTip.hide();
                            });
                        }
                    }
                },
*/
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
                                mode: 'text/x-python',
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
            title: 'Command Parameter',
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
                    height: 50,
                    value: 'Please enter command line parameters in separate lines.<br>For example, if you want to enter "hadoop jar <JAR> <DRIVER> -input /INPUT -output /OUTPUT," enter -input, /INPUT, -output, and /OUTPUT in different lines.'
                },
                {
                    xtype: '_commandlineGrid',
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
                    value: '<a href="https://www.python.org/doc/" target="_blank">Python Documentation</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.codecademy.com/en/tracks/python-ko" target="_blank">Python (Korean)</a>'
                }
            ]
        }
    ]
});