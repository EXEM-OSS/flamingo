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
Ext.define('Flamingo.view.workflowdesigner.canvas.events.onCanvasRender', {
    extend: 'Ext.app.ViewController',

    /**
     * 캔버스 패널 Render 핸들러 :
     * - 내부 SVG 그래프 캔버스 인스턴스를 생성한다.
     * - 노드의 DropZone 을 설정하고 Drop 되었을때 노드가 드로잉 되도록 한다.
     * - 노드를 더블클릭 하였을때 프라퍼티 설정창이 팝업되도록 한다.
     *
     * @param {Ext.Component} component
     * @param {Object} eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onCanvasRender: function (component, eOpts) {
        var canvas = Ext.ComponentQuery.query('canvas')[0]
        var getPropertyWindow =
            Ext.create('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController')._getPropertyWindow;

        // 내부 SVG 그래프 캔버스 인스턴스를 생성
        canvas.graph = new OG.Canvas(canvas.body.dom, [1024, 768], 'white');

        // OpenGraph 디폴트 스타일 설정
        canvas.graph._CONFIG.DEFAULT_STYLE.EDGE = {
            'stroke': 'blue',
            'stroke-width': 1,
            'stroke-opacity': 1,
            'edge-type': 'straight', // FIXME : 선의 유형
            'edge-direction': 'c c',
            'arrow-start': 'none',
            'arrow-end': 'classic-wide-long',
            'stroke-dasharray': '',
            'label-position': 'center'
        };

        // OpenGraph 기능 활성화 여부
        canvas.graph._CONFIG.MOVABLE_.EDGE = false;
        canvas.graph._CONFIG.SELF_CONNECTABLE = false;
        canvas.graph._CONFIG.CONNECT_CLONEABLE = false;
        canvas.graph._CONFIG.RESIZABLE = false;
        canvas.graph._CONFIG.LABEL_EDITABLE_.GEOM = false;
        canvas.graph._CONFIG.LABEL_EDITABLE_.TEXT = false;
        canvas.graph._CONFIG.LABEL_EDITABLE_.HTML = false;
        canvas.graph._CONFIG.LABEL_EDITABLE_.IMAGE = false;
        canvas.graph._CONFIG.LABEL_EDITABLE_.EDGE = true;
        canvas.graph._CONFIG.LABEL_EDITABLE_.GROUP = false;
        canvas.graph._CONFIG.ENABLE_HOTKEY_DELETE = true;
        canvas.graph._CONFIG.ENABLE_HOTKEY_CTRL_A = false;
        canvas.graph._CONFIG.ENABLE_HOTKEY_CTRL_C = false;
        canvas.graph._CONFIG.ENABLE_HOTKEY_CTRL_V = false;
        canvas.graph._CONFIG.ENABLE_HOTKEY_CTRL_G = false;
        canvas.graph._CONFIG.ENABLE_HOTKEY_CTRL_U = false;
        canvas.graph._CONFIG.ENABLE_HOTKEY_ARROW = true;
        canvas.graph._CONFIG.ENABLE_HOTKEY_SHIFT_ARROW = true;

        // 디폴트 시작, 끝 노드 드로잉
        Ext.create('Flamingo.view.workflowdesigner.canvas.events._drawDefaultNodeController').run();

        // 노드의 DropZone 설정
        canvas.dropZone = Ext.create('Ext.dd.DropZone', canvas.getEl(), {
            dropAllowed: 'canvas_contents',

            notifyOver: function (dragSource, event, data) {
                return Ext.dd.DropTarget.prototype.dropAllowed;
            },

            notifyDrop: function (dragSource, event, data) {
                var nodeMeta = Ext.clone(data.nodeMeta);
                var shapeElement;
                var properties = Ext.clone(nodeMeta.defaultProperties) || {};
                var identifier = nodeMeta.identifier;
                var isValidated = false;
                if (nodeMeta.type == 'ROLE') {
                    identifier = 'SHELL_ROLE'
                }
                else if (nodeMeta.type == 'NODE') {
                    identifier = 'SHELL_NODE';
                    properties.node_display = nodeMeta.name;
                    properties.node_from = 'node';
                    nodeMeta.name = 'CHEF NODE : ' + nodeMeta.name;
                    isValidated = true;
                }
                var shape = Ext.create('Flamingo.' + identifier, nodeMeta.icon, nodeMeta.name);
                shapeElement = canvas.graph.drawShape([event.browserEvent.layerX, event.browserEvent.layerY], shape, [60, 60]);
                canvas.graph.getRenderer().drawLabel(shapeElement, nodeMeta.name);

                canvas.graph.setCustomData(shapeElement, {
                    metadata: nodeMeta,
                    properties: properties,
                    isValidated: isValidated
                });
                canvas.setwireEvent(shapeElement);
                return true;
            }
        });

        // onDrawShape Listener
        canvas.graph.onDrawShape(function (event, element) {
            // 노드를 더블클릭 하였을때 프라퍼티 설정창 팝업
            Ext.get(element.id).on('dblclick', function () {
                var propertyWindow = getPropertyWindow(element);
                if (propertyWindow) {
                    propertyWindow.show();
                }
            });
        });

        // onBeforeConnectShape -> fireEvent canvas.nodeBeforeConnect
        canvas.graph.onBeforeConnectShape(function (event, edgeElement, fromElement, toElement) {
            return canvas.fireEvent('nodeBeforeConnect', canvas, event, edgeElement, fromElement, toElement);
        });

        // onBeforeRemoveShape -> fireEvent canvas.nodeBeforeRemove
        canvas.graph.onBeforeRemoveShape(function (event, element) {
            return canvas.fireEvent('nodeBeforeRemove', canvas, event, element);
        });

        // onConnectShape -> fireEvent canvas.nodeConnect
        canvas.graph.onConnectShape(function (event, edgeElement, fromElement, toElement) {
            canvas.fireEvent('nodeConnect', canvas, event, edgeElement, fromElement, toElement);
        });

        // onDisconnectShape -> fireEvent canvas.nodeDisconnected
        canvas.graph.onDisconnectShape(function (event, edgeElement, fromElement, toElement) {
            canvas.fireEvent('nodeDisconnected', canvas, event, edgeElement, fromElement, toElement);
        });

        // onBeforeLabelChange -> fireEvent canvas.beforeLabelChange
        canvas.graph.onBeforeLabelChange(function (event, element, afterText, beforeText) {
            return canvas.fireEvent('beforeLabelChange', canvas, event, element, afterText, beforeText);
        });

        // onLabelChanged -> fireEvent canvas.labelChanged
        canvas.graph.onLabelChanged(function (event, element, afterText, beforeText) {
            canvas.fireEvent('labelChanged', canvas, event, element, afterText, beforeText);
        });
    },
    /**
     * 캔버스 패널 Resize 핸들러 : 내부 SVG 그래프 캔버스 사이즈를 조정한다.
     *
     * @param {Ext.Component} component
     * @param {Number} width
     * @param {Number} height
     * @param {Number} oldWidth
     * @param {Number} oldHeight
     * @param {Object} eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onCanvasResize: function (component, width, height, oldWidth, oldHeight, eOpts) {
        var graphBBox = component.graph.getRootBBox();

        // 내부 SVG 그래프 캔버스 사이즈가 외부 캔버스 패널 사이즈보다 작을 경우
        if (graphBBox.width < width || graphBBox.height < height) {
            component.graph.setCanvasSize([
                graphBBox.width < width ? width : graphBBox.width,
                graphBBox.height < height ? width : graphBBox.height
            ]);
        }
    }
});