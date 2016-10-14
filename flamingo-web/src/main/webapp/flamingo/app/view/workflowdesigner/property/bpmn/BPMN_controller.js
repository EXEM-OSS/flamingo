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
Ext.define('Flamingo.view.workflowdesigner.property.bpmn.BPMN_controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.designer.bpmn_controller',

    onInclusiveGridSelect: function (grid, record) {
        var me = this;
        var conditions = this.lookupReference('conditions').getValue();
        conditions = JSON.parse(conditions);

        var id = record.data.id;

        me.lookupReference('workflowEditor').saveField = this.lookupReference('conditions');
        me.lookupReference('workflowEditor').saveId = id;
        if (conditions[id]) {
            me.lookupReference('workflowEditor').setValue(conditions[id]);
        } else {
            me.setDefaultCondition(id)
        }
    },

    onINCLUSIVE_FORKafterrender: function (panel) {

        var me = this;
        panel.setNodeProperties(panel.nodeData.properties);
        var _inclusiveGrid = me.lookupReference('_inclusiveGrid');
        _inclusiveGrid.fireEvent('drawGrid');

        var _parallelGrid = me.lookupReference('_parallelGrid');
        var sequenceData = me.lookupReference('sequenceData').getValue();
        if (Ext.isEmpty(sequenceData)) {
            sequenceData = {};
        } else {
            sequenceData = JSON.parse(sequenceData);
        }

        _parallelGrid.sequenceData = sequenceData;
        _parallelGrid.shapeElement = me.getView().shapeElement;
        _parallelGrid.fireEvent('formfieldForSave', me.lookupReference('sequenceData'));
        _parallelGrid.fireEvent('drawGrid');

        var conditions = this.lookupReference('conditions').getValue();
        if (Ext.isEmpty(conditions)) {
            conditions = {};
            this.lookupReference('conditions').setValue(JSON.stringify(conditions));
        } else {
            conditions = JSON.parse(conditions);
        }

        var rows = _inclusiveGrid.getStore().data.items;
        for (var i = 0; i < rows.length; i++) {
            if (!conditions[rows[i].data.id]) {
                me.setDefaultCondition(rows[i].data.id)
            }
        }
    },

    onBPMN_PARALLELafterrender: function (panel) {

        var me = this;
        panel.setNodeProperties(panel.nodeData.properties);

        var _parallelGrid = me.lookupReference('_parallelGrid');
        var sequenceData = me.lookupReference('sequenceData').getValue();
        if (Ext.isEmpty(sequenceData)) {
            sequenceData = {};
        } else {
            sequenceData = JSON.parse(sequenceData);
        }
        _parallelGrid.sequenceData = sequenceData;
        _parallelGrid.shapeElement = me.getView().shapeElement;
        _parallelGrid.fireEvent('formfieldForSave', me.lookupReference('sequenceData'));
        _parallelGrid.fireEvent('drawGrid');

    },

    setDefaultCondition: function (elementId) {
        var conditions = this.lookupReference('conditions').getValue();
        conditions = JSON.parse(conditions);
        conditions[elementId] =

            '/* ' + '\n' +
            ' Make your javascript here.' + '\n' +
            ' The "run" function should be left in the script.' + '\n' +
            ' Make sure if "run" is not left in this script, it will always return false.' + '\n' +
            ' ' + '\n' +
            ' When run function return true , this outgoing flow will go through,' + '\n' +
            ' and if return false, will not go through.' + '\n' +
            ' ' + '\n' +
            ' You can use Gloval variables' + '\n' +
            ' by clicking "use" Button in the upper grid panel.' + '\n' +
            ' look at the example below.' + '\n' +
            ' ' + '\n' +
            'Example>' + '\n' +
            '\n' +
            'function run() {' + '\n' +
            '    var conditionFlag;' + '\n' +
            '\n' +
            '    var day = "#{WORKFLOW::day}";' + '\n' +
            '    if(day < "20190115"){' + '\n' +
            '        conditionFlag = true;' + '\n' +
            '    }else{' + '\n' +
            '        conditionFlag = false;' + '\n' +
            '    }' + '\n' +
            '\n' +
            '    return conditionFlag;	' + '\n' +
            '}' + '\n' +
            '*/' + '\n' +
            '\n' +
            'function run(){' + '\n' +
            '    return true;' + '\n' +
            '}' + '\n' +
            '\n';

        this.lookupReference('conditions').setValue(JSON.stringify(conditions));
    }
});