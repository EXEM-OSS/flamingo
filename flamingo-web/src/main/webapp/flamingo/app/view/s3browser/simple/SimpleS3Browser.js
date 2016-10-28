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
Ext.define('Flamingo.view.s3browser.simple.SimpleS3Browser', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.toolbar.Breadcrumb',
        'Flamingo.view.s3browser.simple.SimpleObject',
        'Flamingo.view.s3browser.simple.SimpleS3BrowserModel',
        'Flamingo.view.s3browser.simple.SimpleS3BrowserController'
    ],

    config: {
        /**
         * @cfg {String} closeEvent
         * 'OK' 버튼클릭 시 부모 View로 발생하는 이벤트 명
         */
        beforeCloseEvent: 'simpleS3BeforeOk',
        /**
         * @cfg {String} closeEvent
         * 'OK' 버튼클릭 시 부모 View로 발생하는 이벤트 명
         */
        closeEvent: 's3close'
    },

    controller: 'simpleS3BrowserController',

    viewModel: {
        type: 'simpleS3BrowserModel'
    },

    title: 'S3 Browser',
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

    items: [
        {
            xtype: 'panel',
            minHeight: 400,
            margin: '0 20 0 20',
            flex: 1,
            border: false,
            layout: 'fit',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                style: {
                    background: '#FFFFFF'
                },
                items: [
                    {
                        xtype: 'dataview',
                        reference: 'breadcrumbView',
                        bind: {
                            store: '{breadcrumb}'
                        },
                        itemSelector: 'li',
                        overItemCls: 'breadcrumb-over',
                        trackOver: true,
                        border: 1,
                        tpl: [
                            '<ol class="breadcrumb">',
                            '   <tpl for=".">',
                            '       <tpl if="!isLast">',
                            '           <li><a>{name}</a></li>',
                            '       </tpl>',
                            '       <tpl if="isLast">',
                            '           <li class="active"><a>{name}</a></li>',
                            '       </tpl>',
                            '   </tpl>',
                            '</ol>'
                        ],
                        listeners: {
                            itemclick: 'breadcrumbItemclick'
                        }
                    }
                ]
            }],
            items: [
                {
                    xtype: 'simpleObjectPanel',
                    reference: 'simpleObjectPanel'
                }
            ]
        }
    ],

    buttons: [
        {
            text: 'OK',
            handler: 'onOkClick'
        },
        {
            text: 'Cancel',
            handler: 'onCancelClick'
        }
    ]
});