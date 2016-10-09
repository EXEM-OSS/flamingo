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
Ext.define('Flamingo.view.hdfsbrowser.HdfsBrowserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.browserViewController',

    listen: {
        controller: {
            'simpleHdfsBrowserController': {
                copyDirectoryBeforeClose: 'onCopyDirectoryBeforeClose',
                moveDirectoryBeforeClose: 'onMoveDirectoryBeforeClose',
                copyFileBeforeClose: 'onCopyFileBeforeClose',
                moveFileBeforeClose: 'onMoveFileBeforeClose'
            },
            'hdfscontext': {
                copyDirectoryMenu: 'onClickCopyDirectory',
                copyFileMenu: 'onClickCopyFile',
                deleteDirectoryMenu: 'onClickDeleteDirectory',
                deleteFileMenu: 'onClickDeleteFile',
                downloadFileMenu: 'onClickDownloadFile',
                fileInfo: 'onClickFileInfo',
                getInfoMenu: 'onClickDirectoryInfo',
                mergeFileMenu: 'onClickMergeFile',
                moveDirectoryMenu: 'onClickMoveDirectory',
                moveFileMenu: 'onClickMoveFile',
                permissionMenu: 'onClickDirectoryPermission',
                renameDirectoryMenu: 'onClickRenameDirectory',
                renameFileMenu: 'onClickRenameFile',
                viewFileContents: 'onClickViewFile'
            },

            'hdfsPermissionViewController': {
                permissionChanged: 'onPermissionChanged'
            }
        }
    },

    /**
     * 디렉토리 트리를 화면에 표시한 후 서버에서 디렉토리 목록을 가져온다.
     *
     * @param tree 디렉토리 목록 Tree
     */
    onDirectoryAfterRender: function (tree) {
        var refs = this.getReferences();

        Ext.defer(function () {
            tree.getStore().load({
                callback: function () {
                    tree.getRootNode().expand();
                    var rootNode = tree.getStore().getNodeById('root');
                    tree.getSelectionModel().select(rootNode);
                }
            });
        }, 300);
    },

    /**
     * 파일 그리드를 화면에 표시한 후 서버에서 파일 목록을 가져온다.
     *
     * @param grid 파일 목록 Grid
     */
    onFileAfterRender: function (grid) {
        var me = this;
        me.initFilter();
        me.listLoad('/');

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
     * Refresh 버튼을 누르면 루트(/) 노드를 기준으로 디렉토리와 파일 패널, 파일 경로를 업데이트한다.
     */
    onDirectoryRefreshClick: function () {
        var me = this,
            refs = me.getReferences();

        me.updateDirectoryStore('/');
        me.updateFileStore('/');
    },

    /**
     * 루트(/) 노드 기준으로 디렉토리 목록을 갱신한다.
     */
    updateDirectoryStore: function (path) {
        var refs = this.getReferences(),
            treeItem = refs.hdfsDirectoryPanel;

        if (!path || path == 'root') {
            path = '/';
        }

        treeItem.getStore().load({
            params: {
                node: path
            },
            callback: function () {
                var rootNode = treeItem.getStore().getNodeById('root');
                treeItem.getSelectionModel().select(rootNode);
            }
        });
    },

    /**
     * 파일 목록 정보를 갱신한다.
     */
    updateFileStore: function (path) {
        var refs = this.getReferences(),
            filePanel = refs.hdfsFilePanel;

        if (!path || path == 'root') {
            path = '/';
        }

        filePanel.getStore().load({
            params: {
                node: path
            }
        });
    },

    /**
     * HDFS Tree에서 디렉토리를 선택했을 때 파일 목록 정보를 업데이트한다.
     */
    onClickDirectoryItem: function (view, node) {
        var refs = this.getReferences(),
            filePanel = refs.hdfsFilePanel,
            fileStore = filePanel.getStore();

        fileStore.getProxy().extraParams.node = node.data.id == 'root' ? '/' : node.data.id;
        fileStore.load({
            params: {
                node: node.data.id == 'root' ? '/' : node.data.id
            }
        });
    },

    /**
     * 선택한 현재 디렉토리 경로만 갱신한다.
     */
    updateCurrentDirectoryStore: function (parentNode) {
        var refs = this.getReferences(),
            treeItem = refs.hdfsDirectoryPanel;

        if (!parentNode.data.expanded) {
            parentNode.data.expanded = true;
        }

        treeItem.getStore().load({
            node: parentNode
        });
    },

    /**
     * 하위 디렉토리 목록을 갱신한다.
     */
    updateSubDirectoryStore: function (srcParentNode, dstParentNode) {
        var refs = this.getReferences(),
            treeItem = refs.hdfsDirectoryPanel;

        if (!dstParentNode.data.expanded) {
            dstParentNode.data.expanded = true;
        }

        treeItem.getStore().load({
            node: srcParentNode
        });

        treeItem.getStore().load({
            node: dstParentNode
        });
    },

    /**
     * 마지막 선택한 디렉토리를 가지고 와서 업데이트 한다.
     */
    onRefreshClick: function () {
        var node = this.getViewModel().get('node');

        this.initFilter();

        this.listLoad(node);
    },

    /**
     * 디렉토리에서 마우스 오른쪽 버튼을 누르는 경우 Context Menu를 표시한다.
     */
    onDirectoryItemContextMenu: function (view, record, item, index, event) {
        var me = this;
        event.stopEvent();

        /**
         * 노드가 펼쳐진 상태에서 우클릭 했을 때 해당 노드를 강제 선택함.
         *
         * @type {Array}
         */
        var records = [];
        records.push(record);
        view.getSelectionModel().select(records);

        if (Ext.isEmpty(me.contextDirectoryMenu)) {

        }
        me.contextDirectoryMenu.showAt(event.pageX - 5, event.pageY - 5);
    },

    /**
     * 선택한 경로에 디렉토리를 생성한다.
     */
    onClickCreateDirectory: function () {
        var me = this,
            refs = me.getReferences(),
            node = me.getViewModel().get('node');

        Ext.MessageBox.show({
                title: message.msg('fs.hdfs.directory.title.create'),
                message: message.msg('fs.hdfs.directory.msg.create'),
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
                            message: 'Please enter a directory name to create.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        return false;
                    }

                    if (text.length > 255) {
                        error('디렉토리 생성 오류', '디렉토리의 길이는 255Bytes를 초과할 수 없습니다.')
                        return;
                    }

                    if (btn == 'yes') {
                        var url = CONSTANTS.FS.HDFS_CREATE_DIRECTORY;
                        var params = {
                            currentPath: node == 'root' ? '/' : node, // 디렉토리를 생성할 경로
                            directoryName: text // 생성할 디렉토리명
                        };

                        invokePostByMap(url, params,
                            function (response) {
                                var obj = Ext.decode(response.responseText);

                                if (obj.success) {
                                    me.initFilter();
                                    me.listLoad(node);
                                } else if (obj.error.cause) {
                                    error('Notification', obj.error.cause);
                                } else {
                                    error('Notification', obj.error.message);
                                }
                            },
                            function () {
                                error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
                            }
                        );
                    }
                }
            }
        );
    },

    /**
     * 현재 디렉토리를 선택한 경로로 복사한다.
     */
    onClickCopyDirectory: function () {

        // 복사할 경로를 선택하기 위한 윈도를 생성하고 화면에 보여준다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowser', {
            beforeCloseEvent: 'copyDirectoryBeforeClose'
        }).show();
    },

    /**
     * Directory Tree Panel에서 복사를 선택했을때 Simple Hdfs Browser의 이벤트 처리
     * @window {Object} Simple HDFS Browser
     * @record{Object} Simple HDFS Browser에서 선택한 record
     */
    onCopyDirectoryBeforeClose: function (window, record) {
        // Simple HDFS Browser에서 복사할 경로를 선택하지 않은 경우
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.copy.target'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var me = this,
            refs = me.getReferences(),
            node = me.getViewModel().get('node'),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection(),
            currentPath = selection[0].get('fullyQualifiedPath'),
            selectedNodeName = selection[0].get('text'),
            dstPath = record.get('id'),
            fullyQualifiedPath;

        if (dstPath == '/') {
            fullyQualifiedPath = dstPath + selectedNodeName;
        } else {
            fullyQualifiedPath = dstPath + '/' + selectedNodeName;
        }

        if (currentPath == fullyQualifiedPath) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.copy.samePath'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.directory.title.copy'),
            message: format(message.msg('fs.hdfs.directory.msg.copy.confirm'), selectedNodeName, dstPath),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var progress = Ext.MessageBox.show({
                        title: 'Notification',
                        message: message.msg('fs.hdfs.file.msg.directory.copying'),
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var params = {
                        currentPath: currentPath, // 복사할 디렉토리의 현재 경로 (디렉토리명 포함)
                        dstPath: dstPath // 복사될 디렉토리의 목적지 경로 (디렉토리명 포함)
                    };

                    invokePostByMap(CONSTANTS.FS.HDFS_COPY_DIRECTORY,
                        params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            progress.close();

                            if (obj.success) {
                                window.close();
                                me.initFilter();
                                me.listLoad(node);
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

                            Ext.MessageBox.show({
                                title: message.msg('common.warning'),
                                message: format(message.msg('common.failure'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
        return false;
    },

    /**
     * 선택한 디렉토리를 다른 경로로 이동시킨다.
     */
    onClickMoveDirectory: function () {
        // 이동할 경로를 선택하기 위한 윈도를 생성하고 화면에 보여준다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowser', {
            beforeCloseEvent: 'moveDirectoryBeforeClose'
        }).show();
    },

    /**
     * 선택한 디렉토리를 다른 경로로 이동시킨다.
     * Simple HDFS Browser BeforeClose Event
     */
    onMoveDirectoryBeforeClose: function (window, record) {
        // Simple HDFS Browser에서 이동할 경로를 선택하지 않은 경우
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.move.target'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var me = this,
            refs = me.getReferences(),
            node = me.getViewModel().get('node'),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection(),
            currentPath = selection[0].get('fullyQualifiedPath'),
            selectedNodeName = selection[0].get('text'),
            dstPath = record.get('id');

        // 선택한 디렉토리와 이동시킬 경로가 동일한 경우
        if (currentPath == record.id || node == record.id) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.move.samePath'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.directory.title.move'),
            message: format(message.msg('fs.hdfs.directory.msg.move.confirm'), selectedNodeName, record.id),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var params = {
                        currentPath: currentPath, // 이동할 디렉토리의 현재 경로 (디렉토리명 포함)
                        dstPath: dstPath // 이동될 디렉토리의 전체 경로
                    };

                    invokePostByMap(CONSTANTS.FS.HDFS_MOVE_DIRECTORY,
                        params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                window.close();
                                me.initFilter();
                                me.listLoad(node);
                            } else if (obj.error.cause) {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.cause,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                                return false;
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Notification',
                                    message: obj.error.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                                return false;
                            }
                        },
                        function () {
                            Ext.MessageBox.show({
                                title: message.msg('common.warning'),
                                message: format(message.msg('common.failure'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                            return false;
                        }
                    );
                }
            }
        });
        return false;
    },

    /**
     * 현재 디렉토리명을 변경한다.
     */
    onClickRenameDirectory: function () {
        var me = this,
            refs = me.getReferences(),
            node = me.getViewModel().get('node'),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection();

        if (selection.length == 0) {
            info('확인', '변경하려는 디렉토리를 선택하시오.');
        }
        var currentPath = selection[0].get('fullyQualifiedPath'),
            selectedNodeName = selection[0].get('text');

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.directory.title.rename'),
            message: message.msg('fs.hdfs.directory.msg.rename.confirm'),
            width: 300,
            prompt: true,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            multiline: false,
            value: selectedNodeName,
            fn: function (btn, text) {
                // 입력한 이름 뒤에 공백 제거
                if (trim(text) == selectedNodeName) {
                    return;
                }

                if (btn == 'yes' && selectedNodeName != text && !Ext.isEmpty(text)) {
                    var url = CONSTANTS.FS.HDFS_RENAME_DIRECTORY;
                    var params = {
                        currentPath: currentPath, // 변경할 디렉토리명이 포함된 전체 경로
                        directoryName: text // 변경할 디렉토리명
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                me.initFilter();
                                me.listLoad(node);
                            } else if (obj.error.cause) {
                                error('Notification', obj.error.cause);
                            } else {
                                error('Notification', obj.error.message);
                            }
                        },
                        function () {
                            error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
                        }
                    );
                }
            }
        });
    },

    /**
     * 선택한 디렉토리를 삭제한다.
     */
    onClickDeleteDirectory: function () {
        var me = this,
            refs = this.getReferences(),
            viewModel = me.getViewModel(),
            node = viewModel.get('node'),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection();

        if (selection.length == 0) {
            info('확인', '삭제하려는 디렉토리를 선택하시오.');
        }

        var currentPath = selection[0].get('fullyQualifiedPath'),
            parentPath = node;

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.directory.title.delete'),
            message: format(message.msg('fs.hdfs.directory.msg.delete.confirm'), currentPath),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var url = CONSTANTS.FS.HDFS_DELETE_DIRECTORY;
                    var params = {
                        currentPath: currentPath, // 삭제할 디렉토리 경로 (디렉토리명 포함)
                        parentPath: parentPath // 삭제할 디렉토리의 상위 경로
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                me.initFilter();
                                me.listLoad(node);
                            } else if (obj.error.cause) {
                                error('Notification', obj.error.cause);
                            } else {
                                error('Notification', obj.error.message);
                            }
                        },
                        function () {
                            error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
                        }
                    );
                }
            }
        });
    },

    /**
     * 선택한 디렉토리에 존재하는 모든 파일을 병합해서 상위 경로에 저장한다.
     * 만약 선택한 디렉토리가 root일 경우 '/mergedFile' 형태로 저장된다.
     */
    onClickMergeFile: function () {
        var me = this,
            refs = this.getReferences(),
            node = me.getViewModel().get('node'),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection(),
            selectedNodePath = selection[0].get('fullyQualifiedPath'),
            filenameToMerge = selection[0].get('text');

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.directory.title.merge'),
            message: message.msg('fs.hdfs.directory.msg.merge'),
            width: 300,
            prompt: true,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            multiline: false,
            value: filenameToMerge,
            fn: function (btn, text) {
                if (Ext.isEmpty(text)) {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: message.msg('fs.hdfs.directory.msg.merge'),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    return false;
                }

                if (btn == 'yes') {
                    var parentNodePath = '';
                    var mergedFilePath = '';
                    var selectedNodeName = '';

                    // 현재 노드가 루트(/)일 때 병합된 파일의 저장 위치는 루트(/)로 설정
                    if (selectedNodePath == 'root') {
                        mergedFilePath = CONSTANTS.ROOT + text;
                        selectedNodeName = CONSTANTS.ROOT;
                    } else { // 병합된 파일의 저장 경로는 상위 부모 디렉토리(mergedFile)에 저장함.
                        parentNodePath = node;
                        mergedFilePath = parentNodePath == '/' ? '/' + text : parentNodePath + '/' + text;
                        selectedNodeName = selectedNodePath;
                    }

                    var params = {
                        currentPath: selectedNodeName,
                        dstPath: mergedFilePath
                    };

                    invokePostByMap(CONSTANTS.FS.HDFS_GET_MERGE_FILE,
                        params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                me.initFilter();
                                me.listLoad(node);
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
                            Ext.MessageBox.show({
                                title: message.msg('common.warning'),
                                message: format(message.msg('common.failure'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    },

    /**
     * 선택한 디렉토리의 정보를 보여준다.
     */
    onClickDirectoryInfo: function () {
        var refs = this.getReferences(),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection();

        if (selection.length == 0) {
            info('확인', '디렉토리를 선택하시오.');
        }
        var currentPath = selection[0].get('id'),
            params = {
                currentPath: currentPath
            };

        invokeGet(CONSTANTS.FS.HDFS_GET_DIRECTORY_INFO, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    Ext.create('Flamingo.view.hdfsbrowser.property.HdfsPropertyWindow', {
                        title: message.msg('fs.hdfs.property.title.Directory'),
                        propertyData: obj.map
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
                Ext.MessageBox.show({
                    title: message.msg('common.warning'),
                    message: format(message.msg('common.failure'), config['system.admin.email']),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        );
    },

    /**
     * 선택한 디렉토리에 포함된 하위 디렉토리만 업데이트한다.
     */
    onClickRefresh: function () {
        var refs = this.getReferences(),
            treeItem = refs.hdfsDirectoryPanel;
        var selectedNode = treeItem.getSelectionModel().getLastSelected();
        var currentPath = selectedNode.get('id');
        var node = treeItem.getStore().getNodeById(currentPath);

        if (!node.data.expanded) {
            node.data.expanded = true;
        }

        var filePanel = refs.hdfsFilePanel,
            fileStore = filePanel.getStore();

        this.initFilter();

        fileStore.load({
            params: {
                node: node.data.id == 'root' ? '/' : node.data.id
            }
        });
    },

    /**
     * 선택한 디렉토리의 접근 권한을 설정한다.
     */
    onClickDirectoryPermission: function () {
        var refs = this.getReferences(),
            node = this.getViewModel().get('node'),
            hdfsFilePanel = refs.hdfsFilePanel,
            selection = hdfsFilePanel.getSelectionModel().getSelection(),
            currentPath = selection[0].get('fullyQualifiedPath');

        var params = {
            currentPath: currentPath
        };

        invokeGet(CONSTANTS.FS.HDFS_GET_DIRECTORY_INFO, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    // 사용자의 접근 권한을 설정할 수 있는 창을 생성하고 화면에 보여준다.
                    Ext.create('Flamingo.view.hdfsbrowser.permission.HdfsPermissionWindow', {
                        node: node,
                        record: selection[0],
                        permissionData: obj.map,
                        fileStatus: obj.map['isFile']
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
                Ext.MessageBox.show({
                    title: message.msg('common.warning'),
                    message: format(message.msg('common.failure'), config['system.admin.email']),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        );
    },

    /**
     * 파일을 다른 디렉토리로 복사한다.
     */
    onClickCopyFile: function () {
        var selectedFiles = this.getSelectedItemIds();

        // File Grid Panel에서 파일을 선택하지 않았을 경우
        if (selectedFiles.length == 0) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var fromItems = [];

        for (var i = 0; i < selectedFiles.length; i++) {
            fromItems[i] = selectedFiles[i].get('id');
        }

        // 복사할 경로를 선택하기 위한 창을 생성하고 화면에 보여준다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowser', {
            beforeCloseEvent: 'copyFileBeforeClose'
        }).show();
    },

    /**
     * File Grid Panel에서 복사를 선택했을때 Simple HDFS Browser의 이벤트 처리
     * @window {Object} Simple HDFS Browser
     * @record {Object} Simple HDFS Browser에서 선택한 record
     */
    onCopyFileBeforeClose: function (window, record) {
        // Simple HDFS Browser에서 복사할 파일을 선택하지 않은 경우
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.copy.target'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var dstPath = record.id == 'root' ? '/' : record.id;
        var selectedFiles = this.getSelectedItemIds();

        // 파일을 복사할 경로에 동일한 파일명이 존재하는지 확인
        if (selectedFiles[0].get('path') == dstPath) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.copy.samePath'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var filesToCopy = [];

        for (var i = 0; i < selectedFiles.length; i++) {
            filesToCopy[i] = selectedFiles[i].get('id');
        }

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.file.title.copy'),
            message: format(message.msg('fs.hdfs.file.msg.copy'), selectedFiles.length, dstPath),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    Ext.MessageBox.show({
                        title: 'Notification',
                        message: message.msg('fs.hdfs.file.msg.copying'),
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var url = CONSTANTS.FS.HDFS_COPY_FILE;
                    var params = {
                        currentPath: selectedFiles[0].get('path'),
                        files: filesToCopy.join(), // 복사할 파일이 있는 경로(파일명 포함)
                        dstPath: dstPath // 파일이 복사될 목적지 경로
                    };

                    invokePostByMap(url, params,
                        function (response) {
                            Ext.MessageBox.hide();
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                window.close();
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
                            Ext.MessageBox.hide();
                            Ext.MessageBox.show({
                                title: message.msg('common.warning'),
                                message: format(message.msg('common.failure'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    },

    /**
     * 파일을 다른 디렉토리로 이동한다.
     */
    onClickMoveFile: function () {
        var selectedFiles = this.getSelectedItemIds();

        // File Grid Panel에서 파일을 선택하지 않았을 경우
        if (selectedFiles.length == 0) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var fromItems = [];

        for (var i = 0; i < selectedFiles.length; i++) {
            fromItems[i] = selectedFiles[i].get('id');
        }

        // 이동할 경로를 선택하기 위한 윈도를 생성하고 화면에 보여준다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowser', {
            beforeCloseEvent: 'moveFileBeforeClose'
        }).show();
    },

    /**
     * File Grid Panel에서 이동을 선택했을때 Simple HDFS Browser의 이벤트 처리
     * @window {Object} Simple HDFS Browser
     * @record {Object} Simple HDFS Browser에서 선택한 record
     */
    onMoveFileBeforeClose: function (window, record) {
        // Simple HDFS Browser에서 이동할 파일을 선택하지 않은 경우
        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.move.target'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var me = this;
        var targetPath = record.get('id');
        var node = me.getViewModel().get('node');
        var selectedFiles = this.getSelectedItemIds();
        var compareToValidPath = selectedFiles[0].get('path') == '/' ? 'root' : selectedFiles[0].get('path');

        // 파일을 이동할 경로에 동일한 파일명이 존재하는지 확인
        if (compareToValidPath == record.id) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.move.samePath'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var filesToMove = [];

        for (var i = 0; i < selectedFiles.length; i++) {
            filesToMove[i] = selectedFiles[i].get('id');
        }

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.file.title.move'),
            message: format(message.msg('fs.hdfs.file.msg.move'), filesToMove.length, record.id),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var progress = Ext.MessageBox.show({
                        title: 'Notification',
                        message: message.msg('fs.hdfs.file.msg.moving'),
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var params = {
                        currentPath: node,
                        files: filesToMove.join(), // 이동할 파일이 있는 경로(파일명 포함)
                        dstPath: targetPath // 파일이 이동될 목적지 경로
                    };

                    invokePostByMap(CONSTANTS.FS.HDFS_MOVE_FILE,
                        params,
                        function (response) {
                            progress.close();
                            var obj = Ext.decode(response.responseText);

                            if (obj.success) {
                                me.initFilter();
                                me.listLoad(node);
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

                            Ext.MessageBox.show({
                                title: message.msg('common.warning'),
                                message: format(message.msg('common.failure'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    },

    /**
     * 선택한 파일의 이름을 변경한다.
     */
    onClickRenameFile: function () {
        var me = this;
        var refs = this.getReferences(),
            gridItem = refs.hdfsFilePanel;
        var selectedFiles = this.getSelectedItemIds();
        var selectedFile = gridItem.getSelectionModel().getLastSelected();

        if (selectedFiles.length < 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        } else if (selectedFiles.length > 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.common.file.limit'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var selectedFilename = selectedFile.get('filename');

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.file.title.rename'),
            message: message.msg('fs.hdfs.file.msg.rename.input'),
            width: 300,
            prompt: true,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            multiline: false,
            closable: false,
            value: selectedFilename,
            fn: function (btn, text) {
                // 입력한 이름 뒤에 공백 제거
                if (trim(text) == selectedFilename) return;

                if (btn == 'yes' && selectedFilename != text && !Ext.isEmpty(text)) {
                    var url = CONSTANTS.FS.HDFS_RENAME_FILE;
                    var params = {
                        srcPath: selectedFile.get('path'), // 현재 경로에 대한 권한 검사에 사용,
                        fullyQualifiedPath: selectedFile.get('id'), // 변경전 파일명 포함 전체 경로
                        filename: text //변경할 파일명
                    };

                    invokePostByMap(url, params, function (response) {
                        var obj = Ext.decode(response.responseText);

                        if (obj.success) {
                            me.updateFileStore(params.srcPath);
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
                    }, function () {
                        Ext.MessageBox.show({
                            title: message.msg('common.warning'),
                            message: format(message.msg('common.failure'), config['system.admin.email']),
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    });
                }
            }
        });
    },

    /**
     * 선택한 파일을 삭제한다.
     */
    onClickDeleteFile: function () {
        var me = this,
            node = me.getViewModel().get('node'),
            selectedFiles = this.getSelectedItemIds();

        // File Grid Panel에서 파일을 선택하지 않았을 경우
        if (selectedFiles.length == 0) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var fromItems = [];

        for (var i = 0; i < selectedFiles.length; i++) {
            fromItems[i] = selectedFiles[i].get('id');
        }

        Ext.MessageBox.show({
            title: message.msg('fs.hdfs.file.title.delete'),
            message: format(message.msg('fs.hdfs.file.msg.delete'), selectedFiles.length),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {

                    var progress = Ext.MessageBox.show({
                        title: 'Notification',
                        message: message.msg('fs.hdfs.file.msg.deleting'),
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        progress: true,
                        closable: true
                    });

                    var params = {
                        currentPath: node,
                        files: fromItems.join()
                    };

                    invokePostByMap(CONSTANTS.FS.HDFS_DELETE_FILE,
                        params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            progress.close();

                            if (obj.success) {
                                me.initFilter();
                                me.listLoad(node);

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

                            Ext.MessageBox.show({
                                title: message.msg('common.warning'),
                                message: format(message.msg('common.failure'), config['system.admin.email']),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    },

    /**
     * 선택한 파일의 상세 정보를 표시한다.
     */
    onClickFileInfo: function () {
        var selectedFiles = this.getSelectedItemIds();

        if (selectedFiles.length > 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.common.file.limit'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var refs = this.getReferences(),
            gridItem = refs.hdfsFilePanel;
        var selectedFile = gridItem.getSelectionModel().getLastSelected();
        var filePath = selectedFile.get('id');
        var url = CONSTANTS.FS.HDFS_GET_FILE_INFO;
        var params = {
            filePath: filePath
        };

        invokeGet(url, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    Ext.create('Flamingo.view.hdfsbrowser.property.HdfsPropertyWindow', {
                        title: message.msg('fs.hdfs.property.title.File'),
                        propertyData: obj.map
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
                Ext.MessageBox.show({
                    title: message.msg('common.warning'),
                    message: format(message.msg('common.failure'), config['system.admin.email']),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        )
    },

    /**
     * 선택한 경로에 파일을 업로드한다.
     */
    onClickUploadFile: function (event) {
        var me = this,
            refs = this.getReferences(),
            currentPath = me.getViewModel().get('node');

        Ext.create('Ext.window.Window', {
            title: message.msg('fs.hdfs.file.title.upload'),
            layout: 'fit',
            border: false,
            modal: true,
            closeAction: 'destroy',
            items: [{
                xtype: 'multiFileUploadPanel',
                uploadPath: currentPath,
                dropEvent: event
            }],
            listeners: {
                close: function () {
                    me.updateFileStore(currentPath);
                }
            }
        }).center().show();
    },

    /**
     * File Grid Panel에서 선택한 파일을 로컬로 다운로드한다(단일 파일만 가능).
     */
    onClickDownloadFile: function () {
        var selectedFiles = this.getSelectedItemIds();

        if (Ext.isEmpty(selectedFiles)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        if (selectedFiles.length > 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.common.file.limit'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        if (selectedFiles.length > config['file.download.max.size']) {
            Ext.MessageBox.show({
                title: message.msg('common.check'),
                message: format(message.msg('fs.hdfs.file.msg.download.max'), Ext.util.Format.fileSize(config['file.download.max.size'])),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var params = {
            srcPath: selectedFiles[0].get('path'), // 다운로드 할 파일이 위치한 경로
            fullyQualifiedPath: selectedFiles[0].get('id') // 다운로드 할 파일이 위치한 경로 (파일명 포함)
        };

        var dom = Ext.dom.Helper.append(document.body, {
                tag: 'iframe',
                id: 'testIframe' + new Date().getTime(),
                css: 'display:none;visibility:hidden;height:0px;',
                src: CONSTANTS.FS.HDFS_DOWNLOAD_FILE
                + "?srcPath=" + params.srcPath
                + "&fullyQualifiedPath=" + params.fullyQualifiedPath,
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
     * 선택한 파일의 내용을 지정된 크기만큼 페이지 단위로 보여준다.
     */
    onClickViewFile: function () {
        var selectedFiles = this.getSelectedItemIds();

        if (selectedFiles.length < 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        } else if (selectedFiles.length > 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.common.file.limit'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        if (selectedFiles[0].get('directory')) {
            info('확인', '디렉토리는 내용보기를 할 수 없습니다.');
            return;
        }

        var currentPath = selectedFiles[0].get('path');
        var filePath = selectedFiles[0].get('id');
        var fileSize = selectedFiles[0].get('length');
        var blockSize = selectedFiles[0].get('blockSize');
        var fileExtension = config['hdfs.viewFile.limit.type'];
        var extensionPattern = new RegExp(fileExtension, 'g');

        if (fileSize < 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.zeroFileSize'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        if (filePath.match(extensionPattern)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.viewFile'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var params = {
            currentPath: currentPath, // 파일이 위치한 경로
            filePath: filePath, // 파일이 위치한 경로 (파일명 포함)
            fileSize: fileSize, // 파일 크기
            dfsBlockSize: blockSize, // DFS Block Size
            currentContentsBlockSize: 0, // DFS Block Size
            chunkSizeToView: config['hdfs.viewFile.default.chunkSize'], // DEFAULT_CHUNK_SIZE = 10000
            startOffset: 0,
            totalPage: 0,
            dfsBlockStartOffset: 0,
            currentPage: 0,
            buttonType: 'defaultPage'
        };

        var progress = Ext.MessageBox.show({
            title: 'Notification',
            message: message.msg('fs.hdfs.file.msg.view'),
            width: 300,
            wait: true,
            waitConfig: {interval: 50},
            progress: true,
            closable: true
        });

        invokePostByMap(CONSTANTS.FS.HDFS_GET_DEFAULT_FILE_CONTENTS,
            params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                progress.close();

                if (obj.success) {
                    // 파일 내용 보기 창을 화면에 표시한다.
                    var x = window.innerWidth / 2 - 850 / 2;
                    var y = window.innerHeight / 2 - 550 / 2;
                    Ext.create('Flamingo.view.hdfsbrowser.viewer.FileViewerWindow', {
                        propertyData: obj.map,
                        emptyPageData: {
                            total: obj.map['totalPage'],
                            currentPage: obj.map['currentPage']
                        }
                    }).showAt(x, y);
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

                Ext.MessageBox.show({
                    title: message.msg('common.warning'),
                    message: format(message.msg('common.failure'), config['system.admin.email']),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
            }
        );
    },

    /**
     * 선택한 파일 들의 소유권 및 권한 정보를 수정한다.
     */
    onClickFilePermission: function () {
        var selectedFiles = this.getSelectedItemIds();

        if (selectedFiles.length < 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.file.msg.select'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var refs = this.getReferences(),
            gridItem = refs.hdfsFilePanel;
        var selectedFile = gridItem.getSelectionModel().getLastSelected();
        var filePath = selectedFile.get('id');

        if (filePath == '/' || filePath == 'root') {
            Ext.MessageBox.show({
                title: 'Notification',
                message: message.msg('fs.hdfs.directory.msg.permission.root'),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        // 단일 파일만 권한을 변경할 경우 파일의 권한 정보를 가져온다.
        if (selectedFiles.length == 1) {
            var url = CONSTANTS.FS.HDFS_GET_FILE_INFO;
            var params = {
                filePath: filePath
            };

            invokeGet(url, params,
                function (response) {
                    var obj = Ext.decode(response.responseText);

                    if (obj.success) {
                        Ext.create('Flamingo.view.hdfsbrowser.permission.HdfsPermissionWindow', {
                            record: selectedFiles[0],
                            permissionData: obj.map,
                            fileStatus: obj.map['isFile'],
                            height: 320,
                            listeners: {
                                beforerender: function () {
                                    var me = this;
                                    var refs = me.getReferences();

                                    refs.group.setStyle('margin-bottom', '10px');
                                    refs.otherCheckGroup.setStyle('margin-bottom', '15px');
                                    refs.recursiveOwner.setHidden(true);
                                    refs.recursivePermission.setHidden(true);
                                }
                            }
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
                    Ext.MessageBox.show({
                        title: message.msg('common.warning'),
                        message: format(message.msg('common.failure'), config['system.admin.email']),
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            )
        } else {
            Ext.create('Flamingo.view.hdfsbrowser.permission.HdfsPermissionWindow', {
                permissionData: selectedFiles.join(),
                fileStatus: true,
                height: 320,
                listeners: {
                    beforerender: function () {
                        var me = this;
                        var refs = me.getReferences();

                        refs.group.setStyle('margin-bottom', '10px');
                        refs.otherCheckGroup.setStyle('margin-bottom', '15px');
                        refs.recursiveOwner.setHidden(true);
                        refs.recursivePermission.setHidden(true);
                    }
                }
            }).show();
        }
    },

    /**
     * File 목록에서 파일을 마우스 우클릭 한 경우 Context Menu를 표시한다.
     */
    onFileItemContextMenu: function (grid, record, item, index, event) {
        var me = this;
        event.stopEvent();

        if (Ext.isEmpty(me.contextFileMenu)) {
            me.contextFileMenu = Ext.create('Flamingo.view.hdfsbrowser.context.File');
        }

        if (Ext.isEmpty(me.contextDirectoryMenu)) {
            me.contextDirectoryMenu = Ext.create('Flamingo.view.hdfsbrowser.context.Directory');
        }

        if (record.get('directory')) {
            me.contextDirectoryMenu.showAt(event.pageX - 5, event.pageY - 5);
        }
        else {
            me.contextFileMenu.showAt(event.pageX - 5, event.pageY - 5);
        }
    },

    /**
     * 파일 목록에서 선택한 모든 파일 목록을 반환한다.
     */
    getSelectedItemIds: function () {
        var refs = this.getReferences(),
            gridItem = refs.hdfsFilePanel;

        return gridItem.getSelectionModel().getSelection();
    },

    /**
     * 그리드 아이템 더블클릭 이벤트
     * 디렉토리일 경우 선택한 디렉토리로 이동한다.
     * */
    onListItemdblclick: function(grid, record, item) {
        var refs = this.getReferences();

        this.initFilter();

        if (record.get('directory')) {
            this.getViewModel().set('node', record.get('fullPath'));
            grid.getStore().getProxy().extraParams.node = record.get('fullPath');
            grid.getStore().load();
        }
    },

    /**
     * @private
     *
     * 파일브라우저 스토어를 load 한다.
     * */
    listLoad: function(node) {
        var me = this,
            refs = me.getReferences(),
            viewModel = me.getViewModel(),
            store = viewModel.getStore('listStore');

        viewModel.set('node', node);
        store.getProxy().extraParams.node = node;
        store.load({
            callback: function() {
                me.initInput();
            }
        });
    },

    treeLoad: function(node) {
        var me = this,
            refs = me.getReferences(),
            viewModel = me.getViewModel(),
            store = viewModel.getStore('treemap'),
            activeTab = refs.tab.getActiveTab();

        if (activeTab.xtype == 'hdfsTreemapPanel') {
            activeTab.setLoading(true);
        }

        viewModel.set('node', node);
        store.getProxy().extraParams.node = node;
        store.load({
            callback: function(records, operation) {
                if (activeTab.xtype == 'hdfsTreemapPanel') {
                    activeTab.setLoading(false);
                }

                var response = operation['_response'];
                var obj = Ext.decode(response.responseText);

                viewModel.getStore('treemaplegend').loadData(obj.map.legend);

                if (obj.map.max != null) {
                    refs.unit.setValue(obj.map.max.unit);
                    refs.max_value.setValue(obj.map.max.max_value);
                }
                else {
                    refs.unit.setValue('Byte');
                    refs.max_value.setValue('');
                }

            }
        });
    },

    /**
     * List 스토어가 로드된 이후 breadcrumb 을 위한 데이터를 생성한다.
     * */
    onListStoreLoad: function(store, records, successful, operation) {
        var viewModel = this.getViewModel(),
            node = operation.request.config.params.node,
            nodeArr = node.split('/'),
            fullyQualifiedPath = '',
            idx, value, data = [], isLast = false;

        for (idx in nodeArr) {
            value = nodeArr[idx];

            if (idx == nodeArr.length - 1) {
                isLast = true;
            }

            if (value == '' && idx == 0) {
                data.push({name: 'Root', isLast: isLast, fullyQualifiedPath: '/'});
            }
            else if (value != '' && idx > 0) {
                fullyQualifiedPath += '/' + value;
                data.push({name: value, isLast: isLast, fullyQualifiedPath: fullyQualifiedPath});
            }
        }

        var store = viewModel.getStore('breadcrumb');

        store.loadData(data);
    },

    /**
     * 접근권한 설정 페이지 변경완료 이벤트
     * */
    onPermissionChanged: function() {
        var node = this.getViewModel().get('node');
        this.initFilter();
        this.listLoad(node);
    },

    /**
     * @private
     *
     * 파일, 디렉토리 선택 여부 확인
     * */
    getListSelection: function() {
        var grid = this.getReferences().hdfsFilePanel,
            selection = grid.getSelectionModel().getSelection();

        if (selection.length == 0) {
            error('확인', '선택된 항목이 없습니다.');
            return null;
        }

        return selection;
    },

    /**
     * Breadcrumb Item클릭 이벤트
     * */
    breadcrumbItemclick: function(view, record, item, index) {
        var refs = this.getReferences();

        if (refs.tab) {
            if (refs.tab.getActiveTab().xtype == 'hdfsTreemapPanel') {
                this.treeLoad(record.get('fullyQualifiedPath'));
            }
            else {
                this.initFilter();
                this.listLoad(record.get('fullyQualifiedPath'));
            }
        }
        else {
            this.initFilter();
            this.listLoad(record.get('fullyQualifiedPath'));
        }

    },
    
    onRenameClick: function() {
        var me = this,
            selection = me.getListSelection();

        if (!selection) return;

        if (selection.length > 1) {
            info('확인', '이름변경할 항목을 1개만 선택하시오.');
            return;
        }

        var record = selection[0];

        if (record.get('directory')) {
            me.onClickRenameDirectory();
        }
        else {
            me.onClickRenameFile();
        }
    },

    onDeleteClick: function() {
        var me = this,
            selection = me.getListSelection();

        if (!selection) return;

        var record = selection[0];

        if (record.get('directory')) {
            me.onClickDeleteDirectory();
        }
        else {
            me.onClickDeleteFile();
        }
    },

    onPermissionClick: function() {
        var me = this,
            selection = me.getListSelection();

        if (!selection) return;

        //TODO 다중 파일 권한변경
        if (selection.length > 1) {
            info('확인', '권한변경할 항목을 1개만 선택하시오.');
            return;
        }

        var record = selection[0];

        if (record.get('directory')) {
            me.onClickDirectoryPermission();
        }
        else {
            me.onClickFilePermission();
        }
    },

    onTreemapdlbclick: function(data) {
        var me = this,
            refs = me.getReferences();

        me.treeLoad(data.fullyQualifiedPath);

        refs.treemap.removeAll();
    },

    onSaveMaxClick: function() {
        var me = this,
            refs = me.getReferences(),
            node = me.getViewModel().get('node'),
            maxValue = refs.max_value.getValue();

        if (Ext.isEmpty(maxValue)) {
            maxValue = null;
        }

        var params = {
            max_value: maxValue,
            unit: refs.unit.getValue(),
            path: me.getViewModel().get('node')
        }

        invokePostByMap(CONSTANTS.FS.HDFS_SAVE_MAX,
            params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    me.treeLoad(node);
                } else if (obj.error.cause) {
                    error('Notification', obj.error.cause);
                } else {
                    error('Notification', obj.error.message);
                }
            },
            function () {
                error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
            }
        );
    },

    onSimpleListItemdblclick: function(grid, record, item) {
        if (!record.get('directory')) {
            this.fireEvent('hdfsFileClose', record);
            this.getView().close();
        }
    },

    onSimpleOkClick: function() {
        var me = this,
            refs = me.getReferences(),
            grid = hdfsFilePanel,
            selection = grid.getSelectionModel().getSelection();

        this.fireEvent('simpleHdfsClose', selection[0]);
        this.getView().close();
    },

    onSimpleCancelClick: function() {
        this.getView().close();
    },

    onFilterClick: function () {
        var refs = this.getReferences(),
            value = refs.filter.getValue(),
            viewModel = this.getViewModel(),
            store = viewModel.getStore('listStore');

        if (Ext.isEmpty(value)) {
            info('확인', '검색할 문자열을 입력하시오.');
            return;
        }

        if (value.length < 2) {
            info('확인', '2글자 이상 입력해야 합니다.');
            return;
        }

        store.getProxy().extraParams.filter = value;

        this.listLoad(viewModel.get('node'));
    },

    onInputClick: function() {
        var refs = this.getReferences(),
            node = this.getViewModel().get('node');

        refs.breadcrumbView.setVisible(false);
        refs.inputField.setValue(node);
        refs.inputField.setVisible(true);
        refs.inputField.focus(true);
    },

    onInputKeydown: function(field, e) {
        if (e.keyCode == 13) {
            var me = this,
                refs = me.getReferences(),
                node = me.getViewModel().get('node'),
                value = field.getValue(),
                path = '', i;

            if (node == value) {
                me.initInput();
            }
            else {
                var params = {
                    path: value
                };
                invokeGet(CONSTANTS.FS.CHECK_FILEINFO,
                    params,
                    function (response) {
                        var obj = Ext.decode(response.responseText);

                        if (obj.success) {
                            if (obj.map.isFile) {
                                var splitArr = value.split('/');
                                for (i = 1; i < splitArr.length - 1; i++) {
                                    path += '/' + splitArr[i];
                                }
                            }
                            else {
                                path = value;
                            }

                            me.listLoad(path);
                        } else {
                            error('확인', '입력한 디렉토리 또는 파일정보를 확인할 수 없습니다.');
                        }
                    },
                    function () {
                        error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
                    }
                );
            }
        }
    },

    onInputBlur: function() {
        var refs = this.getReferences();
        refs.breadcrumbView.setVisible(true);
        refs.inputField.setVisible(false);
    },

    onDropfiles: function(e) {
        this.onClickUploadFile(e);
    },

    /**
     * @private
     * 필터를 초기화 한다.
     * */
    initFilter: function() {
        var store = this.getViewModel().getStore('listStore'),
            refs = this.getReferences();

        refs.filter.setValue('');
        store.getProxy().extraParams.filter = null;
    },

    /**
     * @private
     * */
    initInput: function() {
        var refs = this.getReferences();

        refs.breadcrumbView.setVisible(true);
        refs.inputField.setVisible(false);
    }
});
