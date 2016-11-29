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
Ext.define('Flamingo.view.hdfsbrowser.viewer.FileViewerForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fileViewerForm',
    requires: [
        'Flamingo.view.editor.AbstractEditor'
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
                                tooltip: 'First Page',
                                handler: 'onFirstPageButtonClick'
                            },
                            {
                                iconCls: 'x-tbar-page-prev',
                                reference: 'prevButton',
                                disabled: true,
                                tooltip: 'Previous Page',
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
                                tooltip: 'Next Page',
                                handler: 'onNextPageButtonClick'
                            },
                            {
                                iconCls: 'x-tbar-page-last',
                                reference: 'lastButton',
                                disabled: false,
                                tooltip: 'Last Page',
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
                                tooltip: 'Start Offset',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'dfsBlockStartOffset',
                                name: 'dfsBlockStartOffset',
                                labelWidth: 70,
                                tooltip: 'DFS Block Start Offset',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'chunkSizeToView',
                                name: 'chunkSizeToView',
                                labelWidth: 50,
                                tooltip: 'Chunk size to view',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'filePath',
                                name: 'filePath',
                                labelWidth: 50,
                                tooltip: 'HDFS File Path',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'fileSize',
                                name: 'fileSize',
                                labelWidth: 50,
                                tooltip: 'HDFS File Size',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'dfsBlockSize',
                                name: 'dfsBlockSize',
                                labelWidth: 50,
                                tooltip: 'HDFS Block Size',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'numberfield',
                                reference: 'totalPage',
                                name: 'totalPage',
                                value: 'totalPage',
                                labelWidth: 50,
                                tooltip: 'HDFS File Total Page',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'bestNode',
                                name: 'bestNode',
                                labelWidth: 50,
                                tooltip: 'Best Node Information',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'currentContentsBlockSize',
                                name: 'currentContentsBlockSize',
                                labelWidth: 50,
                                tooltip: 'Block size consists of current page',
                                labelAlign: 'right',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'lastDfsBlockSize',
                                name: 'lastDfsBlockSize',
                                labelWidth: 50,
                                tooltip: 'Last DFS Block Size',
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
