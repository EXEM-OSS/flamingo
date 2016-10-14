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
Ext.define('Flamingo.view.hdfsbrowser.information.HdfsTop5Directory', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.hdfsTop5DirectoryPanel',

    border: true,

    items: [
        {
            xtype: 'grid',
            itemId: 'hdfsTop5Grid',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bind: {
                store: '{top5Store}'
            },
            columns: [
                {
                    locked: true,
                    text: 'Directory',
                    width: 130,
                    sortable: false,
                    style: 'text-align:center;font-size:13px',
                    align: 'left',
                    dataIndex: 'path'
                },
                {
                    text: 'Consumed Space',
                    flex: 0.1,
                    sortable: false,
                    style: 'text-align:center;font-size:13px',
                    align: 'right',
                    dataIndex: 'spaceConsumed',
                    tip: 'Consumed Space (Including Replication)',
                    renderer: function (value) {
                        return fileSize(value.toFixed(0));
                    },
                    listeners: {
                        render: function (item) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: item.getEl(),
                                html: item.tip
                            });
                        }
                    }
                }
            ],
            viewConfig: {
                enableTextSelection: true,
                columnLines: true,
                stripeRows: true,
                getRowClass: function () {
                    return 'cell-height-25';
                }
            }
        }
    ],
    tools: [
        {
            type: 'refresh',
            tooltip: 'Refresh',
            handler: 'onHdfsTop5DirectoryRefreshClick'
        }
    ]
});