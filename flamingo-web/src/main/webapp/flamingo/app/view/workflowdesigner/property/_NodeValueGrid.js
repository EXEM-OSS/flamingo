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
Ext.define('Flamingo.view.workflowdesigner.property._NodeValueGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget._nodeValueGrid',

    stripeRows: true,

    margins: '0 0 0 0',

    selectableShapes: [],

    search: 'server',

    store: null,

    columns: [],

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },

    initComponent: function () {
        var me = this;

        if (me.search == 'variable') {
            me.store = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name'},
                    {name: 'expression'}
                ],
                data: []
            });

            me.columns = [
                {text: 'Node', flex: 1, sortable: true, dataIndex: 'name'},
                {
                    text: 'Value',
                    flex: 1,
                    dataIndex: 'expression',
                    renderer: function (val, meta, rec) {
                        return me.getExpressionValue(rec);
                    }
                },
                {
                    text: 'Use',
                    width: 80,
                    align: 'center',
                    renderer: function (val, meta, rec) {
                        var id = Ext.id();
                        Ext.defer(function () {
                            Ext.create('Ext.button.Button', {
                                itemId: rec.data.recid + 'button',
                                renderTo: id,
                                text: 'Use',
                                iconCls: 'common-view',
                                usage: 'vmproperty-apply',
                                scale: 'small',
                                handler: function () {
                                    me.applyValueInEditor(rec);
                                }
                            });
                        }, 50);
                        return Ext.String.format('<div id="{0}"></div>', id);
                    }
                }
            ];
        }
        this.callParent(arguments);
    },

    listeners: {
        afterrender: function () {
            this.reload();
        }
    },

    reload: function () {
        var me = this;
        var mydata = [];
        if (me.search == 'variable') {
            var variableGrid = Ext.ComponentQuery.query('variableGrid')[0];
            var items = variableGrid.getStore().data.items;
            for (var i = 0; i < items.length; i++) {
                mydata.push({
                    name: items[i].data.name,
                    recid: Ext.id(),
                    expression: ''
                });
            }
            me.getStore().loadData(mydata);
        }
    },

    getExpressionValue: function (rec) {
        var me = this;
        var expressionValue;
        if (me.search == 'variable') {
            var nodefrom;
            nodefrom = 'WORKFLOW';
            var value = rec.data.name;
            expressionValue = '#{' + nodefrom + '::' + value + '}';
        }
        rec.data.expression = expressionValue;
        return expressionValue;
    },

    applyValueInEditor: function (rec) {
        var me = this;
        if (me.editor) {
            var expressionValue = rec.data.expression;
            query(me.editor).insertValue(expressionValue);
        }
    }
});