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
Ext.define('Flamingo.view.s3browser.Object', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.s3ObjectPanel',

    requires: [
        'Ext.toolbar.Breadcrumb'
    ],

    border: false,

    bind: {
        store: '{objectStore}'
    },
    selModel: {
        selType: 'checkboxmodel',
        showHeaderCheckbox: false
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
            tpl: '<tpl if="bucket"><i class="fa fa-folder-o fa-lg" aria-hidden="true"></i></tpl>' +
                 '<tpl if="folder"><i class="fa fa-folder-o fa-lg" aria-hidden="true"></i></tpl>' +
                 '<tpl if="object"><i class="fa fa-file-text-o fa-lg" aria-hidden="true"></i></tpl>',
            sortable: false
        },
        {
            text: 'Name',
            align: 'left',
            flex: 1,
            dataIndex: 'name',
            tdCls: 'monospace-column'
        },
        {
            text: 'Size',
            width: 80,
            dataIndex: 'size',
            hidden: true,
            reference: 'sizeColumn',
            align: 'center'
        },
        {
            text: 'LastModified',
            width: 200,
            dataIndex: 'lastModified',
            reference: 'lastModifiedColumn',
            hidden: true,
            align: 'center'
        }
    ],


    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                text: 'Create',
                iconCls: 'common-directory-add',
                reference: 'createButton',
                tooltip: 'create',
                handler: 'onCreateClick'
            },
            {
                text: 'Copy',
                iconCls: 'common-file-copy',
                reference: 'copyButton',
                tooltip: 'copy',
                handler: 'onCopyClick'
            },
            {
                text: 'Move',
                iconCls: 'common-file-move',
                reference: 'moveButton',
                tooltip: 'move',
                handler: 'onMoveClick'
            },
            {
                text: 'Rename',
                iconCls: 'common-file-rename',
                reference: 'renameButton',
                tooltip: 'rename',
                handler: 'onRenameClick'
            },
            {
                text: 'Delete',
                iconCls: 'common-delete',
                reference: 'deleteButton',
                tooltip: 'Delete the selected file.',
                handler: 'onDeleteClick'
            },
            {
                text: 'Upload',
                iconCls: 'common-upload',
                reference: 'uploadButton',
                tooltip: 'upload',
                handler: 'onUploadClick'
            },
            {
                text: 'Download',
                iconCls: 'common-download',
                reference: 'downloadButton',
                tooltip: 'download',
                handler: 'onDownloadClick'
            },
            {
                text: 'Preview',
                iconCls: 'common-file-view',
                reference: 'previewButton',
                tooltip: 'Preview the Object.',
                handler: 'onPreviewClick'
            },
            {
                text: 'Properties',
                iconCls: 'common-information',
                reference: 'propertyButton',
                itemId: 'showProperty',
                tooltip: 'info',
                handler: 'onPropertyClick'
            },
            {
                text: 'Permissions',
                iconCls: 'common-user-auth',
                reference: 'permissionButton',
                itemId: 'setPermission',
                tooltip: 'permissions',
                handler: 'onPermissionClick'
            },
            '->',
            {
                text: 'Refresh',
                iconCls: 'common-refresh',
                reference: 'refreshButton',
                tooltip: 'Refresh the file list of the selected path.',
                handler: 'onRefreshClick'
            }
        ]
    }],
    bbar: [
        {
            xtype: 'button',
            text: 'Prev',
            reference: 'pagePrevButton',
            disabled: true,
            iconCls: 'x-item-disabled x-tbar-page-prev',
            handler: 'onPagePrevClick'
        }, {
            xtype: 'displayfield',
            reference: 'dfPage',
            value: 'Page 1'
        }, {
            xtype: 'button',
            text: 'Next',
            iconAlign: 'right',
            reference: 'pageNextButton',
            disabled: false,
            iconCls: 'x-item-disabled x-tbar-page-next',
            handler: 'onPageNextClick'
        }
    ],

    listeners: {
        afterrender: 'onAfterRender',
        itemdblclick: 'onListItemdblclick',
        itemcontextmenu: 'onItemContextMenu',
        simpleS3BeforeOk: 'onSimpleS3BeforeOk',
        containercontextmenu: function (grid, event) {
            event.stopEvent();
        }
    }
});