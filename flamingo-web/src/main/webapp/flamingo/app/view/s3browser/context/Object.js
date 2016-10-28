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
Ext.define('Flamingo.view.s3browser.context.Object', {
    extend: 'Ext.menu.Menu',
    xtype: 'objectmenu',


    requires: [
        'Flamingo.view.s3browser.context.ContextController'
    ],

    controller: 's3context',

    items: [
        {
            text: 'Copy',
            iconCls: 'common-object-copy',
            itemId: 'copyObjectMenu',
            tooltip: 'copy',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Move',
            iconCls: 'common-directory-move',
            itemId: 'moveObjectMenu',
            tooltip: 'move',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Rename',
            iconCls: 'common-directory-remove',
            itemId: 'renameObjectMenu',
            tooltip: 'rename',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Delete',
            iconCls: 'common-database-remove',
            itemId: 'deleteObjectMenu',
            tooltip: 'delete',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Properties',
            iconCls: 'common-information',
            itemId: 'showObjectPropertyMenu',
            tooltip: 'Show properties',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Permissions',
            iconCls: 'common-user-auth',
            itemId: 'showObjectPermissionMenu',
            tooltip: 'Show permissions',
            handler: 'onMenuitemClick'
        }
    ]
});