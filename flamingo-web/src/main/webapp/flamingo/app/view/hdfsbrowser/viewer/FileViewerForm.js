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
Ext.define('Flamingo.view.hdfsbrowser.viewer.FileViewerForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fileViewerForm',
    requires: [
        'FEM.component.editor.AbstractEditor'
    ],

    reference: 'fileViewerContentsForm',

    bodyBorder: false,
    bodyStyle: {
        background: '#FFFFFF'
    },
    layout: 'fit',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                layout: 'fit',
                items: [
                    {
                        xtype: 'abstractEditor',
                        height: 513,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        reference: 'queryEditor',
                        parser: 'plain_text',
                        forceFit: true,
                        theme: 'eclipse',
                        printMargin: false,
                        readOnly: true,
                        value: me.up().propertyData.contents
                    }
                ],
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        padding: '5 5',
                        reference: 'fileViewerDockedItem',
                        items: [
                            '->',
                            {
                                iconCls: 'x-tbar-page-first',
                                reference: 'firstButton',
                                disabled: true,
                                tooltip: message.msg('fs.hdfs.viewer.window.firstButton.tip'),
                                handler: 'onFirstPageButtonClick'
                            },
                            {
                                iconCls: 'x-tbar-page-prev',
                                reference: 'prevButton',
                                disabled: true,
                                tooltip: message.msg('fs.hdfs.viewer.window.prevButton.tip'),
                                handler: 'onPreviousPageButtonClick'
                            },
                            {
                                xtype: 'numberfield',
                                reference: 'currentPage',
                                name: me.up().emptyPageData.currentPage,
                                value: me.up().emptyPageData.currentPage,
                                cls: Ext.baseCSSPrefix + 'tbar-page-number',
                                fieldStyle: 'text-align: center;',
                                allowDecimals: false,
                                minValue: 1,
                                maxValue: me.up().emptyPageData.total,
                                hideTrigger: true,
                                keyNavEnabled: false,
                                selectOnFocus: true,
                                submitValue: false,
                                isFormField: false,
                                width: 25,
                                grow: true,
                                margins: '-1 2 3 2',
                                listeners: {
                                    specialkey: 'onEnterCustomPage'
                                }
                            },
                            {
                                xtype: 'tbtext',
                                itemId: 'afterTextItem',
                                text: Ext.String.format(me.up().afterPageText, me.up().emptyPageData.total)
                            },
                            {
                                iconCls: 'x-tbar-page-next',
                                reference: 'nextButton',
                                disabled: false,
                                tooltip: message.msg('fs.hdfs.viewer.window.nextButton.tip'),
                                handler: 'onNextPageButtonClick'
                            },
                            {
                                iconCls: 'x-tbar-page-last',
                                reference: 'lastButton',
                                disabled: false,
                                tooltip: message.msg('fs.hdfs.viewer.window.lastButton.tip'),
                                handler: 'onLastPageButtonClick'
                            },
                            {
                                xtype: 'tbfill'
                            },
                            {
                                xtype: 'textfield',
                                reference: 'startOffset',
                                name: 'startOffset',
                                labelWidth: 70,
                                tooltip: message.msg('fs.hdfs.viewer.window.startOffset.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'dfsBlockStartOffset',
                                name: 'dfsBlockStartOffset',
                                labelWidth: 70,
                                tooltip: message.msg('fs.hdfs.viewer.window.dfsBlockStartOffset.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'chunkSizeToView',
                                name: 'chunkSizeToView',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.chunkSizeToView.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'filePath',
                                name: 'filePath',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.filePath.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'fileSize',
                                name: 'fileSize',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.fileSize.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'dfsBlockSize',
                                name: 'dfsBlockSize',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.blockSize.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'numberfield',
                                reference: 'totalPage',
                                name: 'totalPage',
                                value: 'totalPage',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.totalPage.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'bestNode',
                                name: 'bestNode',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.bestNode.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'currentContentsBlockSize',
                                name: 'currentContentsBlockSize',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.currentContentsBlockSize.tip'),
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'lastDfsBlockSize',
                                name: 'lastDfsBlockSize',
                                labelWidth: 50,
                                tooltip: message.msg('fs.hdfs.viewer.window.lastDfsBlockSize.tip'),
                                labelAlign: 'right',
                                hidden: true
                            }
                        ]
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});
