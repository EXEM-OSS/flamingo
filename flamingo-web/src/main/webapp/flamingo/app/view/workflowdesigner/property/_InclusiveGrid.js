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
Ext.define('Flamingo.view.workflowdesigner.property._InclusiveGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget._inclusiveGrid',

    stripeRows: true,

    margins: '0 0 0 0',

    selectableShapes: [],

    store: Ext.create('Ext.data.Store', {
        fields: [
            {name: 'node'},
            {name: 'id'}
        ],
        data: []
    }),

    columns: [
        {text: 'Node', flex: 1, sortable: true, dataIndex: 'node', align: 'center'},
        {text: 'Node' + ' ID', flex: 1, sortable: true, dataIndex: 'id', align: 'center'},
        {text: "Provider", hidden: true, flex: 1, sortable: true, dataIndex: 'provider', align: 'center'}
    ],

    tipUse: 'on',

    listeners: {
        drawGrid: function () {
            var me = this;
            var mydata = [];
            var list = query('BASE_NODE').getNextNodeDataAndShapeId();
            for (var i = 0; i < list.length; i++) {
                var nodeData = list[i];
                if (nodeData && nodeData.metadata) {
                    var name = nodeData.metadata.name;
                    var provider = nodeData.metadata.provider;
                    var id = nodeData.shapeId;
                    mydata.push({
                        node: name,
                        id: id,
                        provider: provider
                    });
                }
            }
            me.getStore().loadData(mydata);
        }
    }
});