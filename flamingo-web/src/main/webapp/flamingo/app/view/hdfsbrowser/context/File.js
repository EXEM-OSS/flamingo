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
Ext.define('Flamingo.view.hdfsbrowser.context.File', {
    extend: 'Ext.menu.Menu',
    xtype: 'filemenu',

    requires: [
        'Flamingo.view.hdfsbrowser.context.ContextController'
    ],

    controller: 'hdfscontext',

    items: [{
        text: 'Copy',
        iconCls: 'common-directory-copy',
        itemId: 'copyFileMenu',
        tooltip: 'Copy selected directory to destination.',
        handler: 'onMenuitemClick'
    },
    {
        text: 'Move',
        iconCls: 'common-directory-move',
        itemId: 'moveFileMenu',
        tooltip: 'Move selected directory to destination.',
        handler: 'onMenuitemClick'
    },
    {
        text: 'Rename',
        iconCls: 'common-directory-remove',
        itemId: 'renameFileMenu',
        tooltip: 'Rename selected directory.',
        handler: 'onMenuitemClick'
    },
    {
        text: 'Delete',
        iconCls: 'common-database-remove',
        itemId: 'deleteFileMenu',
        tooltip: 'Delete selected directory.',
        handler: 'onMenuitemClick'
    },
    '-',
    {
        text: 'Download',
        iconCls: 'common-download',
        reference: 'downloadButton',
        itemId: 'downloadFileMenu',
        tooltip: 'Download a file',
        handler: 'onMenuitemClick'
    },
    '-',
    {
        text: 'Preview',
        iconCls: 'common-file-view',
        itemId: 'viewFileContents',
        tooltip: 'Preview the file.',
        handler: 'onMenuitemClick'
    },
    '-',
    {
        text: 'File Property',
        iconCls: 'common-information',
        itemId: 'fileInfo',
        tooltip: 'View property of the selected file.',
        handler: 'onMenuitemClick'

    }]
});