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
/**
 * Inner Grid : KeyValue
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property._Grid
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property._HiveBrowser', {
    extend: 'Ext.panel.Panel',
    alias: 'widget._hiveBrowser',

    requires: [
        'Flamingo.view.workflowdesigner.property._HiveTableCreator'
    ],

    border: true,

    layout: 'border',

    initComponent: function () {
        this.items = [
            {
                region: 'west',
                border: false,
                collapsible: true,
                split: true,
                title: 'Hive Database',
                width: 200,
                layout: 'fit',
                items: [
                    {
                        itemId: 'hiveBrowserTree',
                        border: false,
                        xtype: 'treepanel',
                        rootVisible: true,
                        useArrows: true,
                        store: Ext.create('Ext.data.TreeStore', {
                            autoLoad: false,
                            proxy: {
                                type: 'ajax',
                                url: CONSTANTS.DESIGNER.HIVE_DBS,
                                headers: {
                                    'Accept': 'application/json'
                                },
                                reader: {
                                    type: 'json',
                                    root: 'list'
                                }
                            },
                            root: {
                                text: 'Hive Databases',
                                id: '/',
                                expanded: true
                            },
                            folderSort: true,
                            sorters: [
                                {
                                    property: 'text',
                                    direction: 'ASC'
                                }
                            ]
                        }),
                        dockedItems: [
                            {
                                xtype: 'toolbar',
                                items: [
                                    {
                                        text: 'Create',
                                        itemId: 'createButton',
                                        tooltip: 'Create Table',
                                        handler: function () {
                                            var win = Ext.create('Ext.window.Window', {
                                                title: 'Create Table',
                                                width: 500,
                                                height: 500,
                                                layout: 'fit',
                                                modal: true,
                                                closeAction: 'hide',
                                                buttons: [
                                                    {
                                                        text: 'Confirm',

                                                        handler: function () {
                                                            var tableName = Ext.ComponentQuery.query('_hiveTableCreator #tableName')[0];
                                                            var comment = Ext.ComponentQuery.query('_hiveTableCreator #comment')[0];
                                                            var location = Ext.ComponentQuery.query('_hiveTableCreator #location')[0];
                                                            var delimiter = Ext.ComponentQuery.query('_hiveTableCreator #delimiter')[0];

                                                            var columnGrid = Ext.ComponentQuery.query('_hiveTableCreator #columnGrid')[0];
                                                            var partitionGrid = Ext.ComponentQuery.query('_hiveTableCreator #partitionGrid')[0];

                                                            var columns = [], partitions = [];

                                                            partitionGrid.getStore().each(function (record, idx) {
                                                                partitions.push({
                                                                    name: record.get('columnNames'),
                                                                    type: record.get('columnTypes'),
                                                                    comment: record.get('columnDescriptions')
                                                                });
                                                            });

                                                            columnGrid.getStore().each(function (record, idx) {
                                                                columns.push({
                                                                    name: record.get('columnNames'),
                                                                    type: record.get('columnTypes'),
                                                                    comment: record.get('columnDescriptions')
                                                                });
                                                            });

                                                            var body = {
                                                                tableName: tableName.getValue(),
                                                                comment: comment.getValue(),
                                                                location: location.getValue(),
                                                                delimiter: delimiter.query('#delimiterValue')[0].getRawValue(),
                                                                columns: columns,
                                                                partitions: partitions
                                                            };
                                                        }
                                                    },
                                                    {
                                                        text: 'Cancel',

                                                        handler: function () {
                                                            win.close();
                                                        }
                                                    }
                                                ],
                                                items: [
                                                    {
                                                        xtype: '_hiveTableCreator'
                                                    }
                                                ]
                                            }).show();
                                        }
                                    },
                                    {
                                        text: 'Drop Table',
                                        itemId: 'dropButton',
                                        tooltip: 'Drop a table',
                                        handler: function () {
                                        }
                                    },
                                    '->',
                                    {
                                        text: 'Refresh',
                                        iconCls: 'common_refresh',
                                        itemId: 'refreshButton',
                                        tooltip: 'Refresh',
                                        handler: function () {
                                            var treeStore = Ext.ComponentQuery.query('#hiveBrowserTree')[0].getStore();
                                            treeStore.load();

                                            var gridStore = Ext.ComponentQuery.query('#hiveBrowserListGrid')[0].getStore();
                                            gridStore.removeAll();
                                        }
                                    }
                                ]
                            }
                        ],
                        listeners: {
                            afterrender: function (comp, opts) {
                                var treeStore = Ext.ComponentQuery.query('#hiveBrowserTree')[0].getStore();
                                treeStore.load();
                            },
                            itemclick: function (view, node, item, index, event, opts) {
                                var gridStore = Ext.ComponentQuery.query('#hiveBrowserListGrid')[0].getStore();
                                gridStore.load(
                                    {
                                        scope: this,
                                        params: {
                                            'node': node.data.parentId,
                                            'table': node.data.text
                                        }
                                    }
                                );
                            }
                        }
                    }
                ]
            },
            {
                region: 'center',
                title: 'Column',
                border: false,
                layout: 'fit',
                items: [
                    {
                        itemId: 'hiveBrowserListGrid',
                        xtype: 'grid',
                        border: false,
                        stripeRows: true,
                        columnLines: true,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {text: 'Table ID', width: 60, dataIndex: 'columnId', hidden: true},
                            {text: 'Name', flex: 2, sortable: true, dataIndex: 'name'},
                            {text: 'Type', flex: 1, dataIndex: 'type', align: 'center'},
                            {text: 'Comment', flex: 2, dataIndex: 'comment'},
                            {text: 'Index', width: 50, dataIndex: 'index', align: 'center', hidden: true}
                        ],
                        store: Ext.create('Ext.data.Store', {
                            fields: ['columnId', 'name', 'type', 'comment', 'index'],
                            autoLoad: false,
                            proxy: {
                                type: 'ajax',
                                url: CONSTANTS.DESIGNER.HIVE_COLUMNS,
                                headers: {
                                    'Accept': 'application/json'
                                },
                                reader: {
                                    type: 'json',
                                    root: 'list'
                                }
                            }
                        })
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});