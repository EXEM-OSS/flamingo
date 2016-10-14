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
Ext.define('Flamingo.view.workflowdesigner.property._ShapesGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget._shapesGrid',

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
        {text: 'Node ID', flex: 1, sortable: true, dataIndex: 'id', align: 'center'},
        {text: 'Provider', flex: 1, sortable: true, dataIndex: 'provider', hidden: true}
    ],

    /*
     tools: [
     {
     type: 'refresh',
     tooltip: '워크플로우 목록을 갱신합니다.',
     handler: function (event, toolEl, panel) {
     query('_shapesGrid').getStore().load();
     }
     }
     ],
     */

    tipUse: 'on',

    listeners: {
        afterrender: function () {
            var me = this;
            var mydata = [];
            var list = query('BASE_NODE').getSelectableNode();
            var canvas = Ext.ComponentQuery.query('canvas')[0];
            for (var i = 0; i < list.length; i++) {
                nodeData = Ext.clone(canvas.graph.getCustomData(list[i]));
                if (nodeData && nodeData.metadata) {
                    var name = nodeData.metadata.name;
                    var provider = nodeData.metadata.provider;
                    var id = list[i].id
                    mydata.push({
                        node: name,
                        id: id,
                        provider: provider
                    });
                }
            }
            me.getStore().loadData(mydata);

            var theElem = query('BASE_NODE').getEl();
            var theTip = Ext.create('Ext.tip.Tip', {
                html: 'Double clicking changes the node.',
                margin: '25 0 0 150',
                shadow: false
            });

            me.addListener('itemmouseenter', function (grid, selRow, selHtml) {
                if (me.tipUse == 'on')
                    theTip.showAt(theElem.getX(), theElem.getY());
                canvas.highlightById(selRow.data.id);
            });
            me.addListener('itemmouseleave', function (grid, selRow, selHtml) {
                if (me.tipUse == 'on')
                    theTip.hide();
                canvas.unhighlightById(selRow.data.id);
            });
        }
    }
});