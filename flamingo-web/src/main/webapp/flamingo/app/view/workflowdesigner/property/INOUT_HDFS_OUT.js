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
/**
 * HDFS Output Property View
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property._NODE_INOUT
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property.INOUT_HDFS_OUT', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_INOUT',
    alias: 'widget.INOUT_HDFS_OUT',

    requires: [
        'Flamingo.view.workflowdesigner.property._DelimiterSelCmbField',
        'Flamingo.view.workflowdesigner.property._CompressSelCmbField',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._MetaBrowserField',
        'Flamingo.view.workflowdesigner.property._ColumnGrid'
    ],

    items: [
        {
            title: 'Path Information',
            xtype: 'form',
            border: false,
            autoScroll: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Output Path',
                    defaultType: 'textfield',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 100
                    },
                    items: [
                        {
                            name: 'outputPathQualifier',
                            fieldLabel: 'Identifier',
                            readOnly: true
                        },
                        {
                            xtype: '_browserField',
                            name: 'outputPath'
                        },
                        {
                            xtype: '_delimiterSelCmbField',
                            readOnly: true
                        }
                    ]
                }
                /*
                 ,
                 {
                 xtype      : 'fieldset',
                 title      : '기타 설정',
                 defaultType: 'textfield',
                 defaults   : {
                 anchor    : '100%',
                 labelWidth: 100
                 },
                 items      : [
                 {
                 xtype: '_compressSelCmbField'
                 }
                 ]
                 }
                 */
            ]
        },
        {
            title: 'Column information',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: '_columnGrid',
                    flex: 1,
                    readOnly: true
                }
            ]
        }
    ]
});