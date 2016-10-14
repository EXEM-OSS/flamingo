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
Ext.define('Flamingo.view.workflowdesigner.property.bpmn.BPMN_INCLUSIVE_FORK', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_SHELL',
    alias: 'widget.BPMN_INCLUSIVE_FORK',

    width: 850,
    height: 550,

    requires: [
        'Flamingo.view.workflowdesigner.property.bpmn.BPMN_controller',
        'Flamingo.view.workflowdesigner.property._InclusiveGrid',
        'Flamingo.view.workflowdesigner.property._ParallelGrid',
        'Flamingo.view.workflowdesigner.property._NodeValueGrid',
        'Flamingo.view.workflowdesigner.editor.WorkEditor'
    ],

    controller: 'designer.bpmn_controller',

    items: [
        {
            title: 'Parallel Processing Options',
            xtype: '_parallelGrid',
            reference: '_parallelGrid'
        },
        {
            mainform: null,
            title: 'Create conditions',
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
                    xtype: 'hidden',
                    name: 'sequenceData',
                    reference: 'sequenceData',
                    value: '',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    name: 'conditions',
                    reference: 'conditions',
                    value: '',
                    allowBlank: true
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: '_inclusiveGrid',
                            title: 'Selectable flow',
                            reference: '_inclusiveGrid',
                            flex: 1,
                            margin: '0 5 5 0',
                            listeners: {
                                select: 'onInclusiveGridSelect'
                            }
                        },
                        {
                            xtype: '_nodeValueGrid',
                            title: 'Workflow Variable',
                            flex: 1,
                            margin: '0 0 5 0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            search: 'variable',
                            editor: 'BPMN_INCLUSIVE_FORK [name=json]'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Conditions scripting (Javascript)',
                    flex: 2,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            itemId: 'json',
                            name: 'json',
                            xtype: 'workflowEditor',
                            reference: 'workflowEditor',
                            forceFit: true,
                            layout: 'fit',
                            flex: 5,
                            theme: 'eclipse',
                            printMargin: true,
                            parser: 'javascript',
                            closable: false,
                            value: ''
                        }
                    ]
                }

            ]
        }
    ],
    listeners: {
        afterrender: 'onINCLUSIVE_FORKafterrender'
    }
});