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

Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowserController',
        'Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowserModel',
        'Flamingo.view.hdfsbrowser.Directory',
        'Flamingo.view.hdfsbrowser.File'
    ],

    controller: 'simpleHdfsFileBrowserController',

    viewModel: {
        type: 'simpleHdfsBrowserModel'
    },

    title: message.msg('fs.hdfs.common.browser'),
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
                    tdCls: 'monospace-column'/*,
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="'
                            + message.msg('fs.hdfs.common.filename') + ' : ' + record.get('filename')
                            + '<br/>'
                            + message.msg('fs.hdfs.common.file.length') + ' : ' + fileSize(record.get('length')) + ' (' + toCommaNumber(record.get('length')) + ')'
                            + '<br/>'
                            + message.msg('fs.hdfs.common.replication') + ' : ' + record.get('replication')
                            + '<br/>'
                            + message.msg('fs.hdfs.common.spaceConsumed') + ' : ' + fileSize(record.get('spaceConsumed'))
                            + '"';
                        return value;
                    }*/
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