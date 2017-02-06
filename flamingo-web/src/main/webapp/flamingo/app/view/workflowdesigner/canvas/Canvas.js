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
Ext.ns('Flamingo.view.workflowdesigner.shape');
Ext.ns('Flamingo.view.workflowdesigner.shape.ankus');
Ext.ns('Flamingo.view.workflowdesigner.shape.bpmn');
Ext.ns('Flamingo.view.workflowdesigner.shape.etl');
Ext.ns('Flamingo.view.workflowdesigner.shape.giraph');
Ext.ns('Flamingo.view.workflowdesigner.shape.mahout');
Ext.ns('Flamingo.view.workflowdesigner.shape.rules');
Ext.ns('Flamingo.view.workflowdesigner.shape.gis');

/**
 * Workflow Designer의 각 모듈과 서버 사이드에 정의된 모듈과 통신하기 위해서는
 * applicationContext-activiti.xml에 taskProps ID가 정의되어 있어야 실행이 가능하다.
 *
 * @type {string[]}
 */
var shapes = [
    // TODO : 추후 다른 컴포넌트도 추가 필요
    'Flamingo.view.workflowdesigner.shape.OOZIE_DECISION',
    'Flamingo.view.workflowdesigner.shape.OOZIE_FORK',
    'Flamingo.view.workflowdesigner.shape.OOZIE_JOIN',
    'Flamingo.view.workflowdesigner.shape.OOZIE_SUBWORKFLOW',
    'Flamingo.view.workflowdesigner.shape.OOZIE_KILL',
    'Flamingo.view.workflowdesigner.shape.OOZIE_MAPREDUCE',
    'Flamingo.view.workflowdesigner.shape.OOZIE_DISTCP',
    'Flamingo.view.workflowdesigner.shape.OOZIE_SHELL',
    'Flamingo.view.workflowdesigner.shape.OOZIE_SSH',
    'Flamingo.view.workflowdesigner.shape.OOZIE_EMAIL',
    'Flamingo.view.workflowdesigner.shape.OOZIE_SPARK',
    'Flamingo.view.workflowdesigner.shape.OOZIE_SQOOP',
    'Flamingo.view.workflowdesigner.shape.OOZIE_FS'
];

for (var i = 0; i < shapes.length; i++) {
    var text = shapes[i];
    var splitText = shapes[i].split('.');
    var alias = splitText[splitText.length - 1];
    var ref = (splitText.length == 5) ? alias : splitText[splitText.length - 2] + "." + [alias];
    makeShape(ref, alias, text);
}
// ref
function makeShape(ref, alias, text) {
    var refArr = ref.split('.');
    if (refArr.length == 1) {
        Flamingo.view.workflowdesigner.shape[ref] = function (image, label) {
            Flamingo[alias].superclass.call(this, image, label);
            this.SHAPE_ID = text;
        };

        Flamingo.view.workflowdesigner.shape[ref].prototype = new OG.shape.ImageShape();
        Flamingo.view.workflowdesigner.shape[ref].superclass = OG.shape.ImageShape;
        Flamingo.view.workflowdesigner.shape[ref].prototype.constructor = text;
        Flamingo.view.workflowdesigner.shape[ref].className = text;

        Flamingo[alias] = Flamingo.view.workflowdesigner.shape[ref];
    } else if (refArr.length == 2) {
        Flamingo.view.workflowdesigner.shape[refArr[0]][refArr[1]] = function (image, label) {
            Flamingo[alias].superclass.call(this, image, label);
            this.SHAPE_ID = text;
        };

        Flamingo.view.workflowdesigner.shape[refArr[0]][refArr[1]].prototype = new OG.shape.ImageShape();
        Flamingo.view.workflowdesigner.shape[refArr[0]][refArr[1]].superclass = OG.shape.ImageShape;
        Flamingo.view.workflowdesigner.shape[refArr[0]][refArr[1]].prototype.constructor = text;
        Flamingo.view.workflowdesigner.shape[refArr[0]][refArr[1]].className = text;
        Flamingo[alias] = Flamingo.view.workflowdesigner.shape[refArr[0]][refArr[1]];
    }
}

