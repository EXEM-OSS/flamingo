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