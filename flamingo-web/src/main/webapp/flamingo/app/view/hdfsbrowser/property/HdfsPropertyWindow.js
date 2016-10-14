/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ext.define('Flamingo.view.hdfsbrowser.property.HdfsPropertyWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.property.HdfsPropertyController'
    ],

    controller: 'hdfsPropertyViewController',

    height: 580,
    width: 650,
    layout: 'fit',
    modal: true,
    closeAction: 'destroy',
    resizable: false,

    items: [
        {
            xtype: 'form',
            reference: 'hdfsProperty',
            hidden: false,
            autoScroll: false,
            bodyPadding: 5,
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Default Property',
                    height: 180,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    defaults: {
                        labelAlign: 'right',
                        anchor: '100%',
                        labelWidth: 140
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            name: 'name',
                            value: 'Unknown',
                            fieldLabel: 'Name'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'path',
                            value: 'Unknown',
                            fieldLabel: 'Path'
                        },
                        {
                            xtype: 'radiogroup',
                            name: 'typeRadioGroup',
                            maintainFlex: false,
                            fieldLabel: 'Type',
                            items: [
                                {
                                    xtype: 'radiofield',
                                    disabled: true,
                                    disabledCls: 'disabled_plain',
                                    name: 'isFile',
                                    boxLabel: 'File',
                                    checked: true
                                },
                                {
                                    xtype: 'radiofield',
                                    disabled: true,
                                    disabledCls: 'disabled_plain',
                                    name: 'isDirectory',
                                    boxLabel: 'Directory'
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            name: 'length',
                            value: 'Unknown',
                            fieldLabel: 'Directory Size',
                            renderer: function (name) {
                                return Ext.util.Format.fileSize(name)
                                    + ' (' + toCommaNumber(name) + ')'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            name: 'modification',
                            value: 'Unknown',
                            fieldLabel: 'Modified'
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Ownership',
                    height: 60,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    items: [
                        {
                            layout: {
                                type: 'table',
                                columns: 2,
                                tableAttrs: {
                                    style: {
                                        width: '100%'
                                    }
                                }
                            },
                            bodyPadding: '5',
                            defaults: {
                                labelAlign: 'right',
                                anchor: '100%',
                                labelWidth: 170
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    name: 'owner',
                                    value: 'Unknown',
                                    fieldLabel: 'Owner'
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'group',
                                    value: 'Unknown',
                                    fieldLabel: 'Group'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Permission',
                    height: 130,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    defaults: {
                        labelAlign: 'right',
                        anchor: '100%',
                        labelWidth: 170
                    },
                    items: [
                        {
                            xtype: 'checkboxgroup',
                            name: 'ownerPermission',
                            fieldLabel: 'Owner',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerRead',
                                    boxLabel: 'Read',
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerWrite',
                                    boxLabel: 'Write',
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerExecute',
                                    boxLabel: 'Execute',
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxgroup',
                            name: 'groupPermission',
                            fieldLabel: 'Group',
                            labelAlign: 'right',
                            columns: 3,
                            vertical: false,
                            formBind: false,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupRead',
                                    boxLabel: 'Read',
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupWrite',
                                    boxLabel: 'Write',
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupExecute',
                                    boxLabel: 'Execute',
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxgroup',
                            name: 'otherPermission',
                            fieldLabel: 'Other',
                            labelAlign: 'right',
                            columns: 3,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherRead',
                                    boxLabel: 'Read',
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherWrite',
                                    boxLabel: 'Write',
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherExecute',
                                    boxLabel: 'Execute',
                                    readOnly: true
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Space Usage Information',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    items: [
                        {
                            layout: {
                                type: 'table',
                                columns: 2,
                                tableAttrs: {
                                    style: {
                                        width: '100%'
                                    }
                                }
                            },
                            bodyPadding: 5,
                            defaults: {
                                labelAlign: 'right',
                                anchor: '100%',
                                labelWidth: 170
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    name: 'blockSize',
                                    value: 'Unknown',
                                    fieldLabel: 'Blocks',
                                    renderer: function (name) {
                                        return Ext.util.Format.fileSize(name)
                                            + ' (' + toCommaNumber(name) + ')';
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'replication',
                                    value: 'Unknown',
                                    fieldLabel: 'Replication'
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'quota',
                                    value: 'Unknown',
                                    fieldLabel: 'Directory Quota',
                                    hidden: true,
                                    renderer: function (value) {
                                        return value < 0 ? '' : value;
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'directoryCount',
                                    value: 'Unknown',
                                    fieldLabel: 'Directories'
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'fileCount',
                                    value: 'Unknown',
                                    fieldLabel: 'Files'
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'spaceQuota',
                                    value: 'Unknown',
                                    fieldLabel: 'Disk Quota',
                                    hidden: true,
                                    renderer: function (value) {
                                        return value < 0 ? '' : value;
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'spaceConsumed',
                                    value: 'Unknown',
                                    fieldLabel: 'Consumed',
                                    renderer: function (name) {
                                        return Ext.util.Format.fileSize(name)
                                            + ' (' + toCommaNumber(name) + ')';
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    listeners: {
        afterrender: 'onAfterRender'
    }
});