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
Ext.define('Flamingo.view.hdfsbrowser.permission.HdfsPermissionWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.permission.HdfsPermissionController',
        'Flamingo.view.hdfsbrowser.permission.HdfsPermissionForm'
    ],

    controller: 'hdfsPermissionViewController',

    title: 'Set Access Permission',
    height: 370,
    width: 320,
    modal: true,
    layout: 'fit',
    closeAction: 'destroy',
    resizable: false,

    items: [
        {
            xtype: 'HdfsPermissionFormPanel'
        }
    ],
    buttonAlign: 'right',
    buttons: [
        {
            xtype: 'button',
            text: 'Update',
            iconCls: 'common-ok',
            handler: 'onChangePermission'
        },
        {
            xtype: 'button',
            text: 'Cancel',
            iconCls: 'common-cancel',
            handler: 'onCancelPermission'
        }
    ],
    listeners: {
        afterrender: 'onAfterRender'
    }
});