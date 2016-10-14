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
Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowserController',
        'Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowserModel',
        'Flamingo.view.hdfsbrowser.Directory',
        'Flamingo.view.hdfsbrowser.File'
    ],

    controller: 'simpleHdfsFileBrowserController',

    viewModel: 'simpleHdfsBrowserModel',

    title: 'HDFS Browser',
    layout: 'fit',
    width: 800,
    height: 600,
    modal: true,
    closeAction: 'destroy',

    items: [
        {
            xtype: 'grid',
            region: 'center',
            border: false,
            reference: 'hdfsFileGrid',
            bind: {
                store: '{listStore}'
            },
            plugins: [
                {
                    ptype: 'bufferedrenderer',
                    leadingBufferZone: 50,
                    trailingBufferZone: 20
                }
            ],
            viewConfig: {
                columnLines: true,
                stripeRows: true,
                getRowClass: function () {
                    return 'cell-height-30';
                }
            },
            tbar: [{
                text: 'View',
                iconCls: 'common-file-view',
                reference: 'viewFileContentsButton',
                tooltip: 'Preview the file.',
                handler: 'onClickViewFile'
            }],
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
                    width: 225,
                    dataIndex: 'filename',
                    tdCls: 'monospace-column'
                },
                {
                    text: 'File Size',
                    width: 80,
                    sortable: true,
                    dataIndex: 'length',
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
                    text: 'Permission', width: 80, dataIndex: 'permission', align: 'center'
                },
                {
                    text: 'Replication',
                    width: 60,
                    dataIndex: 'replication',
                    align: 'center'
                },
                {
                    text: 'Consumed',
                    width: 80,
                    dataIndex: 'spaceConsumed',
                    align: 'center',
                    renderer: function (value) {
                        return fileSize(value);
                    }
                }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                style: {
                    background: '#FFFFFF'
                },
                items: [{
                    xtype: 'dataview',
                    bind: {
                        store: '{breadcrumb}'
                    },
                    itemSelector: 'li',
                    overItemCls: 'breadcrumb-over',
                    trackOver: true,
                    tpl: [
                        '<ol class="breadcrumb">',
                        '<tpl for=".">',
                        '<tpl if="!isLast">',
                        '<li><a>{name}</a></li>',
                        '</tpl>',
                        '<tpl if="isLast">',
                        '<li class="active"><a>{name}</a></li>',
                        '</tpl>',
                        '</tpl>',
                        '</ol>'
                    ],
                    listeners: {
                        itemclick: 'breadcrumbItemclick'
                    }
                }]
            },{
                xtype: 'pagingtoolbar',
                bind: {
                    store: '{listStore}'
                },
                dock: 'bottom',
                displayInfo: true
            }],
            listeners: {
                itemdblclick: 'onListItemdblclick'
            }
        }
    ],
    buttonAlign: 'right',
    buttons: [
        {
            text: 'OK',
            iconCls: 'common-ok',
            handler: 'onBtnOkClick'
        },
        {
            text: 'Cancel',
            iconCls: 'common-cancel',
            handler: 'onBtnCancelClick'
        }
    ],
    listeners: {
        afterrender: 'onAfterRender',
        containercontextmenu: function (tree, event) {
            event.stopEvent();
        }
    }
});