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
Ext.define('Flamingo.view.workflowdesigner.property._BrowserField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._browserField',

    layout: 'hbox',

    defaults: {
        hideLabel: true
    },

    items: [],

    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'textfield',
                    flex: 1,
                    name: this.name,
                    listeners: {
                        errorchange: function (comp, error, eOpts) {
                            comp.focus(false, 50);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Find',
                    tooltip: 'Show file system browser.',
                    margin: '0 0 0 3',
                    handler: function () {
                        var popWindow = Ext.create('Ext.Window', {
                            title: 'HDFS Browser',
                            width: 800,
                            height: 400,
                            modal: true,
                            constrain: true,
                            layout: 'fit',
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
                                        var dirSelection = Ext.ComponentQuery.query('hdfsDirectoryPanelForDesigner')[0].getSelectionModel().getSelection();
                                        var fileSelection = Ext.ComponentQuery.query('hdfsFilePanelForDesigner')[0].getSelectionModel().getSelection();
                                        var textfield = me.down('textfield');
                                        if (fileSelection.length > 0) {
                                            if ('/' == fileSelection[0].get('path')) {
                                                textfield.setValue('/' + fileSelection[0].get('filename'));
                                            } else {
                                                textfield.setValue(fileSelection[0].get('path') + '/' + fileSelection[0].get('filename'));
                                            }
                                            popWindow.close();
                                        } else if (dirSelection.length > 0) {
                                            if (!dirSelection[0].get('fullyQualifiedPath')) {
                                                textfield.setValue('/');
                                            } else {
                                                textfield.setValue(dirSelection[0].get('fullyQualifiedPath'));
                                            }
                                            popWindow.close();
                                        } else {
                                            error('Warning', 'Select a file or directory.');
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
        this.callParent();
    }
});