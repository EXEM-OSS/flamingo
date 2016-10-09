/*
 * Copyright (C) 2011  Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
                    title: message.msg('fs.hdfs.property.defaultInfo.title'),
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
                            fieldLabel: message.msg('fs.hdfs.common.name')
                        },
                        {
                            xtype: 'displayfield',
                            name: 'path',
                            value: 'Unknown',
                            fieldLabel: message.msg('common.path')
                        },
                        {
                            xtype: 'radiogroup',
                            name: 'typeRadioGroup',
                            maintainFlex: false,
                            fieldLabel: message.msg('fs.hdfs.common.type'),
                            items: [
                                {
                                    xtype: 'radiofield',
                                    disabled: true,
                                    disabledCls: 'disabled_plain',
                                    name: 'isFile',
                                    boxLabel: message.msg('common.file'),
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
                            fieldLabel: message.msg('fs.hdfs.common.directory.length'),
                            renderer: function (name) {
                                return Ext.util.Format.fileSize(name)
                                    + ' (' + toCommaNumber(name) + ')'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            name: 'modification',
                            value: 'Unknown',
                            fieldLabel: message.msg('fs.hdfs.common.modification')
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: message.msg('fs.hdfs.common.ownership'),
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
                                    fieldLabel: message.msg('fs.hdfs.common.owner')
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'group',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.common.group')
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: message.msg('fs.hdfs.property.accessPermission'),
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
                            fieldLabel: message.msg('fs.hdfs.common.owner'),
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerRead',
                                    boxLabel: message.msg('fs.hdfs.common.read'),
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerWrite',
                                    boxLabel: message.msg('fs.hdfs.common.write'),
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerExecute',
                                    boxLabel: message.msg('fs.hdfs.common.execute'),
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxgroup',
                            name: 'groupPermission',
                            fieldLabel: message.msg('fs.hdfs.common.group'),
                            labelAlign: 'right',
                            columns: 3,
                            vertical: false,
                            formBind: false,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupRead',
                                    boxLabel: message.msg('fs.hdfs.common.read'),
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupWrite',
                                    boxLabel: message.msg('fs.hdfs.common.write'),
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupExecute',
                                    boxLabel: message.msg('fs.hdfs.common.execute'),
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxgroup',
                            name: 'otherPermission',
                            fieldLabel: message.msg('fs.hdfs.common.other'),
                            labelAlign: 'right',
                            columns: 3,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherRead',
                                    boxLabel: message.msg('fs.hdfs.common.read'),
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherWrite',
                                    boxLabel: message.msg('fs.hdfs.common.write'),
                                    readOnly: true
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherExecute',
                                    boxLabel: message.msg('fs.hdfs.common.execute'),
                                    readOnly: true
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: message.msg('fs.hdfs.property.spaceInfo'),
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
                                    fieldLabel: message.msg('fs.hdfs.property.blockSize'),
                                    renderer: function (name) {
                                        return Ext.util.Format.fileSize(name)
                                            + ' (' + toCommaNumber(name) + ')';
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'replication',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.property.replication')
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'quota',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.property.quota'),
                                    hidden: true,
                                    renderer: function (value) {
                                        return value < 0 ? '' : value;
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'directoryCount',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.property.directoryCount')
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'fileCount',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.property.fileCount')
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'spaceQuota',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.property.spaceQuota'),
                                    hidden: true,
                                    renderer: function (value) {
                                        return value < 0 ? '' : value;
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'spaceConsumed',
                                    value: 'Unknown',
                                    fieldLabel: message.msg('fs.hdfs.property.spaceConsumed'),
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