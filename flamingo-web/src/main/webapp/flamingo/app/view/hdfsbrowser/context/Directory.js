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
Ext.define('Flamingo.view.hdfsbrowser.context.Directory', {
    extend: 'Ext.menu.Menu',
    xtype: 'directorymenu',

    requires: [
        'Flamingo.view.hdfsbrowser.context.ContextController'
    ],

    controller: 'hdfscontext',

    items: [
        {
            text: 'Copy',
            iconCls: 'common-directory-copy',
            itemId: 'copyDirectoryMenu',
            tooltip: 'Copy selected directory to destination.',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Move',
            iconCls: 'common-directory-move',
            itemId: 'moveDirectoryMenu',
            tooltip: 'Move selected directory to destination.',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Rename',
            iconCls: 'common-directory-remove',
            itemId: 'renameDirectoryMenu',
            tooltip: 'Rename selected directory.',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Delete',
            iconCls: 'common-database-remove',
            itemId: 'deleteDirectoryMenu',
            tooltip: 'Delete selected directory.',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Merge',
            iconCls: 'common-directory-merge',
            itemId: 'mergeFileMenu',
            tooltip: 'Merge all the files in the selected path into a single file.',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Directory Property',
            iconCls: 'common-information',
            itemId: 'getInfoMenu',
            tooltip: 'Shows property of the selected directory.',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Set Permission',
            iconCls: 'common-user-auth',
            itemId: 'permissionMenu',
            tooltip: 'Set permission to access the selected directory.',
            handler: 'onMenuitemClick'
        }
    ]
});