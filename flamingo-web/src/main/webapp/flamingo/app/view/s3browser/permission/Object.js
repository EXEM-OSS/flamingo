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
Ext.define('Flamingo.view.s3browser.permission.Object', {
    extend: 'Ext.window.Window',
    xtype: 'objectPermission',

    requires: [
        'Flamingo.view.s3browser.permission.PermissionController',
        'Flamingo.view.s3browser.permission.PermissionModel'
    ],

    controller: 'permissionViewController',

    viewModel: {
        type: 'permissionModel'
    },

    reference: 'objectPermissionWindow',
    title: 'Permissions',

    modal: true,
    resiable: false,

    width: 800,
    height: 600,

    bodyStyle: {
        background: '#EAEAEA'
    },

    bodyPadding: 20,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    defaults: {
        frame: true
    },

    items: [
        {
            xtype: 'grid',
            flex: 1,
            margin: '7 0 0 0',
            columnLines: true,
            enableColumnHide: false,
            sortableColumns: false,
            bind: {
                store: '{objectPermissionStore}'
            },
            defaultListenerScope: true,
            referenceHolder: true,
            columns: [
                {
                    header: 'Grantee',
                    dataIndex: 'name',
                    width: 200
                },
                {
                    xtype: 'checkcolumn',
                    header: 'Open/Download',
                    flex: 1,
                    dataIndex: 'read'
                },
                {
                    xtype: 'checkcolumn',
                    header: 'View Permissions',
                    flex: 1,
                    dataIndex: 'readAcp'
                },
                {
                    xtype: 'checkcolumn',
                    header: 'Edit Permissions',
                    flex: 1,
                    dataIndex: 'writeAcp'
                }
            ]
        }
    ],
    listeners: {
        afterrender: 'onObjectAfterRender'
    }
});