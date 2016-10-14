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
Ext.define('Flamingo.view.workflowdesigner.canvas.events._drawDefaultNodeController', {
    extend: 'Ext.app.ViewController',

    /**
     * 디폴트 시작, 끝 노드를 드로잉한다.
     * @private
     */
    run: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var startNode, endNode;

        if (canvas.graph) {
            startNode = canvas.graph.drawShape([100, 100], new OG.E_Start('Start'), [30, 30]);
            endNode = canvas.graph.drawShape([500, 100], new OG.E_End('End'), [30, 30]);

            canvas.graph.setCustomData(startNode, {
                metadata: {
                    "type": "START",
                    "icon": "/resources/image/app/designer/others/btn_start.png",
                    "identifier": "START",
                    "name": 'Start',
                    "minPrevNodeCounts": 0,
                    "maxPrevNodeCounts": 0,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "END,IN,OUT",
                    "notAllowedPrevNodes": "",
                    "notAllowedNextNodes": "END"
                }
            });

            canvas.graph.setCustomData(endNode, {
                metadata: {
                    "type": "END",
                    "identifier": "END",
                    "icon": "/resources/image/app/designer/others/btn_end.png",
                    "name": 'End',
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 0,
                    "maxNextNodeCounts": 0,
                    "notAllowedPrevTypes": "START,IN,OUT",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "START",
                    "notAllowedNextNodes": ""
                }
            });
        }
    }
});