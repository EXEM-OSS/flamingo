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
Ext.ns('Flamingo.view.workflowdesigner.property.mahout');
Ext.define('Flamingo.view.workflowdesigner.property.mahout.ALG_MAHOUT_MINHASH', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ALG',
    alias: 'widget.ALG_MAHOUT_MINHASH',

    requires: [
        'Flamingo.view.workflowdesigner.property._ConfigurationBrowserField',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._ColumnGrid',
        'Flamingo.view.workflowdesigner.property._DependencyGrid',
        'Flamingo.view.workflowdesigner.property._NameValueGrid',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid',
        'Flamingo.view.workflowdesigner.property._EnvironmentGrid'
    ],

    width: 450,
    height: 320,

    items: [
        {
            title: 'Parameter',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 150
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: '_browserField',
                    name: 'vectorFile',
                    fieldLabel: 'Vector Path',
                    allowBlank: true
                },
                {
                    xtype: '_browserField',
                    name: 'outputFile',
                    fieldLabel: 'Output path',
                    allowBlank: true
                },
                {
                    xtype: '_browserField',
                    name: 'overwrite',
                    fieldLabel: 'Change Directory Path',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'minClusterSize',
                    fieldLabel: 'Min. Size of Cluster',
                    tooltip: 'Minimum points inside a cluster',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'minVectorSize',
                    fieldLabel: 'Min. Size of Vector',
                    tooltip: 'Minimum size of vector to be hashed.',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Hash Type',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'algorithmOption',
                            value: 'linear',
                            flex: 1,
                            forceSelection: true,
                            multiSelect: false,
                            disabled: false,
                            editable: false,
                            displayField: 'name',
                            valueField: 'value',
                            mode: 'local',
                            queryMode: 'local',
                            triggerAction: 'all',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value', 'description'],
                                data: [
                                    {
                                        name: 'Linear',
                                        value: 'linear',
                                        description: 'Linear'
                                    },
                                    {
                                        name: 'Polynomial',
                                        value: 'polynomial',
                                        description: 'Polynomial'
                                    },
                                    {
                                        name: 'murmur',
                                        value: 'murmur',
                                        description: 'murmur'
                                    }
                                ]
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue, eOpts) {
                                    // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                    var customValueField = combo.nextSibling('textfield');
                                    if (newValue === 'CUSTOM') {
                                        customValueField.enable();
                                        customValueField.isValid();
                                    } else {
                                        customValueField.disable();
                                        customValueField.setValue('');
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'numHashFunctions',
                    fieldLabel: 'Number of Hash Functions',
                    tooltip: 'Number of Hash Functions',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'keyGroups',
                    fieldLabel: 'Number of Key Groups',
                    tooltip: 'Number of Key Groups',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'numReducers',
                    fieldLabel: 'Number of Reducers',
                    tooltip: 'Number of Reducers',
                    vtype: 'numeric',
                    value: 2,
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Delimiter',
                    tooltip: 'A column delimiter. If a wrong value is specified, MapReduce jobs would fail.',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'delimiter',
                                    value: '\'\\t\'',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    editable: false,
                                    readOnly: this.readOnly,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {
                                                name: 'Double Colon',
                                                value: '::',
                                                description: '::'
                                            },
                                            {
                                                name: 'Comma',
                                                value: ',',
                                                description: ','
                                            },
                                            {
                                                name: 'Pipe',
                                                value: '|',
                                                description: '|'
                                            },
                                            {
                                                name: 'Tab',
                                                value: '\'\\t\'',
                                                description: '\'\\t\''
                                            },
                                            {
                                                name: 'Blank',
                                                value: '\'\\s\'',
                                                description: '\'\\s\''
                                            },
                                            {
                                                name: 'User Defined',
                                                value: 'CUSTOM',
                                                description: 'User Defined'
                                            }
                                        ]
                                    }),
                                    listeners: {
                                        change: function (combo, newValue, oldValue, eOpts) {
                                            // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                            var customValueField = combo.nextSibling('textfield');
                                            if (newValue === 'CUSTOM') {
                                                customValueField.enable();
                                                customValueField.isValid();
                                            } else {
                                                customValueField.disable();
                                                if (newValue) {
                                                    customValueField.setValue(newValue);
                                                } else {
                                                    customValueField.setValue('::');
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'delimiterValue',
                                    vtype: 'exceptcommaspace',
                                    flex: 1,
                                    disabled: true,
                                    readOnly: this.readOnly,
                                    allowBlank: false,
                                    value: '\\t'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: 'MapReduce',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'jar',
                    fieldLabel: 'Mahout JAR',
                    value: MAHOUT.JAR,
                    disabledCls: 'disabled-plain',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    value: 'org.apache.mahout.clustering.minhash.MinHashDriver',
                    disabledCls: 'disabled-plain',
                    allowBlank: false
                },
                {
                    xtype: '_dependencyGrid',
                    title: 'Dependency JAR',
                    flex: 1
                }
            ]
        },
        {
            title: 'Input column',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: '_prevColumnGrid',
                    readOnly: true,
                    flex: 1
                }
            ]
        },
        {
            title: 'Output column',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'hidden',
                    name: 'outputPathQualifier'
                },
                /*{
                 xtype : '_delimiterSelCmbField',
                 hidden: true
                 },*/
                {
                    xtype: '_columnGrid',
                    readOnly: true,
                    flex: 1
                }
            ]
        },
        {
            title: 'Hadoop Configuration',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: 'Enter a key and a value of Configuration.set () method used in Hadoop Mapreduce.'
                },
                {
                    xtype: '_keyValueGrid',
                    flex: 1
                }
            ]
        },
        {
            title: 'References',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://mahout.apache.org/users/algorithms/recommender-overview.html" target="_blank">Recommender Overview</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.slideshare.net/bigdatasyd/machine-learning-withmahout" target="_blank">Machine Learning with Mahout</a>'
                }
            ]
        }
    ],

    /**
     * UI 컴포넌트의 Key를 필터링한다.
     *
     * ex) 다음과 같이 필터를 설정할 수 있다.
     * propFilters: {
     *     // 추가할 프라퍼티
     *     add   : [
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
        remove: ['config']
    },

    /**
     * MapReduce의 커맨드 라인 파라미터를 수동으로 설정한다.
     * 커맨드 라인 파라미터는 Flamingo2 Workflow Engine에서 props.mapreduce를 Key로 꺼내어 구성한다.
     *
     * @param props UI 상에서 구성한 컴포넌트의 Key Value값
     */
    afterPropertySet: function (props) {
        props.mapreduce = {
            "driver": props.driver ? props.driver : '',
            "jar": props.jar ? props.jar : '',
            "confKey": props.hadoopKeys ? props.hadoopKeys : '',
            "confValue": props.hadoopValues ? props.hadoopValues : '',
            params: []
        };

        if (props.vectorFile) {
            props.mapreduce.params.push("-vectorFile", props.vectorFile);
        }

        if (props.outputFile) {
            props.mapreduce.params.push("-outputFile", props.outputFile);
        }

        if (props.overwrite) {
            props.mapreduce.params.push("-overwrite", props.overwrite);
        }

        if (props.minClusterSize) {
            props.mapreduce.params.push("-minClusterSize", props.minClusterSize);
        }

        if (props.minVectorSize) {
            props.mapreduce.params.push("-minVectorSize", props.minVectorSize);
        }

        if (props.algorithmOption) {
            props.mapreduce.params.push("-algorithmOption", props.algorithmOption);
        }

        if (props.numHashFunctions) {
            props.mapreduce.params.push("-numHashFunctions", props.numHashFunctions);
        }

        if (props.keyGroups) {
            props.mapreduce.params.push("-keyGroups", props.keyGroups);
        }

        if (props.numReducers) {
            props.mapreduce.params.push("-numReducers", props.numReducers);
        }

        if (props.delimiter) {
            if (props.delimiter == 'CUSTOM') {
                props.mapreduce.params.push("-delimiter", props.delimiterValue);
            } else {
                props.mapreduce.params.push("-delimiter", props.delimiter);
            }
        }

        this.callParent(arguments);
    }
});