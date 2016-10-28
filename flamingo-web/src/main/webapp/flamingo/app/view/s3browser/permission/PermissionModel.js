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
Ext.define('Flamingo.view.s3browser.permission.PermissionModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.permissionModel',

    stores: {
        objectPermissionStore: {
            autoLoad: false,
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    mapping: 'name'
                },
                {
                    name: 'read',
                    type: 'boolean',
                    mapping: 'read'
                },
                {
                    name: 'write',
                    type: 'boolean',
                    mapping: 'write'
                },
                {
                    name: 'readAcp',
                    type: 'boolean',
                    mapping: 'readAcp'
                },
                {
                    name: 'writeAcp',
                    type: 'boolean',
                    mapping: 'writeAcp'
                }
            ],
            pageSize: 1000,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.S3_GET_OBJECT_ACL,
                reader: {
                    type: 'json',
                    rootProperty: 'list'
                },
                extraParams: {
                    bucketName: '',
                    key: ''
                },
                timeout: 120000
            },
            listeners: {
            //    load: 'onListStoreLoad'
            }
        },
        bucketPermissionStore: {
            autoLoad: false,
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    mapping: 'name'
                },
                {
                    name: 'read',
                    type: 'boolean',
                    mapping: 'read'
                },
                {
                    name: 'write',
                    type: 'boolean',
                    mapping: 'write'
                },
                {
                    name: 'readAcp',
                    type: 'boolean',
                    mapping: 'readAcp'
                },
                {
                    name: 'writeAcp',
                    type: 'boolean',
                    mapping: 'writeAcp'
                }
            ],
            pageSize: 1000,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.FS.S3_GET_BUCKET_ACL,
                reader: {
                    type: 'json',
                    rootProperty: 'list'
                },
                extraParams: {
                    bucketName: ''
                },
                timeout: 120000
            }
        }
    }
});