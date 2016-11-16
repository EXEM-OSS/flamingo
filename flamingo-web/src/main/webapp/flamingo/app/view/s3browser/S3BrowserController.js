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
Ext.define('Flamingo.view.s3browser.S3BrowserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.s3browserViewController',

    requires: [
        'Flamingo.view.s3browser.context.Folder',
        'Flamingo.view.s3browser.context.Object',
        'Flamingo.view.s3browser.permission.Bucket',
        'Flamingo.view.s3browser.permission.Object',
        'Flamingo.view.s3browser.property.Bucket',
        'Flamingo.view.s3browser.property.Object',
        'Flamingo.view.s3browser.simple.SimpleS3Browser',
        'Flamingo.view.s3browser.upload.Object'
    ],

    listen: {
        controller: {
            'simpleS3BrowserController': {
                simpleOkClick: 'onSimpleOkClick'
            },
            's3context': {
                copyMenu: 'onCopyClick',
                moveMenu: 'onMoveClick',
                renameMenu: 'onRenameClick',
                deleteMenu: 'onDeleteClick',
                downloadMenu: 'onDownloadClick',
                getInfoMenu: 'onPropertyClick',
                permissionMenu: 'onPermissionClick',
                previewMenu: 'onPreviewClick'
            }
        }
    },

    /**
     * 버킷 또는 폴더를 생성한다.
     */
    onCreateClick: function() {
        if (this.getData('isBucketPage')) {
            this.createBucket();
        } else {
            this.createFolder();
        }
    },

    /**
     * 오브젝트를 복사한다.
     */
    onCopyClick: function() {
        this.setData('command', 'copy');

        var record = this.getSelectedRecord();

        if (!record) {
            return;
        }

        if (record.get('isObject')) {
            // 복사할 경로를 선택하기 위한 창을 생성하고 화면에 보여준다.
            Ext.create('Flamingo.view.s3browser.simple.SimpleS3Browser', {
                title: 'Copy',
                type: 'copy'
            }).show();
        } else {
            info('Notification', 'Please select an object');
            return;
        }
    },

    /**
     * 오브젝트를 다른 버킷 또는 경로로 이동한다.
     */
    onMoveClick: function() {
        this.setData('command', 'move');

        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (record.get('isObject')) {
            // 이동할 경로를 선택하기 위한 창을 생성하고 화면에 보여준다.
            Ext.create('Flamingo.view.s3browser.simple.SimpleS3Browser', {
                title: 'Move',
                type: 'move'
            }).show();
        } else {
            info('Notification', 'Please select an object');
            return;
        }
    },

    /**
     * 폴더명 또는 오브젝트명을 변경한다.
     */
    onRenameClick: function() {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (record.get('isObject')) {
            this.renameObject();
        } else {
            info('Notification', 'Please select an object');
            return;
        }
    },

    /**
     * 버킷 또는 폴더 또는 오브젝트를 삭제한다. (Recursively 동작)
     */
    onDeleteClick: function() {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (record.get('isBucket')) {
            this.deleteBucket();
        } else {
            this.deleteObject();
        }
    },

    /**
     * 파일을 S3로 저장한다.
     */
    onUploadClick: function () {
        if (!this.getData('isBucketPage')) {
            this.uploadObject();
        }
    },

    /**
     * 오브젝트를 다운로드 한다.
     */
    onDownloadClick: function () {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (!record.get('isObject')) {
            info('Notification', 'Please select an object');
            return;
        }

        var params = {
            bucketName: record.get('bucketName'),
            key: record.get('key')
        };

        var dom = Ext.dom.Helper.append(document.body, {
                tag: 'iframe',
                id: 'testIframe' + new Date().getTime(),
                css: 'display:none;visibility:hidden;height:0px;',
                src: CONSTANTS.FS.S3_DOWNLOAD_OBJECT + "?bucketName=" + params.bucketName + "&key=" + params.key,
                frameBorder: 0,
                width: 0,
                height: 0
            }
        );

        Ext.get(dom).on('load', function (e, t, o) {
            var response = Ext.decode(e.target.contentDocument.activeElement.innerText);

            if (!response.success) {
                Ext.MessageBox.show({
                    title: 'Notification',
                    message: response.error.message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        });
    },

    /**
     * 오브젝트를 내용을 보여준다.
     * 1024*10 size까지 내용 미리보기 지원
     */
    onPreviewClick: function () {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (!record.get('isObject')) {
            info('Notification', 'Please select an object');
            return;
        }

        var bucketName = record.get('bucketName'),
            key = record.get('key'),
            size = record.get('size');

        if (size < 1) {
            this.warnMessageBox('Notification', 'File contents does not exist');
            return false;
        }

        var params = {
            bucketName: bucketName,
            key: key,
            size: size
        };

        var progress = Ext.MessageBox.show({
            title: 'Notification',
            message: 'Loading file..',
            width: 300,
            wait: true,
            waitConfig: {interval: 50},
            progress: true,
            closable: true
        });

        invokeGet(CONSTANTS.FS.S3_PREVIEW_OBJECT, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                progress.close();

                if (obj.success) {
                    // 파일 내용 보기 창을 화면에 표시한다.
                    var x = window.innerWidth / 2 - 850 / 2;
                    var y = window.innerHeight / 2 - 550 / 2;
                    Ext.create('Ext.window.Window', {
                        title: 'Preview',
                        layout: 'fit',
                        border: false,
                        modal: true,
                        closeAction: 'destroy',
                        width: 800,
                        height: 600,
                        items: [
                            {
                                xtype: 'textarea',
                                value: obj.object,
                                dropEvent: event
                            }
                        ]
                    }).showAt(x, y);
                } else if (obj.error.cause) {
                    this.warnMessageBox('Notification', obj.error.cause);
                } else {
                    this.warnMessageBox('Notification', obj.error.message);
                }
            },
            function () {
                progress.close();
                error('Error', 'Please contact system admin');
            }
        );
    },

    /**
     * 버킷 또는 오브젝트의 정보를 보여준다.
     */
    onPropertyClick: function() {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (record.get('isBucket')) {
            this.showBucketProperty();
        } else if (record.get('isObject')) {
            this.showObjectProperty();
        } else {
            info('Notification', 'Please select a bucket or object');
        }
    },

    /**
     * 버킷 또는 오브젝트의 Permission 정보를 보여준다.
     */
    onPermissionClick: function() {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        if (record.get('isBucket')) {
            this.showBucketPermission();
        } else if (record.get('isObject')) {
            this.showObjectPermission();
        } else {
            info('Notification', 'Please select a bucket or object');
        }
    },

    /**
     * 리스트 목록을 다시 불러온다
     */
    onRefreshClick: function () {
        this.listLoad();
    },

    createBucket: function () {
        var me = this;

        Ext.MessageBox.show({
                title: 'Create Bucket',
                message: 'Please enter a bucket name to create',
                width: 300,
                prompt: true,
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.INFO,
                multiline: false,
                value: 'bucket',
                fn: function (btn, text) {
                    if (Ext.isEmpty(text)) {
                        Ext.MessageBox.show({
                            title: 'Notification',
                            message: 'Please enter a bucket name to create',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        return false;
                    }

                    if (btn == 'yes') {
                        var url = CONSTANTS.FS.S3_CREATE_BUCKET;
                        var params = {
                            bucketName: text
                        };

                        invokePostByMap(url, params,
                            function (response) {
                                var obj = Ext.decode(response.responseText);

                                if (obj.success) {
                                    me.listLoad();
                                } else if (obj.error.cause) {
                                    error('Notification', obj.error.cause);
                                } else {
                                    error('Notification', obj.error.message);
                                }
                            },
                            function () {
                                error('Error', 'Please contact system admin');
                            }
                        );
                    }
                }
            }
        );
    },

    deleteBucket: function () {
        var me = this,
            record = this.getSelectedRecord(),
            bucketName = record.get('bucketName');

        if (!record) {
            return;
        }

        Ext.MessageBox.show({
            title: 'Delete Bucket',
            message: 'Do you want to delete the selected' + bucketName + '?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var url = CONSTANTS.FS.S3_DELETE_BUCKET;
                    var params = {
                        bucketName: bucketName, // 삭제할 버킷 명
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                me.listLoad();
                            } else if (obj.error.cause) {
                                error('Notification', obj.error.cause);
                            } else {
                                error('Notification', obj.error.message);
                            }
                        },
                        function () {
                            error('Error', 'Please contact system admin');
                        }
                    );
                }
            }
        });
    },

    showBucketProperty: function () {
        var record = this.getSelectedRecord(),
            params = { bucketName: record.get('bucketName')};

        if (!record) {
            return;
        }

        invokeGet(CONSTANTS.FS.S3_GET_BUCKET_LOCATION, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    record.data.region = obj.object;
                    Ext.create('Flamingo.view.s3browser.property.Bucket', {
                        title: 'Bucket Property',
                        propertyData: record.data
                    }).show();
                } else {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: obj.error.cause,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    showBucketPermission: function () {
        var record = this.getSelectedRecord();

        if (!record) {
            return;
        }

        var params = {
            bucketName: record.get('bucketName')
        };

        invokeGet(CONSTANTS.FS.S3_GET_BUCKET_ACL, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    Ext.create('Flamingo.view.s3browser.permission.Bucket', {
                        record: record,
                        permissionData: obj.list
                    }).show();
                } else if (obj.error.cause) {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: obj.error.cause,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                } else {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: obj.error.message,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    createFolder: function () {
        var me = this,
            bucketName = this.getData('bucketName'),
            path = this.getData('path');

        Ext.MessageBox.show({
                title: 'Create Folder',
                message: 'Please enter a folder name to create.',
                width: 300,
                prompt: true,
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.INFO,
                multiline: false,
                value: 'folder',
                fn: function (btn, text) {
                    if (Ext.isEmpty(text)) {
                        Ext.MessageBox.show({
                            title: 'Notification',
                            message: 'Please enter a folder name to create.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        return false;
                    }

                    if (btn == 'yes') {
                        var url = CONSTANTS.FS.S3_CREATE_FOLDER;
                        var params = {
                            bucketName: bucketName,
                            key: (path === null ? '' : path) + text // 생성할 폴더 key
                        };

                        invokePostByMap(url, params,
                            function (response) {
                                var obj = Ext.decode(response.responseText);

                                if (obj.success) {
                                    me.clearPageStore(); // 초기화
                                    me.listLoad();
                                } else if (obj.error.cause) {
                                    error('Notification', obj.error.cause);
                                } else {
                                    error('Notification', obj.error.message);
                                }
                            },
                            function () {
                                error('Error', 'Please contact system admin');
                            }
                        );
                    }
                }
            }
        );
    },

    copyObject: function(record, params) {
        var targetBucketName = params.bucketName,
            targetPrefix = params.prefix;

        // Simple S3 Browser에서 복사할 파일을 선택하지 않은 경우
        if (Ext.isEmpty(targetBucketName)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: 'Please select a path to copy.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        Ext.MessageBox.show({
            title: 'Copy File',
            message: 'Do you want to copy the selected object?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: 'Copying file..',
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var url = CONSTANTS.FS.S3_COPY_OBJECT;
                    var params = {
                        srcBucketName: record.get('bucketName'),
                        srcKey: record.get('key'),
                        dstBucketName: targetBucketName,
                        dstKey: targetPrefix + record.get('name')
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            Ext.MessageBox.hide();
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                            //    window.close();
                            } else if (obj.error.cause) {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.cause,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        },
                        function () {
                            error('Error', 'Please contact system admin');
                        }
                    );
                }
            }
        });
    },

    moveObject: function(record, params) {
        var targetBucketName = params.bucketName,
            targetPrefix = params.prefix;

        if (Ext.isEmpty(targetBucketName)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: 'Please select a path to copy.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        Ext.MessageBox.show({
            title: 'Move File',
            message: 'Do you want to move the selected object?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: 'Moving file..',
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var url = CONSTANTS.FS.S3_MOVE_OBJECT;
                    var params = {
                        srcBucketName: record.get('bucketName'),
                        srcKey: record.get('key'),
                        dstBucketName: targetBucketName,
                        dstKey: targetPrefix + record.get('name')
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            Ext.MessageBox.hide();
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                            //    window.close();
                            } else if (obj.error.cause) {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.cause,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        },
                        function () {
                            error('Error', 'Please contact system admin');
                        }
                    );
                }
            }
        });
    },

    renameObject: function () {
        var me = this,
            record = this.getSelectedRecord(),
            bucketName = record.get('bucketName'),
            key = record.get('key');

        if (!record) {
            return;
        }

        Ext.MessageBox.show({
            title: 'Rename Object',
            message: 'Do you want to rename the selected object?',
            width: 300,
            prompt: true,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            multiline: false,
            value: key,
            fn: function (btn, text) {
                if (btn == 'yes' && key != text && !Ext.isEmpty(text)) {
                    var url = CONSTANTS.FS.S3_RENAME_OBJECT;
                    var params = {
                        bucketName: bucketName,
                        srcKey: key,
                        newKey: text
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                me.listLoad();
                            } else if (obj.error.cause) {
                                error('Notification', obj.error.cause);
                            } else {
                                error('Notification', obj.error.message);
                            }
                        },
                        function () {
                            error('Error', 'Please contact system admin');
                        }
                    );
                }
            }
        });
    },

    deleteObject: function () {
        var me = this,
            record = this.getSelectedRecord(),
            bucketName = record.get('bucketName'),
            key = record.get('key');

        if (!record) {
            return;
        }

        Ext.MessageBox.show({
            title: 'Delete Objects',
            message: 'Do you want to delete the selected ' + key + '?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {

                    var progress = Ext.MessageBox.show({
                        title: 'Notification',
                        message: 'Deleting file...',
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var params = {
                        bucketName: bucketName,
                        key: key
                    };

                    invokePostByMap(CONSTANTS.FS.S3_DELETE_OBJECT, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            progress.close();

                            if (obj.success) {
                                me.listLoad();

                            } else if (obj.error.cause) {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.cause,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        },
                        function () {
                            progress.close();
                            error('Error', 'Please contact system admin');
                        }
                    );
                }
            }
        });
    },

    uploadObject: function() {
        var me = this,
            bucketName = this.getData('bucketName'),
            prefix = this.getData('path');

        var window = Ext.create('Ext.window.Window', {
            title: 'Upload Object',
            layout: 'fit',
            border: false,
            modal: true,
            closeAction: 'destroy',
            width: 800,
            height: 600,
            items: [
                {
                    xtype: 's3ObjectUploadPanel',
                    bucketName: bucketName,
                    prefix: prefix,
                    dropEvent: event
                }
            ],
            listeners: {
                close: function () {
                    me.listLoad();
                }
            }
        }).center().show();
    },


    showObjectProperty: function () {
        var record = this.getSelectedRecord();

        if (!record) {
            return;
        }

        if (record.get('isFolder')) {
            info('Notification', 'Please select an object');
        }

        var params = {
                bucketName: record.get('bucketName'),
                key: record.get('key')
        };

        invokeGet(CONSTANTS.FS.S3_GET_OBJECT_PROPERTY, params,
            function (response) {
                var obj = Ext.decode(response.responseText);
                record.data.owner = obj.object.owner;
                record.data.contentType = obj.object.contentType;
                record.data.eTag = obj.object.eTag;
                record.data.uri = obj.object.uri;

                if (obj.success) {
                    Ext.create('Flamingo.view.s3browser.property.Object', {
                        title: 'Object Property',
                        propertyData: record.data
                    }).show();
                } else {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: obj.error.cause,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    showObjectPermission: function() {
        var record = this.getSelectedRecord();

        if (!record) {
            return;
        }

        var params = {
            bucketName: record.get('bucketName'),
            key: record.get('key')
        };

        invokeGet(CONSTANTS.FS.S3_GET_OBJECT_ACL, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    Ext.create('Flamingo.view.s3browser.permission.Object', {
                        record: record,
                        permissionData: obj.list
                    }).show();
                } else if (obj.error.cause) {
                    this.warnMessageBox('Notification', obj.error.cause);
                } else {
                    this.warnMessageBox('Notification', obj.error.message);
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    /**
     * 오브젝트 그리드를 화면에 표시한 후 서버에서 파일 목록을 가져온다.
     *
     * @param grid 파일 목록 Grid
     */
    onAfterRender: function (grid) {
        this.listLoad();

        // Enable Drag & Drop
        var gridBody = grid.body.dom;
        gridBody.addEventListener("dragover", function (event) {
            event.stopPropagation();
            event.preventDefault();
            gridBody.style.background = '#ffc';
        }, false);
        gridBody.addEventListener("dragleave", function (event) {
            event.stopPropagation();
            event.preventDefault();
            gridBody.style.background = 'white';
        }, false);
        gridBody.addEventListener("drop", function (event) {
            event.stopPropagation();
            event.preventDefault();
            gridBody.style.background = 'white';

            grid.fireEvent('dropfiles', event);
        }, false);
    },

    /**
     * @private
     *
     * 오브젝트 브라우저 스토어를 load 한다.
     */
    listLoad: function(params) {
        var me = this,
            refs = me.getReferences(),
            objectStore = this.getData('objectStore');

        if (params) {
            if (params.all === true) {
                this.setData('isBucketPage', true);
                this.setData('bucketName', '');
                this.setData('path', '');

                refs.lastModifiedColumn.setHidden(true);
                refs.sizeColumn.setHidden(true);
                objectStore.getProxy().extraParams.bucketName = '';
                objectStore.getProxy().extraParams.prefix = '';
                objectStore.getProxy().extraParams.continuationToken = params.continuationToken;

            } else if (params.isBucketPage === true) {
                this.setData('isBucketPage', false);
                this.setData('bucketName', params.bucketName);
                this.setData('path', '');
                refs.lastModifiedColumn.setHidden(false);
                refs.sizeColumn.setHidden(false);
                objectStore.getProxy().extraParams.bucketName = params.bucketName;
                objectStore.getProxy().extraParams.prefix = '';
                objectStore.getProxy().extraParams.continuationToken = params.continuationToken;
            } else {
                this.setData('isBucketPage', false);
                this.setData('bucketName', params.bucketName);
                this.setData('path', params.prefix);
                refs.lastModifiedColumn.setHidden(false);
                refs.sizeColumn.setHidden(false);
                objectStore.getProxy().extraParams.bucketName = params.bucketName;
                objectStore.getProxy().extraParams.prefix = params.prefix;
                objectStore.getProxy().extraParams.continuationToken = params.continuationToken;
            }
        }

        objectStore.load({
            callback: function (records, options, success) {
                var refs = me.getReferences(),
                    pageStore = me.getData('pageStore'),
                    isTruncated = objectStore.getProxy().getReader().rawData.map.isTruncated;

                refs.dfPage.setValue('Page ' + me.getData('resultPage'));

                if (isTruncated == "true") {
                    refs.pageNextButton.setDisabled(false);
                } else {
                    refs.pageNextButton.setDisabled(true);
                }
            }
        });
    },

    /**
     * 그리드 아이템 더블클릭 이벤트
     * 버킷 또는 폴더일 경우 하위 목록을 불러온다.
     * */
    onListItemdblclick: function(grid, record, item) {
        var me = this,
            bucketName = record.get('bucketName'),
            key = record.get('key'),
            pageStore = this.getData('pageStore');

        pageStore.removeAll();

        this.setData('resultPage', 1);

        if (record.get('isBucket')) {
            this.setData('isBucketPage', false);
            this.setData('bucketName', bucketName);
            this.setData('path', '');

            var params = {
                bucketName: bucketName,
                prefix: '',
                continuationToken: ''
            };

            me.listLoad(params);
        } else if (record.get('isFolder')) {
            this.setData('isBucketPage', false);
            this.setData('bucketName', bucketName);
            this.setData('path', key);

            var params = {
                bucketName: bucketName,
                prefix: key,
                continuationToken: ''
            };
            me.listLoad(params);
        }
    },

    /**
     * 목록에서 마우스 우클릭 한 경우 Context Menu를 표시한다.
     */
    onItemContextMenu: function (grid, record, item, index, event) {
        var me = this;
        event.stopEvent();

        if (record.get('isBucket')) {
            if (Ext.isEmpty(me.bucketContextMenu)) {
                me.bucketContextMenu = Ext.create('Flamingo.view.s3browser.context.Object');
            }
            me.bucketContextMenu.showAt(event.pageX - 5, event.pageY - 5);
        } else if (record.get('isFolder')) {
            if (Ext.isEmpty(me.folderContextMenu)) {
                me.folderContextMenu = Ext.create('Flamingo.view.s3browser.context.Folder');
            }
            me.folderContextMenu.showAt(event.pageX - 5, event.pageY - 5);
        } else {
            if (Ext.isEmpty(me.objectContextMenu)) {
                me.objectContextMenu = Ext.create('Flamingo.view.s3browser.context.Object');
            }
            me.objectContextMenu.showAt(event.pageX - 5, event.pageY - 5);
        }
    },

    /**
     * Object 스토어가 로드된 이후 breadcrumb 을 위한 데이터를 생성한다.
     * */
    onObjectStoreLoad: function(store, records, successful, operation) {
        var item = operation.request.config.params,
            data = [],
            isLast = false,
            fullyQualifiedPath = '',
            breadcrumbStore = this.getData('breadcrumb'),
            pageStore = this.getData('pageStore'),
            objectStore = this.getData('objectStore'),
            idx, value, prefixArr, str,
            page = this.getData('resultPage'),
            index = (page - 1) * 1000;

        if (page == 1) {
            this.clearPageStore();
        }

        var isTruncated = objectStore.getProxy().getReader().rawData.map.isTruncated;
        if (isTruncated == "true") {
            for (var i = 0; i < records.length; i++, index++) {
                pageStore.insert(index, records[i]);
            }
        }

        this.setData('pageStore', pageStore);

        str = 'All Buckets' + '/';
        if (item.bucketName) {
            str += item.bucketName + '/';
        }

        if (item.prefix) {
            str += item.prefix;
        }

        prefixArr = str.split('/');
        for (idx in prefixArr) {
            value = prefixArr[idx];

            if (idx == prefixArr.length - 1) {
                isLast = true;
            }
            if (value !== '' && idx >= 0) {
                fullyQualifiedPath += '/' + value;
                data.push({name: value, isLast: isLast, fullyQualifiedPath: fullyQualifiedPath});
            }
        }

        breadcrumbStore.loadData(data);
    },


    /**
     * Breadcrumb Item클릭 이벤트
     */
    breadcrumbItemclick: function(view, record, item, index) {
        var me = this,
            path = record.get('fullyQualifiedPath');

        var str = '/All Buckets/';
        var strArr = path.split('/');
        var bucketName = '';
        var key = '';
        var params = [];

        if (strArr.length == 2) {
            key = '';
            params.all = true;

        } else if (strArr.length == 3) {
            bucketName = strArr[2];
            params.all = false;
            params.isBucketPage = true;
            params.bucketName = bucketName;

        } else if (strArr.length > 3) {
            bucketName = strArr[2];
            key = path.substring(str.length+bucketName.length+1, path.length);
            params.all = false;
            params.isBucketPage = false;
            params.bucketName = bucketName;
            params.prefix = key + "/";
        }

        me.clearPageStore();
        me.listLoad(params);
    },


    /**
     * 저장하고있던 페이지 스토어를 비우고 페이지 숫자와 버튼 상태를 초기화한다.
     */
    clearPageStore: function() {
        var pageStore = this.getData('pageStore'),
            objectStore = this.getData('objectStore'),
            refs = this.getReferences();

        pageStore.removeAll();

        objectStore.getProxy().extraParams.continuationToken = '';

        this.setData('resultPage', 1);
        this.setData('pageStore', pageStore);

        refs.dfPage.setValue('Page ' + 1);
        refs.pagePrevButton.setDisabled(true);
    },

    /**
     * 목록 하단에 표시되는 페이지 정보의 이전 버튼이 눌리면 이전 페이지 목록을 로드한다.
     */
    onPagePrevClick: function() {
        var me = this,
            refs = me.getReferences(),
            store = this.getData('objectStore'),
            pageSize = store.pageSize,
            pageStore = this.getData('pageStore'),
            resultPage = this.getData('resultPage');

        var page = resultPage - 1;
        this.setData('resultPage', page);

        if (page == 1) {
            refs.pagePrevButton.setDisabled(true);
        }

        var start = (pageSize * page) - pageSize,
            end = (pageSize * page) - 1,
            datas = pageStore.getRange(start, end);

        store.removeAll();
        store.loadData(datas);

        this.setData('page', page);
        refs.dfPage.setValue('Page ' + page);
    },

    /**
     * 목록 하단에 표시되는 페이지 정보의 다음 버튼이 눌리면 다음 페이지 목록을 로드한다.
     */
    onPageNextClick: function () {
        var me = this,
            refs = me.getReferences(),
            store = this.getData('objectStore'),
            pageSize = store.pageSize,
            pageStore = this.getData('pageStore'),
            resultPage = this.getData('resultPage');

        var page = resultPage + 1;
        this.setData('resultPage', page);

        var end = pageSize * page - 1;
        var start = pageSize * page - pageSize;
        var datas = pageStore.getRange(start, end);

        if (this.getData('resultPage') == 2) {
            refs.pagePrevButton.setDisabled(false);
        }

        if (datas.length > 0) {
            store.removeAll();
            store.setData(datas);
            this.setData('resultPage', page);
            refs.dfPage.setValue('Page ' + page);
        }
        else {
            var params = {
                bucketName: this.getData('bucketName'),
                prefix: this.getData('path'),
                continuationToken: store.getProxy().getReader().rawData.map.continuationToken
            };

            store.removeAll();

            this.setData('resultPage', page);
            refs.dfPage.setValue('Page ' + page);

            me.listLoad(params);
        }
    },

    /**
     * 오브젝트 복사 및 이동시 대상 경로를 받아와 실행한다.
     */
    onSimpleOkClick: function(params) {
        var record = this.getSelectedRecord(),
            command = this.getData('command');

        if (!record) {
            return;
        }

        if (command == "copy") {
            this.copyObject(record, params);
        } else if (command == "move") {
            this.moveObject(record, params);
        }
    },

    onSimpleS3BeforeOk: function() {
        var record = this.getSelectedRecord();
        if (!record) {
            return;
        }

        this.fireEvent('simpleS3Close', record);
        this.getView().close();
    },

    /**
     * 뷰모델 데이터를 반환한다.
     *
     * @param key
     * @returns {*}
     */
    getData: function(key) {
        return this.getViewModel().get(key);
    },

    /**
     * 뷰모델 데이터를 설정한다.
     * @param key
     * @param value
     */
    setData: function(key, value) {
        this.getViewModel().set(key, value);
    },

    /**
     * 목록에서 선택한 레코드를 반환한다.
     */
    getSelectedRecord: function () {
        var refs = this.getReferences(),
            s3ObjectPanel = refs.s3ObjectPanel,
            selections = s3ObjectPanel.getSelectionModel().getSelection();

        if (Ext.isEmpty(selections)) {
            info('Notification', 'Please select an item');
            return false;
        }

        if (selections.length > 1) {
            info('Notification', 'Please select one item');
            return false;
        }

        return selections[0];
    },

    warnMessageBox: function(title, message) {
        Ext.MessageBox.show({
            title: title,
            message: message,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
    }
});