Ext.define('Flamingo.view.workflowdesigner.canvas.Canvas', {
    extend: 'Ext.form.Panel',
    alias: 'widget.canvas',

    /**
     * Workflow Designer의 UI 노드
     */
    requires: [
        'Flamingo.view.workflowdesigner.canvas.CanvasController',

        // 'Flamingo.view.workflowdesigner.property.OOZIE_DECISION',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_FORK',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_JOIN',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_SUBWORKFLOW',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_KILL',
        'Flamingo.view.workflowdesigner.property.OOZIE_MAPREDUCE',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_DISTCP',
        'Flamingo.view.workflowdesigner.property.OOZIE_SHELL',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_SSH',
        // 'Flamingo.view.workflowdesigner.property.OOZIE_EMAIL',
        'Flamingo.view.workflowdesigner.property.OOZIE_SPARK',
        'Flamingo.view.workflowdesigner.property.OOZIE_SQOOP'
        // 'Flamingo.view.workflowdesigner.property.OOZIE_FS'
    ],

    controller: 'canvasController',

    layout: 'fit',

    autoScroll: true,

    forceLayout: true,

    cls: 'canvas_contents',

    graph: null,

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'textfield',
                    width: 400,
                    labelWidth: 100,
                    maxLength: 100,
                    fieldLabel: 'Workflow name',
                    id: 'wd_fld_name',
                    name: 'name',
                    emptyText: 'Enter a Workflow name.',
                    allowBlank: false
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_id',
                    name: 'id',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_tree_id',
                    name: 'tree_id',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_status',
                    name: 'status',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_process_id',
                    name: 'process_id',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_process_definition_id',
                    name: 'process_definition_id',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_deployment_id',
                    name: 'deployment_id',
                    allowBlank: true
                },
                {
                    xtype: 'hidden',
                    id: 'wd_fld_desc',
                    name: 'desc',
                    allowBlank: true
                }
            ]
        },
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    id: 'wd_btn_create',
                    text: 'New',
                    iconCls: 'common-new',
                    listeners: {
                        click: 'onCreateClick'
                    }
                },
                {
                    id: 'wd_btn_save',
                    text: 'Save',
                    iconCls: 'common-save',
                    listeners: {
                        click: 'onSaveClick'
                    }
                },
                {
                    id: 'wd_btn_run',
                    text: 'Run',
                    iconCls: 'common-execute',
                    disabled: true,
                    listeners: {
                        click: 'onRunClick'
                    }
                },
//                '-',
                {
                    id: 'wd_btn_xml',
                    text: 'View',
                    iconCls: 'hdfs-directory-info',
                    disabled: true,
                    hidden: true,
                    listeners: {
                        click: 'onWorkflowXMLClick'
                    }
                },
//                '-',
                {
                    id: 'wd_btn_copy',
                    text: 'Copy',
                    iconCls: 'common-file-copy',
                    disabled: true,
                    listeners: {
                        click: 'onWorkflowCopyClick'
                    }
                }
            ]
        }
    ],
    listeners: {
        highlightById: 'highlightById',
        unhighlightById: 'unhighlightById',
        getwiredIdByElement: 'getwiredIdByElement',
        setwireEvent: 'setwireEvent',
        setwireEventAll: 'setwireEventAll',

        render: 'onCanvasRender',
        resize: 'onCanvasResize',

        nodeBeforeConnect: 'onCanvasNodeBeforeConnect',
        nodeConnect: 'onCanvasNodeConnect',
        nodeDisconnected: 'onCanvasNodeDisconnected',
        nodeBeforeRemove: 'onCanvasNodeBeforeRemove',

        beforeLabelChange: 'onCanvasBeforeLabelChange',
        labelChanged: 'onCanvasLabelChanged'
    },
    highlightById: function (elementId) {
        this.fireEvent('highlightById', elementId);
    },
    unhighlightById: function (elementId) {
        this.fireEvent('unhighlightById', elementId);
    },
    setwireEvent: function (shapeElement) {
        this.fireEvent('setwireEvent', shapeElement);
    },
    setwireEventAll: function () {
        this.fireEvent('setwireEventAll');
    }
});