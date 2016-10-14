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
Ext.define('Flamingo.view.workflowdesigner.canvas.events.onCanvasLabel', {
    extend: 'Ext.app.ViewController',

    /**
     * 캔버스 패널 BeforeLabelChange 핸들러
     *
     * @param {Ext.Component} canvas 캔버스패널
     * @param {Event} event 이벤트
     * @param {Element} shapeElement 노드엘리먼트
     * @param {String} afterText 변경 후 라벨
     * @param {String} beforeText 변경 전 라벨
     */
    onCanvasBeforeLabelChange: function (canvas, event, shapeElement, afterText, beforeText) {

        // 1. 라벨명 공백 금지
        if (Ext.isEmpty(Ext.String.trim(afterText || ''))) {
            return false;
        }

        // 2. 리턴(\r\n), 콤마(,) 제거. 공백 '_' 로 대체
        // FIXME: Label 입력시 특수문자 처리를 제거함.
        // afterText = Ext.String.trim(afterText || '').replace(/,|\r|\n/g, '').replace(/\s+/g, '_');

        // 3. 이전 노드 식별자 라벨 중복 금지(자동 _숫자 붙임)
        if (shapeElement.shape.TYPE === OG.Constants.SHAPE_TYPE.EDGE) {
            var connectInfo = canvas.graph.getRelatedElementsFromEdge(shapeElement),
                prevEdges = canvas.graph.getPrevEdges(connectInfo.to),
                label, labelMap = new Ext.util.HashMap(), num = 1;

            for (var i = 0; i < prevEdges.length; i++) {
                label = prevEdges[i].shape.label;
                if (prevEdges[i].id !== shapeElement.id && !Ext.isEmpty(label)) {
                    labelMap.add(label, label);
                }
            }

            label = afterText;
            while (labelMap.containsKey(label)) {
                label = afterText + '_' + num++;
            }
            afterText = label;
        }

        // 4. 라벨명 공백 금지
        if (Ext.isEmpty(Ext.String.trim(afterText || ''))) {
            return false;
        }

        event.afterText = afterText;

        return true;
    },
    /**
     * 캔버스 패널 LabelChanged 핸들러
     *
     * @param {Ext.Component} canvas 캔버스패널
     * @param {Event} event 이벤트
     * @param {Element} shapeElement 노드엘리먼트
     * @param {String} afterText 변경 후 라벨
     * @param {String} beforeText 변경 전 라벨
     */
    onCanvasLabelChanged: function (canvas, event, shapeElement, afterText, beforeText) {
        if (shapeElement.shape.TYPE === OG.Constants.SHAPE_TYPE.EDGE) {
            var connectInfo = canvas.graph.getRelatedElementsFromEdge(shapeElement),
                fromNodeData = Ext.clone(canvas.graph.getCustomData(connectInfo.from)),
                fromNodeMeta = fromNodeData.metadata,
                fromNodeProperties = fromNodeData.properties,
                toNodeData = Ext.clone(canvas.graph.getCustomData(connectInfo.to)),
                toNodeMeta = toNodeData.metadata,
                toNodeProperties = toNodeData.properties;

            if (fromNodeMeta.type !== 'START' && toNodeMeta.type !== 'END') {
                // 1. 라벨 변경시 inputPathQualifiers, outputPathQualifier 값을 자동 변경
                if (toNodeMeta.type === 'OUT') {
                    toNodeProperties.outputPathQualifier = afterText;
                    canvas.graph.setCustomData(connectInfo.to, toNodeData);
                } else if (fromNodeMeta.type === 'IN') {
                    fromNodeProperties.inputPathQualifiers = afterText;
                    fromNodeProperties.outputPathQualifier = afterText;
                    canvas.graph.setCustomData(connectInfo.from, fromNodeData);
                } else {
                    fromNodeProperties.outputPathQualifier = afterText;
                    canvas.graph.setCustomData(connectInfo.from, fromNodeData);
                }

                if (toNodeMeta.type !== 'OUT') {
                    // 2. 연결된 다른 Edge 라벨에도 같이 적용
                    //Ext.each(canvas.graph.getNextEdges(connectInfo.from), function (edge) {
                    //    var _connectInfo = canvas.graph.getRelatedElementsFromEdge(edge),
                    //        _toNodeMeta = Ext.clone(canvas.graph.getCustomData(_connectInfo.to)).metadata;
                    //    if (edge.shape.label !== afterText && _toNodeMeta.type !== 'END' && _toNodeMeta.type !== 'OUT') {
                    //        canvas.graph.drawLabel(edge, afterText);
                    //    }
                    //}, this);

                    // 3. 컬럼 정보 적용
                    /*
                     Ext.each(canvas.graph.getNextShapes(connectInfo.from), function (ele) {
                     this._applyPrevColumnInfo(ele);
                     }, this);
                     */
                }
            }
        } else if (shapeElement.shape.TYPE === OG.Constants.SHAPE_TYPE.IMAGE) {
            var shapeData = Ext.clone(canvas.graph.getCustomData(shapeElement)),
                title = shapeElement.shape.label;
            shapeData.metadata.name = title;
            canvas.graph.setCustomData(shapeElement, shapeData);
        }
    }
});