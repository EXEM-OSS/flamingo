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
Ext.define('Flamingo.view.hdfsbrowser.permission.HdfsPermissionForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.HdfsPermissionFormPanel',

    reference: 'hdfsPermission',
    bodyPadding: 10,
    items: [
        {
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Owner and Group',
                    reference: 'ownershipField',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    defaults: {
                        labelAlign: 'right',
                        anchor: '100%',
                        labelWidth: 60
                    },
                    padding: '15 50 10 10',
                    items: [

                        {
                            xtype: 'textfield',
                            name: 'owner',
                            reference: 'owner',
                            value: '',
                            fieldLabel: 'Owner'
                        },
                        {
                            xtype: 'textfield',
                            name: 'group',
                            reference: 'group',
                            value: '',
                            fieldLabel: 'Group'
                        },
                        {
                            xtype: 'checkboxfield',
                            reference: 'recursiveOwner',
                            name: 'recursiveOwner',
                            boxLabel: 'Apply All',
                            labelAlign: 'right',
                            style: 'margin-left:65px;',
                            uncheckedValue: 0,
                            inputValue: 1,
                            checked: false,
                            tip: 'Changes the ownership of all sub-directories and files in the selected path.',
                            listeners: {
                                render: function (checkbox) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: checkbox.getEl(),
                                        html: checkbox.tip
                                    });
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Authority',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    defaults: {
                        labelAlign: 'right',
                        anchor: '100%',
                        labelWidth: 60
                    },
                    items: [
                        {
                            xtype: 'checkboxgroup',
                            style: 'margin-top:10px;',
                            fieldLabel: 'Owner',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerRead',
                                    reference: 'ownerRead',
                                    boxLabel: 'Read',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerWrite',
                                    reference: 'ownerWrite',
                                    boxLabel: 'Write',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'ownerExecute',
                                    reference: 'ownerExecute',
                                    boxLabel: 'Execute',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxgroup',
                            fieldLabel: 'Group',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupRead',
                                    reference: 'groupRead',
                                    boxLabel: 'Read',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupWrite',
                                    reference: 'groupWrite',
                                    boxLabel: 'Write',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'groupExecute',
                                    reference: 'groupExecute',
                                    boxLabel: 'Execute',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxgroup',
                            reference: 'otherCheckGroup',
                            fieldLabel: 'Other',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherRead',
                                    reference: 'otherRead',
                                    boxLabel: 'Read',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherWrite',
                                    reference: 'otherWrite',
                                    boxLabel: 'Write',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'otherExecute',
                                    reference: 'otherExecute',
                                    boxLabel: 'Execute',
                                    uncheckedValue: 0,
                                    inputValue: 1
                                }
                            ]
                        },
                        {
                            xtype: 'checkboxfield',
                            reference: 'recursivePermission',
                            name: 'recursivePermission',
                            boxLabel: 'Apply All',
                            labelAlign: 'right',
                            style: 'margin-left:69px;margin-bottom:15px;',
                            uncheckedValue: 0,
                            inputValue: 1,
                            checked: false,
                            tip: 'Changes permission of all sub-directories and files in the selected path.',
                            listeners: {
                                render: function (checkbox) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: checkbox.getEl(),
                                        html: checkbox.tip
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
