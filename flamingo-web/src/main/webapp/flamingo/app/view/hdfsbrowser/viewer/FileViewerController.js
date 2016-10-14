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
Ext.define('Flamingo.view.hdfsbrowser.viewer.FileViewerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileViewerViewController',

    /**
     * File Viewer 창을 화면에 표시한 후 서버로부터 전달된 파일 내용을 화면에 표시한다.
     *
     * @param window File Viewer 창
     */
    onAfterRender: function (window) {
        var me = this;
        var refs = me.getReferences();
        var totalPage = window.propertyData.totalPage;

        refs.fileViewerContentsForm.getForm().setValues(window.propertyData);

        /**
         * 전체 페이지 범위가 1일 때 Next Button과 Last Button을 비활성화 한다.
         */
        if (window.propertyData.totalPage == window.propertyData.currentPage) {
            refs.nextButton.setDisabled(true);
            refs.lastButton.setDisabled(true);
        }

        // Total Page 크기에 따라 input number field width 조정.
        if (totalPage > 0 && totalPage < 100) {
            refs.currentPage.width = 30;
        } else if (totalPage > 100 && totalPage < 1000) {
            refs.currentPage.width = 35;
        } else if (totalPage > 1000 && totalPage < 10000) {
            refs.currentPage.width = 40;
        } else if (totalPage > 10000 && totalPage < 100000) {
            refs.currentPage.width = 45;
        } else if (totalPage > 100000 && totalPage < 1000000) {
            refs.currentPage.width = 55;
        } else {
            refs.currentPage.width = 60;
        }
    },

    /**
     * 첫 시작 페이지로 이동한다.
     */
    onFirstPageButtonClick: function () {
        var me = this;
        var refs = me.getReferences();
        var contentsFormValues = refs.fileViewerContentsForm.getForm().getValues();
        var url = CONSTANTS.FS.HDFS_GET_FILE_CONTENTS;
        var params = {
            filePath: contentsFormValues.filePath,
            fileSize: contentsFormValues.fileSize,
            dfsBlockSize: contentsFormValues.dfsBlockSize,
            chunkSizeToView: config['hdfs.viewFile.default.chunkSize'],
            startOffset: 0,
            dfsBlockStartOffset: 0,
            currentContentsBlockSize: 0,
            lastDfsBlockSize: 0,
            currentPage: 0,
            totalPage: contentsFormValues.totalPage,
            buttonType: 'firstButton',
            bestNode: contentsFormValues.bestNode
        };

        invokePostByMap(url, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    refs.fileViewerContentsForm.getForm().setValues(obj.map);
                    refs.queryEditor.setValue(obj.map.contents);
                    refs.currentPage.setValue(obj.map['currentPage']);

                    /**
                     * Case 1. 현재 페이지가 1일 때 Fist & Previous Button 비활성화
                     * Case 2. 현재 페이지와 전체 페이지 범위가 같을 때 Next Button 비활성화
                     * Case 3. 현재 페이지가 1보다 클 때 Previous Button 활성화
                     */
                    if (refs.currentPage.getValue() == 1) {
                        refs.firstButton.setDisabled(true);
                        refs.prevButton.setDisabled(true);
                        refs.nextButton.setDisabled(false);
                        refs.lastButton.setDisabled(false);
                    }
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    /**
     * 이전 페이지로 이동한다.
     */
    onPreviousPageButtonClick: function () {
        var me = this;
        var refs = me.getReferences();
        var viewItems = me.getView();
        var contentsFormValues = refs.fileViewerContentsForm.getForm().getValues();
        var url = CONSTANTS.FS.HDFS_GET_FILE_CONTENTS;
        var params = {
            filePath: contentsFormValues.filePath,
            fileSize: contentsFormValues.fileSize,
            dfsBlockSize: contentsFormValues.dfsBlockSize,
            chunkSizeToView: config['hdfs.viewFile.default.chunkSize'],
            startOffset: contentsFormValues.startOffset,
            dfsBlockStartOffset: contentsFormValues.dfsBlockStartOffset,
            currentContentsBlockSize: contentsFormValues.currentContentsBlockSize,
            lastDfsBlockSize: contentsFormValues.lastDfsBlockSize,
            currentPage: refs.currentPage.getValue(),
            totalPage: contentsFormValues.totalPage,
            buttonType: 'prevButton',
            bestNode: contentsFormValues.bestNode
        };

        me.pageButtonStatus(true);

        invokePostByMap(url, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    me.pageButtonStatus(false);
                    refs.fileViewerContentsForm.getForm().setValues(obj.map);
                    refs.queryEditor.setValue(obj.map.contents);
                    refs.currentPage.setValue(obj.map['currentPage']);

                    /**
                     * Case 1. 현재 페이지가 1일 때 Fist & Previous Button 비활성화
                     * Case 2. 현재 페이지와 전체 페이지 범위보다 적을 때 Next & Last Button 비활성화
                     * Case 3. 현재 페이지가 1보다 클 때 Previous Button 활성화
                     * Case 4. 현재 페이지와 전체 페이지 범위가 같을 때 Previous Button 비활성화
                     */
                    if (refs.currentPage.getValue() == 1) {
                        refs.firstButton.setDisabled(true);
                        refs.prevButton.setDisabled(true);
                    } else if (refs.currentPage.getValue() < viewItems.emptyPageData.total) {
                        refs.nextButton.setDisabled(false);
                        refs.lastButton.setDisabled(false);
                    } else {
                        refs.prevButton.setDisabled(false);
                    }
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    /**
     * 다음 페이지로 이동한다.
     */
    onNextPageButtonClick: function () {
        var me = this;
        var refs = me.getReferences();
        var contentsFormValues = refs.fileViewerContentsForm.getForm().getValues();
        var totalPage = contentsFormValues.totalPage;
        var url = CONSTANTS.FS.HDFS_GET_FILE_CONTENTS;

        var params = {
            filePath: contentsFormValues.filePath,
            fileSize: contentsFormValues.fileSize,
            dfsBlockSize: contentsFormValues.dfsBlockSize,
            chunkSizeToView: config['hdfs.viewFile.default.chunkSize'],
            startOffset: contentsFormValues.startOffset,
            dfsBlockStartOffset: contentsFormValues.dfsBlockStartOffset,
            currentContentsBlockSize: contentsFormValues.currentContentsBlockSize,
            startOffsetPerDfsBlocks: contentsFormValues.startOffsetPerDfsBlocks,
            lastDfsBlockSize: contentsFormValues.lastDfsBlockSize,
            currentPage: refs.currentPage.getValue(),
            totalPage: contentsFormValues.totalPage,
            buttonType: 'nextButton',
            bestNode: contentsFormValues.bestNode
        };

        me.pageButtonStatus(true);

        invokePostByMap(url, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    me.pageButtonStatus(false);
                    refs.fileViewerContentsForm.getForm().setValues(obj.map);
                    refs.queryEditor.setValue(obj.map.contents);
                    refs.currentPage.setValue(obj.map['currentPage']);

                    // Case 1. 현재 페이지가 1보다 클 때 First & Previous Button 활성화
                    if (refs.currentPage.getValue() > 1) {
                        refs.firstButton.setDisabled(false);
                        refs.prevButton.setDisabled(false);
                    }

                    // Case 2. 현재 페이지와 전체 페이지 범위가 같을 때 Next & Last Button 비활성화
                    if (refs.currentPage.getValue() == totalPage) {
                        refs.nextButton.setDisabled(true);
                        refs.lastButton.setDisabled(true);
                    }
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    /**
     * 마지막 페이지로 이동한다.
     */
    onLastPageButtonClick: function () {
        var me = this;
        var refs = me.getReferences();
        var contentsFormValues = refs.fileViewerContentsForm.getForm().getValues();
        var url = CONSTANTS.FS.HDFS_GET_FILE_CONTENTS;
        var totalPage = contentsFormValues.totalPage;
        var params = {
            filePath: contentsFormValues.filePath,
            fileSize: contentsFormValues.fileSize,
            dfsBlockSize: contentsFormValues.dfsBlockSize,
            chunkSizeToView: config['hdfs.viewFile.default.chunkSize'],
            startOffset: 0,
            dfsBlockStartOffset: contentsFormValues.dfsBlockStartOffset,
            currentContentsBlockSize: contentsFormValues.currentContentsBlockSize,
            lastDfsBlockSize: contentsFormValues.lastDfsBlockSize,
            currentPage: refs.currentPage.getValue(),
            totalPage: totalPage,
            buttonType: 'lastButton',
            bestNode: contentsFormValues.bestNode
        };

        invokePostByMap(url, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    refs.fileViewerContentsForm.getForm().setValues(obj.map);
                    refs.queryEditor.setValue(obj.map.contents);
                    refs.currentPage.setValue(obj.map['currentPage']);

                    // Case 1. 마지막 페이지 일 때 Next & Last Button 비활성화, First & Previous Button 활성화
                    if (refs.currentPage.getValue() == totalPage) {
                        refs.firstButton.setDisabled(false);
                        refs.prevButton.setDisabled(false);
                        refs.nextButton.setDisabled(true);
                        refs.lastButton.setDisabled(true);
                    }
                }
            },
            function () {
                error('Error', 'Please contact system admin');
            }
        );
    },

    /**
     * 입력한 페이지로 이동한다. //NIA
     */
    onEnterCustomPage: function (field, e, eOpts) {
        if (e.keyCode == 13) {
            var me = this;
            var refs = me.getReferences();
            var contentsFormValues = refs.fileViewerContentsForm.getForm().getValues();
            var totalPage = contentsFormValues.totalPage;
            var currentPage = refs.currentPage.getValue();

            if (currentPage < 1 || currentPage > totalPage) {
                return false;
            }

            if (totalPage == 1) {
                return false;
            }

            var url = CONSTANTS.FS.HDFS_GET_FILE_CONTENTS;
            var params = {
                filePath: contentsFormValues.filePath,
                fileSize: contentsFormValues.fileSize,
                dfsBlockSize: contentsFormValues.dfsBlockSize,
                chunkSizeToView: config['hdfs.viewFile.default.chunkSize'],
                startOffset: 0, // Service Side에서 Page 정보로 startOffset 결정
                dfsBlockStartOffset: contentsFormValues.dfsBlockStartOffset,
                currentContentsBlockSize: contentsFormValues.currentContentsBlockSize,
                startOffsetPerDfsBlocks: contentsFormValues.startOffsetPerDfsBlocks,
                lastDfsBlockSize: contentsFormValues.lastDfsBlockSize,
                currentPage: currentPage,
                totalPage: contentsFormValues.totalPage,
                buttonType: 'customPage',
                bestNode: contentsFormValues.bestNode
            };

            invokePostByMap(url, params,
                function (response) {
                    var obj = Ext.decode(response.responseText);

                    if (obj.success) {
                        refs.fileViewerContentsForm.getForm().setValues(obj.map);
                        refs.queryEditor.setValue(obj.map.contents);
                        refs.currentPage.setValue(obj.map['currentPage']);
                        var updatedCurrentPage = refs.currentPage.getValue();

                        // Case 1. 현재 페이지가 1보다 클 때 First & Previous Button 활성화
                        if (updatedCurrentPage == 1) {
                            refs.firstButton.setDisabled(true);
                            refs.prevButton.setDisabled(true);
                            refs.nextButton.setDisabled(false);
                            refs.lastButton.setDisabled(false)
                        } else if (updatedCurrentPage > 1 && updatedCurrentPage != totalPage) {
                            refs.firstButton.setDisabled(false);
                            refs.prevButton.setDisabled(false);
                            refs.nextButton.setDisabled(false);
                            refs.lastButton.setDisabled(false)
                        } else if (updatedCurrentPage == totalPage) {
                            refs.firstButton.setDisabled(false);
                            refs.prevButton.setDisabled(false);
                            refs.nextButton.setDisabled(true);
                            refs.lastButton.setDisabled(true)
                        } else {
                            refs.nextButton.setDisabled(true);
                            refs.lastButton.setDisabled(true)
                        }
                    }
                },
                function () {
                    error('Error', 'Please contact system admin');
                }
            );
        }
    },

    /**
     * 비활성된 페이지 버튼을 활성화 시킨다.
     *
     * @param value
     */
    pageButtonStatus: function (value) {
        var me = this;
        var refs = me.getReferences();

        refs.firstButton.setDisabled(value);
        refs.prevButton.setDisabled(value);
        refs.nextButton.setDisabled(value);
        refs.lastButton.setDisabled(value);
    }
});