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
Ext.define('Flamingo.view.workflowdesigner.canvas.events.onCanvasNode', {
    extend: 'Ext.app.ViewController',

    /**
     * 캔버스 패널 NodeBeforeConnected 핸들러 : 연결 직전 Validation 을 체크한다.
     *
     * @param {Ext.Component} canvas 캔버스패널
     * @param {Event} event 이벤트
     * @param {Element} edgeElement 라인엘리먼트
     * @param {Element} fromElement 시작엘리먼트
     * @param {Element} toElement 끝엘리먼트
     */
    onCanvasNodeBeforeConnect: function (canvas, event, edgeElement, fromElement, toElement) {
        var workflow = this, fromNodeData = Ext.clone(canvas.graph.getCustomData(fromElement)),
            fromNodeMeta = fromNodeData.metadata,
            fromNodeProperties = fromNodeData.properties,
            toNodeData = Ext.clone(canvas.graph.getCustomData(toElement)),
            toNodeMeta = toNodeData.metadata,
            toNodeProperties = toNodeData.properties,
            prevShapes = canvas.graph.getPrevShapes(toElement),
            checkInfinite = function (_shapeEle) {
                var _nextShapes = canvas.graph.getNextShapes(_shapeEle);
                for (var i = 0; i < _nextShapes.length; i++) {
                    if (_nextShapes[i].id === fromElement.id) {
                        App.UI.errormsg('Warning', 'Recursive connection is not available.');
                        return false;
                    }

                    if (!checkInfinite(_nextShapes[i])) {
                        return false;
                    }
                }
                return true;
            };

        // 0. 이미 연결된 노드가 있는 경우 체크
        for (var i = 0; i < prevShapes.length; i++) {
            if (prevShapes[i].id === fromElement.id) {
                App.UI.errormsg('Warning', 'This node is already connected.');
                return false;
            }
        }

        // 1. 재귀 연결 체크
        if (!checkInfinite(toElement)) {
            return false;
        }

        // 2. 상호 연결 불가 노드 체크
        if (fromNodeMeta.notAllowedNextTypes.indexOf(toNodeMeta.type) >= 0) {
            App.UI.errormsg('Warning', 'You cannot connect.');
            return false;
        }
        if (toNodeMeta.notAllowedPrevTypes.indexOf(fromNodeMeta.type) >= 0) {
            App.UI.errormsg('Warning', 'You cannot connect.');
            return false;
        }
        if (fromNodeMeta.notAllowedNextNodes.indexOf(toNodeMeta.identifier) >= 0) {
            App.UI.errormsg('Warning', 'You cannot connect.');
            return false;
        }
        if (toNodeMeta.notAllowedPrevNodes.indexOf(fromNodeMeta.identifier) >= 0) {
            App.UI.errormsg('Warning', 'You cannot connect.');
            return false;
        }

        // 3. 이전 노드 연결 갯수 체크
        if (toNodeMeta.maxPrevNodeCounts >= 0 &&
            canvas.graph.getPrevShapes(toElement).length >= toNodeMeta.maxPrevNodeCounts) {
            App.UI.errormsg('Warning', 'You cannot connect anymore.');
            return false;
        }

        // 4. 이후 노드 연결 갯수 체크
        if (fromNodeMeta.maxNextNodeCounts >= 0 &&
            canvas.graph.getNextShapes(fromElement).length >= fromNodeMeta.maxNextNodeCounts) {
            App.UI.errormsg('Warning', 'You cannot connect anymore.');
            return false;
        }

        return true;
    },
    /**
     * 캔버스 패널 NodeConnected 핸들러 : 노드 연결 되었을 때 다음 노드로의 컬럼구분자, 컬럼정보를 전달한다.
     *
     * @param {Ext.Component} canvas 캔버스패널
     * @param {Event} event 이벤트
     * @param {Element} edgeElement 라인엘리먼트
     * @param {Element} fromElement 시작엘리먼트
     * @param {Element} toElement 끝엘리먼트
     */
    onCanvasNodeConnect: function (canvas, event, edgeElement, fromElement, toElement) {
        var fromNodeData = Ext.clone(canvas.graph.getCustomData(fromElement)),
            fromNodeMeta = fromNodeData.metadata,
            fromNodeProperties = fromNodeData.properties,
            toNodeData = Ext.clone(canvas.graph.getCustomData(toElement)),
            toNodeMeta = toNodeData.metadata,
            toNodeProperties = toNodeData.properties,
            edgeLabel;

        // 1. START, END 타입 노드외에 연결된 경우 디폴트 라벨 표시
        if (fromNodeMeta.type !== 'START' && toNodeMeta.type !== 'END') {

        }

        // 2. INOUT 타입 노드를 연결된 경우 라인 스타일 번경
        if (fromNodeMeta.type === 'IN' || fromNodeMeta.type === 'OUT' ||
            toNodeMeta.type === 'IN' || toNodeMeta.type === 'OUT') {
            canvas.graph.setShapeStyle(edgeElement, {
                'stroke': 'red',
                'arrow-end': 'open-wide-long',
                'stroke-dasharray': '--'
            });
        }
    },

    /**
     * 캔버스 패널 NodeDisconnected 핸들러 : 노드 연결 해제 되었을 때 다음 노드로의 컬럼구분자, 컬럼정보를 다시 설정한다.
     *
     * @param {Ext.Component} canvas 캔버스패널
     * @param {Event} event 이벤트
     * @param {Element} edgeElement 라인엘리먼트
     * @param {Element} fromElement 시작엘리먼트
     * @param {Element} toElement 끝엘리먼트
     */
    onCanvasNodeDisconnected: function (canvas, event, edgeElement, fromElement, toElement) {
        var fromNodeData = Ext.clone(canvas.graph.getCustomData(fromElement)),
            fromNodeMeta = fromNodeData.metadata,
            toNodeData = Ext.clone(canvas.graph.getCustomData(toElement)),
            toNodeMeta = toNodeData.metadata;
    },

    /**
     * 캔버스 패널 NodeBeforeRemove 핸들러 : 시작, 종료 노드인 경우 삭제를 방지한다.
     *
     * @param {Ext.Component} canvas 캔버스패널
     * @param {Event} event 이벤트
     * @param {Element} element 엘리먼트
     */
    onCanvasNodeBeforeRemove: function (canvas, event, element) {
        var nodeData = Ext.clone(canvas.graph.getCustomData(element));

        // 시작, 종료 노드인 경우 삭제 방지
        if (nodeData && nodeData.metadata &&
            (nodeData.metadata.type === 'START' || nodeData.metadata.type === 'END')) {
            if (canvas.graph.getElementsByShapeId(element.getAttribute("_shape_id")).length === 1) {
                return false;
            }
        }

        return true;
    }
});