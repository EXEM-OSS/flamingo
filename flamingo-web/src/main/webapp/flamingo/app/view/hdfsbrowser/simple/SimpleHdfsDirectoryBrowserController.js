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
Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsDirectoryBrowserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.simpleHdfsDirectoryBrowserController',

    /**
     * 디렉토리 트리를 화면에 표시한 후 서버에서 디렉토리 목록을 가져온다.
     */
    onAfterRender: function () {
        var me = this;
        var directoryStore = me.getViewModel().getStore('directoryStore');

        directoryStore.load({
            callback: function () {
                directoryStore.getRootNode().expand();
            }
        });
    },

    /**
     * 디렉토리 목록에서 선택한 노드 정보를 부모 뷰컨트롤러로 전달한다.
     */
    onOkClick: function () {
        var me = this;
        var refs = me.getReferences();
        var record = refs.trpDirectory.getSelectionModel().getSelection()[0];

        if (me.fireEvent(me.getView().getBeforeCloseEvent(), me.getView(), record) != false) {
            me.fireEvent('simpleHdfsClose', record);
            me.getView().close();
        }
    },

    /**
     * HDFS 디렉토리 브라우저를 종료한다.
     */
    onCancelClick: function () {
        this.getView().close();
    }
});