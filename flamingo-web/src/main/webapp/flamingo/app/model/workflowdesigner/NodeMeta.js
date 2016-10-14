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
/**
 * NodeMeta Model
 *
 * @class
 * @extends Ext.data.Model
 * @author <a href="mailto:hrkenshin@gmail.com">Seungbaek Lee</a>
 */
Ext.define('Flamingo.model.workflowdesigner.NodeMeta', {
    extend: 'Ext.data.Model',
    idProperty: 'identifier',
    fields: [
        {name: 'type', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'jobType', type: 'string'},
        {name: 'identifier', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'qualifierLabel', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'isCheckColumns', type: 'boolean', defaultValue: false},
        {name: 'fixedInputColumns', type: 'boolean', defaultValue: false},
        {name: 'fixedOutputColumns', type: 'boolean', defaultValue: false},
        {name: 'readOnlyOutputColumns', type: 'boolean', defaultValue: false},
        {name: 'ignoreInput', type: 'boolean', defaultValue: false},
        {name: 'ignoreOutput', type: 'boolean', defaultValue: false},
        {name: 'minPrevNodeCounts', type: 'int', defaultValue: -1},
        {name: 'maxPrevNodeCounts', type: 'int', defaultValue: -1},
        {name: 'minNextNodeCounts', type: 'int', defaultValue: -1},
        {name: 'maxNextNodeCounts', type: 'int', defaultValue: -1},
        {name: 'notAllowedPrevTypes', type: 'string', defaultValue: ''},
        {name: 'notAllowedNextTypes', type: 'string', defaultValue: ''},
        {name: 'notAllowedPrevNodes', type: 'string', defaultValue: ''},
        {name: 'notAllowedNextNodes', type: 'string', defaultValue: ''},
        {name: 'className', type: 'string'},
        {name: 'classpaths', type: 'string'},
        {name: 'disabled', type: 'boolean', defaultValue: false},
        {name: 'defaultProperties'}
    ],
    validators: [
        {type: 'presence', field: 'type'},
        {type: 'presence', field: 'identifier'},
        {type: 'presence', field: 'name'},
        {
            type: 'inclusion',
            field: 'type',
            list: ['START', 'END', 'IN', 'OUT', 'HADOOP', 'ETL', 'STATISTICS', 'MINING', 'ALG', 'OTHERS']
        }
    ]
});