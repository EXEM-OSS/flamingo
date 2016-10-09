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