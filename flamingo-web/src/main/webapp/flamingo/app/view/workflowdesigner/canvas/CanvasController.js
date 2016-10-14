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
Ext.define('Flamingo.view.workflowdesigner.canvas.CanvasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.canvasController',

    requires: [
        'Flamingo.view.workflowdesigner.canvas.events.onCanvasRender'
    ],

    highlightById: function (elementId) {
        $("#" + elementId).find("text").attr("fill", "red");
    },
    unhighlightById: function (elementId) {
        $("#" + elementId).find("text").attr("fill", "black");
    },
    setwireEvent: function (shapeElement) {
        var me = this;
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        $("#" + shapeElement.id).hover(function () {
            var nodeData = Ext.clone(canvas.graph.getCustomData(shapeElement));
            if (nodeData && nodeData.metadata) {
                if (nodeData.properties && nodeData.properties.node_from == 'wire') {
                    var wiredId = nodeData.properties.node_display;
                    me.highlightById(wiredId);
                    me.highlightById(shapeElement.id);
                }
            }
        }, function () {
            var nodeData = Ext.clone(canvas.graph.getCustomData(shapeElement));
            if (nodeData && nodeData.metadata) {
                if (nodeData.properties && nodeData.properties.node_from == 'wire') {
                    var wiredId = nodeData.properties.node_display;
                    me.unhighlightById(wiredId);
                    me.unhighlightById(shapeElement.id);
                }
            }
        });
    },
    setwireEventAll: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var allNodes = canvas.graph.getElementsByType();
        for (var i = 0; i < allNodes.length; i++) {
            this.setwireEvent(allNodes[i]);
        }
    },
    onCanvasRender: function (component, eOpts) {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasRender').onCanvasRender(component, eOpts);
    },
    onCanvasResize: function (component, width, height, oldWidth, oldHeight, eOpts) {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasRender')
            .onCanvasResize(component, width, height, oldWidth, oldHeight, eOpts);
    },
    onCanvasNodeBeforeConnect: function (canvas, event, edgeElement, fromElement, toElement) {
        return Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasNode')
            .onCanvasNodeBeforeConnect(canvas, event, edgeElement, fromElement, toElement);
    },
    onCanvasNodeConnect: function (canvas, event, edgeElement, fromElement, toElement) {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasNode')
            .onCanvasNodeConnect(canvas, event, edgeElement, fromElement, toElement);
    },
    onCanvasNodeDisconnected: function (canvas, event, edgeElement, fromElement, toElement) {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasNode')
            .onCanvasNodeDisconnected(canvas, event, edgeElement, fromElement, toElement);
    },
    onCanvasNodeBeforeRemove: function (canvas, event, element) {
        return Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasNode')
            .onCanvasNodeBeforeRemove(canvas, event, element);
    },
    onCanvasBeforeLabelChange: function (canvas, event, shapeElement, afterText, beforeText) {
        return Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasLabel')
            .onCanvasBeforeLabelChange(canvas, event, shapeElement, afterText, beforeText);
    },
    onCanvasLabelChanged: function (canvas, event, shapeElement, afterText, beforeText) {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasLabel')
            .onCanvasLabelChanged(canvas, event, shapeElement, afterText, beforeText);
    },
    onCreateClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController').onCreateClick();
    },
    onSaveClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController').onSaveClick();
    },
    onRunClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController').onRunClick();
    },
    onWorkflowXMLClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController').onWorkflowXMLClick();
    },
    onWorkflowCopyClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController').onWorkflowCopyClick();
    },
    onHdfsBrowserClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.HdfsBrowserWindow').center().show();
    },
    onHiveClick: function () {
        Ext.create('Flamingo.view.workflowdesigner.canvas.HiveEditorWindow').center().show();
    }
});