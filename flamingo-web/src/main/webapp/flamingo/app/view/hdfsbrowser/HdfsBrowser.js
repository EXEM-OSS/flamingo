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
Ext.define('Flamingo.view.hdfsbrowser.HdfsBrowser', {
    extend: 'Ext.panel.Panel',
    xtype: 'hdfsbrowser',

    requires: [
        'Flamingo.view.hdfsbrowser.HdfsBrowserController',
        'Flamingo.view.hdfsbrowser.HdfsBrowserModel',
        'Flamingo.view.hdfsbrowser.information.HdfsInformation',
        'Flamingo.view.hdfsbrowser.Directory',
        'Flamingo.view.hdfsbrowser.File',
        'Flamingo.view.hdfsbrowser.context.Directory',
        'Flamingo.view.hdfsbrowser.context.File',
        'Flamingo.view.hdfsbrowser.MultiFileUpload'
    ],

    controller: 'browserViewController',
    viewModel: 'browserModel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bodyStyle: {
        background: '#dcdcdc'
    },

    defaults: {
        frame: true
    },

    items: [
        {
            xtype: 'component',
            height: 60,
            style: {
                background: '#FFFFFF'
            },
            html: '<h2 style="padding: 0; margin:22px 0 0 30px;">HDFS Browser</h2>',
            margin: '0 0 20 0'
        },
        {
            xtype: 'panel',
            margin: '0 20 0 20',
            title: 'Directory Navigation',
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
                },{
                    xtype: 'textfield',
                    reference: 'inputField',
                    enableKeyEvents: true,
                    focusable: true,
                    hidden: true,
                    width: 300,
                    margin: '0 0 3 0',
                    listeners: {
                        keydown: 'onInputKeydown',
                        blur: 'onInputBlur'
                    }
                },'->',{
                    xtype: 'button',
                    iconCls: 'fa fa-terminal fa-lg',
                    handler: 'onInputClick'
                }]
            }]
        },
        {
            xtype: 'hdfsFilePanel',
            margin: '10 20 0 20',
            minHeight: 400,
            flex: 1,
            title: 'File Browser',
            reference: 'hdfsFilePanel'
        }
    ]
});