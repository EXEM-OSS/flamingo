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
Ext.define('Flamingo.view.hdfsbrowser.HdfsBrowserModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.browserModel',

    data: {
        title: 'HDFS Browser',
        node: '/'
    },

    stores: {
        directoryStore: {
            type: 'tree',
            autoLoad: false,
            rootVisible: true,
            useArrows: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.HDFS_GET_DIRECTORY,
                reader: {
                    type: 'json',
                    rootProperty: 'list'
                }
            },
            root: {
                text: '/',
                id: 'root'
            },
            listeners: {
                /**
                 * 실제 소비한 용량 보다는 해당 디렉토리의 로그 파일의 용량을 기준으로 크기에 따라서 아이콘의 색상을 변경시킨다.
                 * FIXME > 디렉토리 아이콘 색상 변경 작업 필요
                 */
                nodeappend: function (thisNode, newChildNode, index, eOpts) {
                    if (!newChildNode.isRoot()) {
                        var _1GB = 1024 * 1024 * 1024;
                        var _50GB = _1GB * 50;      // Level 1
                        var _500GB = _1GB * 500;    // Level 2
                        var _1TB = _1GB * 1024;     // Level 3
                        var _20TB = _1TB * 20;      // Level 4
                        var _50TB = _1TB * 50;      // Level 5

                        // 툴팁을 추가한다.
                        var qtip =
                            'Path : ' + newChildNode.raw.fullyQualifiedPath
                            + '<br/>'
                            + 'Owner' + ' : ' + newChildNode.raw.owner
                            + '<br/>'
                            + 'Group : ' + newChildNode.raw.group
                            + '<br/>'
                            + 'Directory Count : ' + toCommaNumber(newChildNode.raw.directoryCount)
                            + '<br/>'
                            + 'File Count : ' + toCommaNumber(newChildNode.raw.fileCount);

                        if (newChildNode.raw.spaceConsumed > 0) {
                            qtip = qtip + '<br/>Directory Size : ' + fileSize(newChildNode.raw.spaceConsumed)
                                + '<br/>'
                                + 'File Size : ' + fileSize(newChildNode.raw.spaceConsumed / 2);
                        }

                        newChildNode.set('qtip', qtip);
                    }
                }
            }
        },
        fileStore: {
            autoLoad: false,
            model: 'FEM.model.filesystem.hdfs.File',
            pageSize: 1000,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.HDFS_GET_FILE,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                },
                extraParams: {
                    node: ''
                },
                timeout: 120000
            }
        },
        listStore: {
            autoLoad: false,
            model: 'FEM.model.filesystem.hdfs.List',
            pageSize: 1000,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.HDFS_GET_LIST,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                },
                extraParams: {
                    node: ''
                },
                timeout: 120000
            },
            listeners: {
                load: 'onListStoreLoad'
            }
        },

        breadcrumb: {
            fields: ['name', 'isLast']
        },

        treemap: {
            fields: ['text', 'id', 'filename', 'length', 'fullyQualifiedPath'],
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.HDFS_GET_TOPN,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                },
                extraParams: {
                    node: '/',
                    limit: 1000
                },
                timeout: 120000
            },
            listeners: {
                load: 'onListStoreLoad'
            }
        },

        treemaplegend: {
            model: 'FEM.model.filesystem.hdfs.TreemapLegend'
        },

        fileUnit: {
            fields: ['unit'],
            data: [{
                unit: 'Byte'
            },{
                unit: 'KB'
            },{
                unit: 'MB'
            },{
                unit: 'GB'
            },{
                unit: 'TB'
            }]
        }
    }
});

