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
Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowserModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.simpleHdfsBrowserModel',

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
            }
        },
        fileStore: {
            autoLoad: false,
            model: 'FEM.model.filesystem.hdfs.File',
            pageSize: 10000,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.HDFS_GET_FILE,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
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
        }
    }
});