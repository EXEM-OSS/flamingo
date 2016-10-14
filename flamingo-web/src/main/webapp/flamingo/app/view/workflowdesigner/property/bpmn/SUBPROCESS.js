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
Ext.define('Flamingo.view.workflowdesigner.property.bpmn.SUBPROCESS', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE',
    alias: 'widget.SUBPROCESS',

    requires: ['Flamingo.view.workflowdesigner.property._KeyValueProtectGrid'],

    width: 600,
    height: 350,

    items: [
        {
            title: 'Workflow Information',
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
                    fieldLabel: 'Workflow to run',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'hidden',
                            itemId: 'treeId',
                            name: 'treeId',
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            flex: 1,
                            name: 'name',
                            itemId: 'name',
                            allowBlank: false,
                            value: '',
                            emptyText: 'Please click the Select button to choose a workflow.'
                        },
                        {
                            xtype: 'button',
                            itemId: 'selectBtn',
                            margin: '0 0 0 5',
                            text: 'Select Workflow',
                            width: 120,
                            handler: function () {
                                var popWindow = Ext.create('Ext.Window', {
                                    title: 'Workflow',
                                    width: 400,
                                    height: 400,
                                    modal: true,
                                    resizable: true,
                                    constrain: true,
                                    layout: 'fit',
                                    items: {
                                        xtype: 'folderTree'
                                    },
                                    buttonAlign: 'center',
                                    buttons: [
                                        {
                                            text: 'Confirm',
                                            handler: function () {
                                                var tree = popWindow.query('folderTree #folderTreeTreePanel')[0];
                                                var node = tree.getSelectionModel().getSelection()[0].data;
                                                if (node.cls == 'folder') {
                                                    // 에러 표시
                                                } else {
                                                    // AJAX 호출후 값 설정
                                                    invokeGet(CONSTANTS.DESIGNER.GET, {
                                                            treeId: node.id
                                                        },
                                                        function (response) {
                                                            var wf = Ext.decode(response.responseText);
                                                            query('SUBPROCESS #treeId').setValue(node.id);
                                                            query('SUBPROCESS #name').setValue(wf.map.workflowName);
                                                            var store = query('SUBPROCESS #keyValueProtectGrid').getStore();
                                                            var vars = Ext.decode(unescape(wf.map.variable));
                                                            var global = vars.global;
                                                            store.removeAll();
                                                            for (var k in global) {
                                                                store.add({
                                                                    keys: k,
                                                                    values: global[k],
                                                                    protected: false
                                                                });
                                                            }
                                                            popWindow.close();
                                                        },
                                                        function (response) {

                                                        }
                                                    );
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
                                }).show();
                            }
                        }
                    ]
                },
                {
                    itemId: 'keyValueProtectGrid',
                    xtype: '_keyValueProtectGrid',
                    title: 'Workflow Variable',
                    margin: '0 0 0 5',
                    border: 1,
                    flex: 1
                }
            ]
        }
    ]
});