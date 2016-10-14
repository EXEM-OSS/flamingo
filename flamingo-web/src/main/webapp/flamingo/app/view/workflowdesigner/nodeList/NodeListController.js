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
Ext.define('Flamingo.view.workflowdesigner.nodeList.NodeListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.nodeListController',

    onNodeListBeforerender: function () {
        var type = this.getView().type;
        var store = this.getViewModel().getStore('nodemeta');
        if (type) {
            var types = type.split(',');
            store.filter({
                filterFn: function (item) {
                    for (var i = 0; i < types.length; i++) {
                        if (item.get("type") === types[i]) {
                            return true;
                        }
                    }
                }
            });
        } else {
            store.filter({
                filterFn: function (item) {
                    if (item.get("type") !== 'START' && item.get("type") !== 'END') {
                        return true;
                    }
                }
            });
        }
    },
    /**
     * 노드리스트 패널 Render 핸들러 : 노드의 DragZone 을 설정하고 Drag 시 노드 메타데이타를 설정한다.
     *
     * @param {Ext.Component} component
     * @param {Object} eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onNodeListRender: function (component, eOpts) {
        component.dragZone = Ext.create('Ext.dd.DragZone', component.getEl(), {
            getDragData: function (e) {
                var sourceEl = e.getTarget(component.itemSelector, 10), d;

                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    var store = component.getViewModel().getStore('nodemeta');
                    return {
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        ddel: d,
                        nodeMeta: store.getById(sourceEl.id).data
                    };
                }
            },

            getRepairXY: function () {
                return this.dragData.repairXY;
            }
        });
    }
});