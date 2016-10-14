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
Ext.define('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowser', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.HdfsBrowserController',
        'Flamingo.view.hdfsbrowser.HdfsBrowserModel',
        'Flamingo.view.hdfsbrowser.information.HdfsInformation',
        'Flamingo.view.hdfsbrowser.Directory',
        'Flamingo.view.hdfsbrowser.File',
        'Flamingo.view.hdfsbrowser.Treemap',
        'Flamingo.view.hdfsbrowser.context.Directory',
        'Flamingo.view.hdfsbrowser.context.File',
        'FEM.model.filesystem.hdfs.TreemapLegend'
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

    controller: 'browserViewController',
    viewModel: {
        type: 'browserModel'
    },

    title: 'HDFS Browser',
    height: 600,
    width: 800,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bodyStyle: {
        background: '#ffffff'
    },
    border: false,
    flex: 1,
    margin: '0 5',
    modal: true,
    buttons: [{
        text: '확인',
        handler: 'onSimpleOkClick'
    },{
        text: '취소',
        handler: 'onSimpleCancelClick'
    }],
    items: [
        {
            xtype: 'panel',
            minHeight: 400,
            flex: 1,
            border: false,
            layout: 'fit',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                style: {
                    background: '#FFFFFF'
                },
                items: [{
                    xtype: 'dataview',
                    bind: {
                        store: '{breadcrumb}'
                    },
                    itemSelector: 'li',
                    overItemCls: 'breadcrumb-over',
                    trackOver: true,
                    tpl: [
                        '<ol class="breadcrumb">',
                        '<tpl for=".">',
                        '<tpl if="!isLast">',
                        '<li><a>{name}</a></li>',
                        '</tpl>',
                        '<tpl if="isLast">',
                        '<li class="active"><a>{name}</a></li>',
                        '</tpl>',
                        '</tpl>',
                        '</ol>'
                    ],
                    listeners: {
                        itemclick: 'breadcrumbItemclick'
                    }
                }]
            }],
            items: [
                {
                    xtype: 'hdfsFilePanel',
                    reference: 'hdfsFilePanel',
                    listeners: {
                        itemdblclick: 'onSimpleListItemdblclick'
                    }
                }
            ]
        }
    ]
});