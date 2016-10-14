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
Ext.define('Flamingo.view.hdfsbrowser.MultiFileUpload', {
    extend: 'Ext.grid.Panel',
    xtype: 'multiFileUploadPanel',

    requires: [
        'Ext.form.field.File',
        'Flamingo.view.hdfsbrowser.MultiFileUploadController',
        'Flamingo.view.hdfsbrowser.MultiFileUploadModel'
    ],

    controller: 'multiFileUpload',
    viewModel: 'multiFileUpload',

    /**
     * 업로드 경로
     */
    uploadPath: '',

    /**
     * Upload 최대 파일 사이즈(byte)
     */
    maxUploadSize: config['file.upload.max.size'],

    /**
     * 업로드 URL
     */
    uploadUrl: CONSTANTS.FS.HDFS_UPLOAD_FILE,

    bind: {
        store: '{multiFileStore}'
    },

    tbar: [
        {
            xtype: 'filefield',
            reference: 'mfFilefield',
            buttonOnly: true,
            buttonConfig: {
                iconCls: 'common-search',
                text: 'Find'
            },
            width: 60,
            listeners: {
                change: 'onFilefieldChange'
            }
        },
        '-',
        {
            text: 'Delete All',
            iconCls: 'common-delete',
            handler: 'onDeleteAllClick'
        },
        '->',
        {
            text: 'Upload',
            iconCls: 'common-upload',
            handler: 'onUploadClick'
        },
        {
            text: 'Cancel',
            iconCls: 'common-cancel',
            handler: 'onCancelClick'
        }
    ],
    columns: [
        {
            dataIndex: 'name',
            header: 'File Name',
            flex: 1,
            align: 'center'
        },
        {
            dataIndex: 'size',
            header: 'File Size',
            width: 70,
            fixed: true,
            align: 'center',
            renderer: function (value) {
                return Ext.util.Format.fileSize(value);
            }
        },
        {
            dataIndex: 'type',
            header: 'Type',
            width: 150,
            fixed: true,
            align: 'center'
        },
        {
            dataIndex: 'status',
            header: 'Status',
            width: 70,
            fixed: true,
            align: 'center'
        },
        {
            dataIndex: 'progress',
            header: 'Progress',
            width: 90,
            fixed: true,
            align: 'center',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                if (!value) {
                    value = 0;
                }
                return Ext.String.format('<div class="x-progress x-progress-default x-border-box">' +
                    '<div class="x-progress-text x-progress-text-back" style="width: 76px;">{0}%</div>' +
                    '<div class="x-progress-bar x-progress-bar-default" role="presentation" style="width:{0}%">' +
                    '<div class="x-progress-text" style="width: 76px;"><div>{0}%</div></div></div></div>', value);
            }
        },
        {
            dataIndex: 'message',
            width: 1,
            hidden: true
        }
    ],

    bbar: {
        xtype: 'displayfield',
        text: Ext.String.format('Maximum allowed size of file to upload \: {0}',
            Ext.util.Format.fileSize(parseInt(config['file.upload.max.size'])))
    },

    xhrHashMap: new Ext.util.HashMap(),

    listeners: {
        afterrender: 'onAfterrender'
    }
});