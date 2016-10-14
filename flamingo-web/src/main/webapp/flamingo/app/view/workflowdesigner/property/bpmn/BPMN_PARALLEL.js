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
Ext.define('Flamingo.view.workflowdesigner.property.bpmn.BPMN_PARALLEL', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_SHELL',
    alias: 'widget.BPMN_PARALLEL',

    width: 600,
    height: 350,

    requires: [
        'Flamingo.view.workflowdesigner.property.bpmn.BPMN_controller',
        'Flamingo.view.workflowdesigner.property._ParallelGrid'
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
            xtype: 'form',
            hidden: true,
            items: [
                {
                    xtype: 'hidden',
                    name: 'sequenceData',
                    reference: 'sequenceData',
                    value: '',
                    allowBlank: true
                }
            ]
        }
    ],
    listeners: {
        afterrender: 'onBPMN_PARALLELafterrender'
    }
});