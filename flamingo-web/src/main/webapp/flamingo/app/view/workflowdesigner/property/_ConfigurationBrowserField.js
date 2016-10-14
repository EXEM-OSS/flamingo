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
Ext.define('Flamingo.view.workflowdesigner.property._ConfigurationBrowserField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget._configurationBrowserField',

    fieldLabel: 'Configuration File',
    disabled: false,
    defaults: {
        hideLabel: true
    },
    layout: 'hbox',

    initComponent: function () {
        var me = this;
        this.items = [
            {
                xtype: 'textfield',
                name: 'config',
                allowBlank: true,
                flex: 1
            },
            {
                xtype: 'button',
                text: 'Browse',
                tooltip: 'View HDFS browser.',
                handler: function () {
                    var panel = me;
                    var popWindow = Ext.create('Ext.Window', {
                        title: 'File System Browser',
                        width: 800,
                        height: 400,
                        modal: true,
                        resizable: true,
                        constrain: true,
                        layout: 'fit',
                        items: {
                            xtype: 'hdfsBrowser'
                        },
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: 'Confirm',
                                handler: function () {
                                    var grid = popWindow.query('#hdfsBrowserListGrid')[0];
                                    var columnGrid = panel.up().query('_keyValueGrid')[0];
                                    var clusterCombo = Ext.ComponentQuery.query('canvas #wd_cmb_cluster')[0];
                                    var textfield = panel.query('textfield')[0];

                                    var gridSelected = grid.getSelectionModel().getSelection();
                                    if (gridSelected.length != 0) {
                                        var metadataFile = gridSelected[0].data.id;

                                        // TODO FIX URL
                                        invokePostByMap('/rest/designer/loadConfig.do', {
                                                file: metadataFile,
                                                cluster: clusterCombo.getValue()
                                            },
                                            function (response) {
                                                var obj = Ext.decode(response.responseText);
                                                if (obj.success) {
                                                    textfield.setValue(metadataFile);
                                                    columnGrid.getStore().removeAll();
                                                    for (var i = 0; i < obj.total; i++) {
                                                        columnGrid.getStore().add(obj.list[i]);
                                                    }
                                                } else {
                                                    Ext.MessageBox.show({
                                                        title: 'Warning',
                                                        message: 'We were unable to load the Hadoop configuration file. Cause\:' + obj.error.message,
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                }
                                            },
                                            function () {
                                                Ext.MessageBox.show({
                                                    title: 'Warning',
                                                    message: 'We were unable to load the Hadoop configuration file. Cause\:',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });

                                            }
                                        );

                                        popWindow.close();
                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Warning',
                                            message: 'Please select a Hadoop configuration file.',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
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
        ];
        this.callParent(arguments);
    }
});