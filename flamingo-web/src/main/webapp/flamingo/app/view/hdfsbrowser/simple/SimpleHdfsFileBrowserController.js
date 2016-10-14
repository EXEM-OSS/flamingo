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
Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.simpleHdfsFileBrowserController',

    /**
     * 디렉토리 및 파일 목록을 가져온다.
     */
    onAfterRender: function (view) {
        var me = this,
            listStore = me.getViewModel().getStore('listStore'),
            params = view.path ? {node: view.path} : {node: '/'};

        listStore.load({
            params: params
        });
    },

    /**
     * 디렉토리 패널에서 마우스 우클릭 이벤트를 처리한다.
     * @param tree
     * @param record
     * @param item
     * @param index
     * @param e
     */
    onTrpDirectoryItemcontextmenu: function (tree, record, item, index, e) {
        e.stopEvent();
    },

    /**
     * 디렉토리를 선택했을 때 파일 목록 정보를 업데이트한다.
     */
    onClickDirectoryItem: function (view, node) {
        var refs = this.getReferences();
        var fileStore = refs.hdfsFileGrid.getStore();

        fileStore.load({
            params: {
                node: node.data.id
            }
        });
    },

    /**
     * 선택한 파일 정보를 부모 뷰컨트롤러에 전달한다.
     */
    onBtnOkClick: function () {
        var refs = this.getReferences();
        var record = refs.hdfsFileGrid.getSelectionModel().getSelection()[0];

        if (Ext.isEmpty(record)) {
            Ext.MessageBox.show({
                title: '확인',
                text: 'OK',
                message: 'Please select a file.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }

        this.fireEvent('simpleHdfsClose', record);
        this.getView().close();
    },

    onBtnCancelClick: function () {
        this.getView().close();
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
     * 그리드 아이템 더블클릭 이벤트
     * 디렉토리일 경우 선택한 디렉토리로 이동한다.
     * */
    onListItemdblclick: function(grid, record, item) {
        if (record.get('directory')) {
            this.getViewModel().set('node', record.get('fullPath'));
            grid.getStore().getProxy().extraParams.node = record.get('fullPath');
            grid.getStore().load();
        }
        else {
            this.fireEvent('simpleHdfsClose', record);
            this.getView().close();
        }
    },

    /**
     * Breadcrumb Item클릭 이벤트
     * */
    breadcrumbItemclick: function(view, record, item, index) {
        this.listLoad(record.get('fullyQualifiedPath'));
    },

    /**
     * @private
     *
     * 파일브라우저 스토어를 load 한다.
     * */
    listLoad: function(node) {
        var me = this,
            viewModel = me.getViewModel(),
            store = viewModel.getStore('listStore');
        viewModel.set('node', node);
        store.getProxy().extraParams.node = node;
        store.load();
    },

    /**
     * 선택한 파일의 내용을 지정된 크기만큼 페이지 단위로 보여준다.
     */
    onClickViewFile: function () {
        var refs = this.getReferences();
        var selectedFiles = refs.hdfsFileGrid.getSelectionModel().getSelection();

        if (selectedFiles.length < 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: 'Please select a file.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        } else if (selectedFiles.length > 1) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: 'Please select one file.',
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
                message: 'File contents does not exist.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        if (filePath.match(extensionPattern)) {
            Ext.MessageBox.show({
                title: 'Notification',
                message: 'Cannot preview binary or compressed files.',
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
            message: 'Loading file..',
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

                error('Warning', 'Please contact system admin')
            }
        );
    }
});