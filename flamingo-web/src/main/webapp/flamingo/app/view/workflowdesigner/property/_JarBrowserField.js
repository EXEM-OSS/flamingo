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
 *  Inner FieldContainer : BrowserField
 *
 * @class
 * @extends Ext.form.FieldContainer
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property._JarBrowserField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._jarBrowserField',

    layout: 'hbox',

    fieldLabel: 'Path',

    items: [
        {
            xtype: 'textfield',
            name: 'jar',
            allowBlank: false,
            flex: 1,
            emptyText: 'Set a JAR file path.',
            listeners: {
                errorchange: function (comp, error, eopts) {
                    comp.focus(false, 50);
                }
            }
        },
        {
            xtype: 'button',
            text: 'Find',
            margin: '0 0 0 3',
            handler: function () {
                var popWindow = Ext.create('Ext.Window', {
                    layout: 'fit',
                    title: 'HDFS Browser',
                    width: 800,
                    height: 400,
                    modal: true,
                    constrain: true,
                    items: [
                        {
                            //TODO HDFS Browser 소스코드 이관
                            xtype: 'panel'
                        }
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: 'Confirm',

                            handler: function () {
                                var selection = Ext.ComponentQuery.query('hdfsFilePanelForDesigner')[0].getSelectionModel().getSelection();
                                if (selection.length > 0) {
                                    var path = selection[0].get('path') + '/' + selection[0].get('filename');
                                    if (App.Util.String.endsWith(path, '.jar')) {
                                        var textfield = Ext.ComponentQuery.query('_jarBrowserField > textfield')[0];
                                        textfield.setValue(path);
                                        popWindow.close();
                                    } else {
                                        error('Warning', 'Select a jar file');
                                    }
                                }
                            }
                        },
                        {
                            text: 'Cancel',

                            handler: function () {
                                popWindow.close();
                            }
                        }
                    ]
                }).center().show();
            }
        }
    ]
});