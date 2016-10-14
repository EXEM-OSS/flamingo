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
Ext.define('Flamingo.view.workflowdesigner.property._NODE', {
    extend: 'Ext.tab.Panel',

    alias: 'widget.BASE_NODE',

    minTabWidth: 70,
    bodyPadding: 5,
    border: false,
    layout: 'fit',

    width: 400,
    height: 300,

    /**
     * 노드 데이터
     */
    nodeData: {},

    /**
     * 필터링할 데이터
     * ex) 다음과 같이 필터를 설정할 수 있다.
     * propFilters: {
     *     // 추가할 프라퍼티
     *     add: [
     *         {'test1': '1'},
     *         {'test2': '2'}
     *     ],
     *
     *     // 변경할 프라퍼티
     *     modify: [
     *         {'delimiterType': 'delimiterType2'},
     *         {'config': 'config2'}
     *     ],
     *
     *     // 삭제할 프라퍼티
     *     remove: ['script', 'metadata']
     * }
     */
    propFilters: {
        add: [],
        modify: [],
        remove: []
    },

    afterPropertySet: function (props) {
    },

    /**
     * Shape Graph Element
     */
    shapeElement: null,

    listeners: {
        afterrender: function (panel, eOpts) {
            // 노드 랜더링시 프라퍼티정보를 설정한다.
            panel.setNodeProperties(panel.nodeData.properties);
        }
    },

    /**
     * follow 가능한 shapeElement 리스트를 반환한다
     */
    getFollowableNode: function (excludeidlist) {
        if (!excludeidlist) excludeidlist = [];

        var me = this;
        var selectableNodes = [];
        if (me.nodeData && me.nodeData.metadata && me.shapeElement) {
            //선택가능 한 identifier
            var selectable = [
                'UCLOUD_CREATE_VM',
                'UCLOUD_START_VM',
                'DEFAULT_ADD_VM',
                'NOVA_CREATE_VM',
                'NOVA_START_VM',
                'SHELL_NODE'
            ];
            var canvas = Ext.ComponentQuery.query('canvas')[0],
                allNodes = canvas.graph.getElementsByType();
            for (var i = 0; i < allNodes.length; i++) {
                nodeData = Ext.clone(canvas.graph.getCustomData(allNodes[i]));
                if (nodeData && nodeData.metadata) {
                    var identifier = nodeData.metadata.identifier;
                    var isSelectable = false;
                    for (var c = 0; c < selectable.length; c++) {
                        if (identifier.indexOf(selectable[c]) != -1
                            && $.inArray(allNodes[i].id, excludeidlist) == -1)
                            isSelectable = true;
                    }
                    if (isSelectable) {
                        selectableNodes.push(allNodes[i]);
                    }
                }
            }
        }
        return selectableNodes;
    },

    /**
     * inclusive gateway의 아웃바운드 시퀀스에 연결된 리스트를 반환한다.
     */
    getOutboundNode: function () {

    },

    /**
     * follow 가능한 shapeElement 리스트를 반환한다(자기 자신은 포함하지 않는다.)
     */
    getSelectableNode: function (excludeidlist) {
        return this.getFollowableNode([this.shapeElement.id]);
    },

    /**
     * wire 관계의 노드들의 provider 의존성을 재설정한다.
     */
    resetProvide: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var nodes = this.getFollowableNode();
        for (var i = 0; i < nodes.length; i++) {
            var nodeid = nodes[i].id;
            var nodeData = Ext.clone(canvas.graph.getCustomData(nodes[i]));
            if (nodeData && nodeData.properties) {
                myfollwers(nodeid);
                function myfollwers(myid) {
                    var allNodes = canvas.graph.getElementsByType();
                    for (var c = 0; c < allNodes.length; c++) {
                        var followerData = Ext.clone(canvas.graph.getCustomData(allNodes[c]));
                        if (followerData && followerData.properties && followerData.properties.node_from) {
                            var node_from = followerData.properties.node_from;
                            var node_display = followerData.properties.node_display;
                            if (node_from == 'wire' && node_display == myid) {
                                followerData.metadata.provider = nodeData.metadata.provider;
                                canvas.graph.setCustomData(allNodes[c], followerData);
                                myfollwers(allNodes[c].id);
                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * 노드의 메타데이터정보를 반환한다.
     */
    getMetadata: function () {
        return this.nodeData.metadata;
    },

    /**
     * 노드의 프라퍼티정보를 반환한다.
     *
     * @return {Object} Property(name:value) Object
     */
    getNodeProperties: function () {
        var properties = {};
        Ext.each(this.query('form'), function (formPanel) {

            //searchField 필드를 제외시킨다.
            var values = formPanel.getForm().getValues();
            delete values.searchField;

            Ext.apply(properties, values);
            Ext.each(formPanel.query('_grid'), function (grid) {
                Ext.apply(properties, grid.getParameters());
            });
        });

        return properties;
    },

    /**
     * 노드의 필터링(변경, 삭제)된 프라퍼티정보를 반환한다.
     */
    getFilteredNodeProperties: function () {
        var properties = this.getNodeProperties();
        if (Ext.isDefined(this.propFilters)) {
            if (Ext.isArray(this.propFilters.add)) {
                for (var i = 0; i < this.propFilters.add.length; i++) {
                    Ext.apply(properties, this.propFilters.add[i]);
                }
            }

            if (Ext.isArray(this.propFilters.modify)) {
                for (var i = 0; i < this.propFilters.modify.length; i++) {
                    for (var prop in this.propFilters.modify[i]) {
                        if (properties.hasOwnProperty(prop)) {
                            properties[this.propFilters.modify[i][prop]] = properties[prop];
                            delete properties[prop];
                        }
                    }
                }
            }

            if (Ext.isArray(this.propFilters.remove)) {
                for (var i = 0; i < this.propFilters.remove.length; i++) {
                    delete properties[this.propFilters.remove[i]];
                }
            }
        }

        this.afterPropertySet(properties);

        return properties;
    },

    /**
     * 주어진 프라퍼티정보로 노드의 프라퍼티를 설정한다.
     *
     * @param {Object} nodeProperties Property(name:value) Object
     */
    setNodeProperties: function (nodeProperties) {
        if (nodeProperties) {
            Ext.each(this.query('form'), function (formPanel) {
                formPanel.getForm().setValues(nodeProperties);
                Ext.each(formPanel.query('_grid'), function (grid) {
                    grid.setParameters(nodeProperties);
                });
            });
        }
    },

    /**
     * 연결된 이전 노드들의 노드데이터를 반환한다.
     *
     * @return {Object[]} nodeData JSON Object's Array
     */
    getPrevNodeData: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            nodeDataArray = [];
        if (canvas && canvas.graph && this.shapeElement) {
            Ext.each(canvas.graph.getPrevShapes(this.shapeElement), function (shape) {
                var nodeData = Ext.clone(canvas.graph.getCustomData(shape));
                if (nodeData) {
                    nodeDataArray.push(nodeData);
                }
            });
        }

        return nodeDataArray;
    },

    /**
     * 연결된 이후 노드들의 노드데이터를 반환한다.
     *
     * @return {Object[]} nodeData JSON Object's Array
     */
    getNextNodeData: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            nodeDataArray = [];
        if (canvas && canvas.graph && this.shapeElement) {
            Ext.each(canvas.graph.getNextShapes(this.shapeElement), function (shape) {
                var nodeData = Ext.clone(canvas.graph.getCustomData(shape));
                if (nodeData) {
                    nodeDataArray.push(nodeData);
                }
            });
        }

        return nodeDataArray;
    },

    /**
     * 연결된 이후 노드들의 노드데이터를 반환한다.
     *
     * @return {Object[]} nodeData JSON Object's Array
     */
    getNextNodeDataAndShapeId: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            nodeDataArray = [];
        if (canvas && canvas.graph && this.shapeElement) {
            Ext.each(canvas.graph.getNextShapes(this.shapeElement), function (shape) {
                var nodeData = Ext.clone(canvas.graph.getCustomData(shape));
                nodeData.shapeId = shape.id;
                if (nodeData) {
                    nodeDataArray.push(nodeData);
                }
            });
        }

        return nodeDataArray;
    },

    /**
     * 노드 프라퍼티의 form 유효성을 체크한다.
     *
     * @return {Boolean}
     */
    isFormValid: function () {
        var isValid = true;
        Ext.each(this.query('form'), function (formPanel, idx) {
            this.setActiveTab(idx);
            if (!formPanel.getForm().isValid()) {
                isValid = false;
                return false;
            }

            var grid = formPanel.query('_grid');
            for (var k in grid) {
                if (!grid[k].isFormValid()) {
                    isValid = false;
                    return false;
                }
            }
        }, this);

        return isValid;
    }
});