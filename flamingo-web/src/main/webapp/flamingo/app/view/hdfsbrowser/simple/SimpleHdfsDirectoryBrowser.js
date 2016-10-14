/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsDirectoryBrowser', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.simple.SimpleHdfsDirectoryBrowserController',
        'Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowserModel'
    ],

    config: {
        /**
         * @cfg {String} closeEvent
         * 'OK' 버튼클릭 시 부모 View로 발생하는 이벤트 명
         */
        beforeCloseEvent: 'simpleHdfsBeforeOk',
        /**
         * @cfg {String} closeEvent
         * 'OK' 버튼클릭 시 부모 View로 발생하는 이벤트 명
         */
        closeEvent: 'hdfsclose',
        /**
         * @cfg {String} closeEvent
         * Disable처리를 해야하는 Node의 record
         */
        disableRecord: null
    },

    controller: 'simpleHdfsDirectoryBrowserController',

    viewModel: {
        type: 'simpleHdfsBrowserModel'
    },

    title: 'HDFS Browser',
    height: 400,
    width: 400,
    layout: 'fit',
    modal: true,
    closeAction: 'destroy',

    items: [
        {
            xtype: 'treepanel',
            reference: 'trpDirectory',
            bind: {
                store: '{directoryStore}'
            },
            border: false
        }
    ],
    buttonAlign: 'center',
    buttons: [
        {
            text: 'OK',
            iconCls: 'common-ok',
            handler: 'onOkClick'
        },
        {
            text: 'Cancel',
            iconCls: 'common-cancel',
            handler: 'onCancelClick'
        }
    ],
    listeners: {
        afterrender: 'onAfterRender',
        containercontextmenu: function (tree, event) {
            event.stopEvent();
        }
    }
});