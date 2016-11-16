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
Ext.define('Flamingo.view.s3browser.S3BrowserModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.s3browserModel',


    data: {
        title: 'S3 Browser',
        isBucketPage: true,
        bucketName: '',
        path: '',
        resultPage: 1,
        command: ''
    },

    stores: {
        objectStore: {
            autoLoad: false,
            fields: [
                {
                    name: 'isBucket',
                    type: 'boolean',
                    mapping: 'bucket'
                },
                {
                    name: 'isFolder',
                    type: 'boolean',
                    mapping: 'folder'
                },
                {
                    name: 'isObject',
                    type: 'boolean',
                    mapping: 'object'
                },
                {
                    name: 'bucketName',
                    type: 'string',
                    mapping: 'bucketName'
                },
                {
                    name: 'name',
                    type: 'string',
                    mapping: 'name'
                },
                {
                    name: 'key',
                    type: 'string',
                    mapping: 'key'
                },
                {
                    name: 'size',
                    type: 'integer',
                    mapping: 'size',
                    convert: function (value, record) {
                        if (record.data.folder === true) {
                            return null;
                        }
                    }
                },
                {
                    name: 'owner',
                    type: 'string',
                    mapping: 'ownerDisplayName'
                },
                {
                    name: 'storageClass',
                    type: 'string',
                    mapping: 'storageClass',
                    convert: function (value, record) {
                        if (record.data.folder === true) {
                            return null;
                        }
                    }
                },
                {
                    name: 'creationDate',
                    type: 'string',
                    mapping: 'creationDate',
                    convert: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                    }
                },
                {
                    name: 'lastModified',
                    type: 'integer',
                    mapping: 'lastModified',
                    convert: function (value, record) {
                        if (record.data.folder === true) {
                            return null;
                        }

                        if (value !== null) {
                            return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                        }
                    }
                }
            ],
            pageSize: 1000,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.S3_LIST_OBJECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    keepRawData: true
                },
                extraParams: {
                    bucketName: ''
                },
                timeout: 120000
            },
            listeners: {
                load: 'onObjectStoreLoad'
            }
        },

        breadcrumb: {
            fields: ['name', 'isLast']
        },

        pageStore: {
            fields: [
                {
                    name: 'isBucket',
                    type: 'boolean',
                    mapping: 'bucket'
                },
                {
                    name: 'isFolder',
                    type: 'boolean',
                    mapping: 'folder'
                },
                {
                    name: 'isObject',
                    type: 'boolean',
                    mapping: 'object'
                },
                {
                    name: 'bucketName',
                    type: 'string',
                    mapping: 'bucketName'
                },
                {
                    name: 'name',
                    type: 'string',
                    mapping: 'name'
                },
                {
                    name: 'key',
                    type: 'string',
                    mapping: 'key'
                },
                {
                    name: 'size',
                    type: 'integer',
                    mapping: 'size',
                    convert: function (value, record) {
                        if (record.data.folder === true) {
                            return null;
                        }
                    }
                },
                {
                    name: 'owner',
                    type: 'string',
                    mapping: 'ownerDisplayName'
                },
                {
                    name: 'storageClass',
                    type: 'string',
                    mapping: 'storageClass',
                    convert: function (value, record) {
                        if (record.data.folder === true) {
                            return null;
                        }
                    }
                },
                {
                    name: 'creationDate',
                    type: 'string',
                    mapping: 'creationDate',
                    convert: function (value) {
                        return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                    }
                },
                {
                    name: 'lastModified',
                    type: 'integer',
                    mapping: 'lastModified',
                    convert: function (value) {
                        if (value !== null) {
                            return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                        }
                    }
                }
            ]
        }
    }
});