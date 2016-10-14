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
            fields: [
                {
                    name: 'id',
                    convert: function (value, record) {
                        if (record.get('path') == '/') {
                            return record.get('path') + record.get('filename');
                        } else {
                            return record.get('path') + '/' + record.get('filename');
                        }
                    }
                },
                {
                    name: 'filename'
                },
                {
                    name: 'length'
                },
                {
                    name: 'modificationTime',
                    convert: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                    }
                },
                {
                    name: 'permission'
                },
                {
                    name: 'group'
                },
                {
                    name: 'owner'
                },
                {
                    name: 'replication'
                },
                {
                    name: 'blockSize'
                },
                {
                    name: 'spaceConsumed'
                },
                {
                    name: 'path'
                }
            ],
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
            fields: [
                {
                    name: 'fullPath',
                    convert: function (value, record) {
                        if (record.get('path') == '/') {
                            return record.get('path') + record.get('filename');
                        }
                        else if (record.get('path') == '.') {
                            return record.get('fullyQualifiedPath');
                        }
                        else {
                            return record.get('path') + '/' + record.get('filename');
                        }
                    }
                },
                {
                    name: 'filename'
                },
                {
                    name: 'length',
                    convert: function (value, record) {
                        return fileSize(value);
                    }
                },
                {
                    name: 'modificationTime',
                    convert: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                    }
                },
                {
                    name: 'permission'
                },
                {
                    name: 'group'
                },
                {
                    name: 'owner'
                },
                {
                    name: 'replication',
                    convert: function (value, record) {
                        if (record.get('directory')) {
                            return '';
                        }

                        return value;
                    }
                },
                {
                    name: 'blockSize'
                },
                {
                    name: 'spaceConsumed',
                    convert: function (value, record) {
                        return fileSize(value);
                    }
                },
                {
                    name: 'path'
                },
                {
                    name: 'directory'
                }
            ],
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

