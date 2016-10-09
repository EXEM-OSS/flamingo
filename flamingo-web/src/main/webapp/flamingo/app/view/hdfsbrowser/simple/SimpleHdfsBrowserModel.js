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