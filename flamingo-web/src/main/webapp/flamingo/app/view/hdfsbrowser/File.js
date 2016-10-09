/*
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
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
Ext.define('Flamingo.view.hdfsbrowser.File', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.hdfsFilePanel',

    requires: [
        'Ext.toolbar.Breadcrumb',
        'FEM.model.filesystem.hdfs.List'
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
            text: message.msg('fs.hdfs.common.filename'),
            align: 'left',
            flex: 1,
            dataIndex: 'filename',
            tdCls: 'monospace-column'
        },
        {
            text: message.msg('fs.hdfs.common.file.length'),
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
            text: message.msg('fs.hdfs.common.modification'),
            width: 140,
            dataIndex: 'modificationTime',
            align: 'center'
        },
        {
            text: message.msg('fs.hdfs.common.owner'), width: 80, dataIndex: 'owner', align: 'center'
        },
        {
            text: message.msg('fs.hdfs.common.group'), width: 80, dataIndex: 'group', align: 'center'
        },
        {
            text: message.msg('fs.hdfs.common.permission'), width: 80, dataIndex: 'permission', align: 'center'
        },
        {
            text: message.msg('fs.hdfs.common.replication'),
            width: 60,
            dataIndex: 'replication',
            align: 'center',
            hidden: true
        },
        {
            text: message.msg('fs.hdfs.common.spaceConsumed'),
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
                tooltip: message.msg('fs.hdfs.directory.menu.tip.create'),
                handler: 'onClickCreateDirectory'
            },
            {
                text: 'Copy',
                iconCls: 'common-file-copy',
                reference: 'copyButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.copy'),
                handler: 'onClickCopyFile'
            },
            {
                text: 'Move',
                iconCls: 'common-file-move',
                reference: 'moveButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.move'),
                handler: 'onClickMoveFile'
            },
            {
                text: 'Rename',
                iconCls: 'common-file-rename',
                reference: 'renameButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.rename'),
                handler: 'onRenameClick'
            },
            {
                text: 'Delete',
                iconCls: 'common-delete',
                reference: 'deleteButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.delete'),
                handler: 'onDeleteClick'
            },
            '-',
            {
                text: 'Upload',
                iconCls: 'common-upload',
                reference: 'uploadButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.upload'),
                handler: 'onClickUploadFile'
            },
            {
                text: 'Download',
                iconCls: 'common-download',
                reference: 'downloadButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.download'),
                handler: 'onClickDownloadFile'
            },
            {
                text: 'Preview',
                iconCls: 'common-file-view',
                reference: 'viewFileContentsButton',
                tooltip: message.msg('fs.hdfs.file.panel.tip.viewFile'),
                handler: 'onClickViewFile'
            },
            {
                text: 'Set Permission',
                iconCls: 'common-user-auth',
                itemId: 'setPermission',
                tooltip: message.msg('fs.hdfs.file.panel.tip.permission'),
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
                tooltip: message.msg('fs.hdfs.file.tip.refresh'),
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