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
Ext.define('Flamingo.view.s3browser.upload.Object', {
    extend: 'Ext.grid.Panel',
    xtype: 's3ObjectUploadPanel',

    requires: [
        'Flamingo.view.s3browser.upload.UploadController',
        'Flamingo.view.s3browser.upload.UploadModel'
    ],

    controller: 'uploadViewController',
    viewModel: {
        type: 'uploadModel'
    },

    /**
     * 업로드 경로
     */
    uploadPath: '',

    bind: {
        store: '{s3ObjectUploadStore}'
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
        '->',
        {
            text: 'Upload',
            iconCls: 'common-upload',
            handler: 'onUploadClick'
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

    xhrHashMap: new Ext.util.HashMap(),

    listeners: {
        afterrender: 'onAfterRender'
    }
});