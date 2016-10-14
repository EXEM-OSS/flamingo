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
Ext.define('Flamingo.view.hdfsbrowser.File', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.hdfsFilePanel',

    requires: [
        'Ext.toolbar.Breadcrumb'
    ],

    border: false,

    bind: {
        store: '{listStore}'
    },
    selModel: {
        selType: 'checkboxmodel'
    },
    viewConfig: {
        stripeRows: true,
        getRowClass: function () {
            return 'cell-height-30';
        }
    },
    columns: [
        {
            xtype: 'templatecolumn',
            align: 'center',
            width: 30,
            tpl: '<tpl if="directory"><i class="fa fa-folder-o fa-lg" aria-hidden="true"></i></tpl><tpl if="!directory"><i class="fa fa-file-text-o fa-lg" aria-hidden="true"></i></tpl>',
            sortable: false
        },
        {
            text: 'File Name',
            align: 'left',
            flex: 1,
            dataIndex: 'filename',
            tdCls: 'monospace-column'
        },
        {
            text: 'File Size',
            width: 100,
            sortable: true,
            dataIndex: 'length',
            align: 'center'
        },
        {
            text: 'Consumed',
            width: 100,
            sortable: true,
            dataIndex: 'spaceConsumed',
            align: 'center'
        },
        {
            text: 'Replication',
            width: 100,
            sortable: true,
            dataIndex: 'replication',
            align: 'center'
        },
        {
            text: 'Modified',
            width: 140,
            dataIndex: 'modificationTime',
            align: 'center'
        },
        {
            text: 'Owner', width: 80, dataIndex: 'owner', align: 'center'
        },
        {
            text: 'Group', width: 80, dataIndex: 'group', align: 'center'
        },
        {
            text: 'Permission',
            width: 80, dataIndex: 'permission', align: 'center'
        },
        {
            text: 'Replication',
            width: 60,
            dataIndex: 'replication',
            align: 'center',
            hidden: true
        },
        {
            text: 'Consumed',
            width: 80,
            dataIndex: 'spaceConsumed',
            hidden: true,
            align: 'center',
            renderer: function (value) {
                return fileSize(value);
            }
        }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                text: 'Create',
                iconCls: 'common-directory-add',
                reference: 'createDirectoryMenu',
                tooltip: 'Create directory in current path.',
                handler: 'onClickCreateDirectory'
            },
            {
                text: 'Copy',
                iconCls: 'common-file-copy',
                reference: 'copyButton',
                tooltip: 'Copy the selected file(s) to the selected path.',
                handler: 'onClickCopyFile'
            },
            {
                text: 'Move',
                iconCls: 'common-file-move',
                reference: 'moveButton',
                tooltip: 'Move the selected file(s) to the selected path.',
                handler: 'onClickMoveFile'
            },
            {
                text: 'Rename',
                iconCls: 'common-file-rename',
                reference: 'renameButton',
                tooltip: 'Rename the selected file.',
                handler: 'onRenameClick'
            },
            {
                text: 'Delete',
                iconCls: 'common-delete',
                reference: 'deleteButton',
                tooltip: 'Delete the selected file.',
                handler: 'onDeleteClick'
            },
            '-',
            {
                text: 'Upload',
                iconCls: 'common-upload',
                reference: 'uploadButton',
                tooltip: 'Upload files to the selected path.',
                handler: 'onClickUploadFile'
            },
            {
                text: 'Download',
                iconCls: 'common-download',
                reference: 'downloadButton',
                tooltip: 'Download the file to local.',
                handler: 'onClickDownloadFile'
            },
            {
                text: 'Preview',
                iconCls: 'common-file-view',
                reference: 'viewFileContentsButton',
                tooltip: 'Preview the file.',
                handler: 'onClickViewFile'
            },
            {
                text: 'Set Permission',
                iconCls: 'common-user-auth',
                itemId: 'setPermission',
                tooltip: 'Change ownership of selected files.',
                handler: 'onPermissionClick'
            },
            '->',
            {
                xtype: 'textfield',
                reference: 'filter'
            },
            {
                iconCls: 'common-find',
                handler: 'onFilterClick'
            },'-',
            {
                text: 'Refresh',
                iconCls: 'common-refresh',
                reference: 'refreshButton',
                tooltip: 'Refresh the file list of the selected path.',
                handler: 'onRefreshClick'
            }
        ]
    }],

    bbar: {
        xtype: 'pagingtoolbar',
        bind: {
            store: '{listStore}'
        },
        displayInfo: true
    },

    listeners: {
        itemdblclick: 'onListItemdblclick',
        afterrender: 'onFileAfterRender',
        itemcontextmenu: 'onFileItemContextMenu',
        simpleHdfsBeforeOk: 'onFileSimpleHdfsBeforeOk',
        dropfiles: 'onDropfiles',
        containercontextmenu: function (grid, event) {
            event.stopEvent();
        }
    }
});