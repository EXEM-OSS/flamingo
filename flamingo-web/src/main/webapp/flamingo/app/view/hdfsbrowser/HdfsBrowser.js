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
    viewModel: {
        type: 'browserModel'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bodyStyle: {
        background: '#EAEAEA'
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
            minHeight: 400,
            margin: '0 20 0 20',
            flex: 1,
            title: 'HDFS File',
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
            }],
            items: [
                {
                    xtype: 'hdfsFilePanel',
                    title: 'File Browser',
                    reference: 'hdfsFilePanel'
                }
            ]
        }
    ]
});