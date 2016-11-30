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
 * Shell Script Property View
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property.OOZIE_SSH
 * @author <a href="mailto:fharenheit@gmail.com">sanghyun, Bak</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property.OOZIE_SSH', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.OOZIE_SSH',

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
            title: 'SSH',
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
                    fieldLabel: 'Interpreter Path',
                    name: 'path',
                    value: '/bin/bash',
                    editable: false,
                    padding: '2 5 0 5',   // Same as CSS ordering (top, right, bottom, left)
                    allowBlank: false,
                    listeners: {
                        render: function (p) {
                            var theElem = p.getEl();
                            var theTip = Ext.create('Ext.tip.Tip', {
                                html: 'Specify path to the interpreter to execute the script. e.g. /bin/bash',
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
                {
                    xtype: 'textfield',
                    fieldLabel: 'Working Path',
                    name: 'workingDir',
                    value: '',
                    padding: '2 5 0 5',   // Same as CSS ordering (top, right, bottom, left)
                    allowBlank: true,
                    listeners: {
                        render: function (p) {
                            var theElem = p.getEl();
                            var theTip = Ext.create('Ext.tip.Tip', {
                                html: 'Working Path',
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
                        // boxready: function (editor, width, height) {
                        //
                        //     var codeMirror = CodeMirror.fromTextArea(editor.getEl().query('textarea')[0], {
                        //         mode: 'text/x-sh',
                        //         //layout: 'fit',
                        //         theme: 'mdn-like',
                        //         indentUnit: 2,
                        //         lineWrapping: true,
                        //         lineNumbers: true,
                        //         matchBrackets: true,
                        //         smartIndent: true,
                        //         showModes: false,
                        //         autofocus: true
                        //     });
                        //
                        //     codeMirror.on('blur', function () {
                        //         editor.setValue(codeMirror.getValue());
                        //     });
                        // },
                        // resize: function (editor, width, height) {
                        //     this.getEl().query('.CodeMirror')[0].CodeMirror.setSize('100%', height);
                        //     //this.getEl().query('.CodeMirror')[0].CodeMirror.setSize(width, height);
                        // }
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
                    value: '<a href="https://www.gnu.org/software/bash/manual/bash.html" target="_blank">Bash Reference Manual</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.gnu.org/software/bash/manual/bash.pdf" target="_blank">Bash Reference Manual (PDF)</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html" target="_blank">BASH Programming - Introduction HOW-TO</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.tldp.org/LDP/abs/html/" target="_blank">Advanced Bash-Scripting Guide</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.tldp.org/LDP/abs/abs-guide.pdf" target="_blank">Advanced Bash-Scripting Guide (PDF)</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.tldp.org/LDP/Bash-Beginners-Guide/html/" target="_blank">Bash Guide for Beginners</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.tldp.org/LDP/Bash-Beginners-Guide/Bash-Beginners-Guide.pdf" target="_blank">Bash Guide for Beginners (PDF)</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://cli.learncodethehardway.org/bash_cheat_sheet.pdf" target="_blank">Linux Bash Shell Cheat Sheet</a>'
                }
            ]
        }
    ]
});