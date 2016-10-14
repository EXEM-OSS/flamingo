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
Ext.define('Flamingo.view.workflowdesigner.property.mahout.ALG_MAHOUT_SEQ2SPARSE', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ALG',
    alias: 'widget.ALG_MAHOUT_SEQ2SPARSE',

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
                    xtype: 'textfield',
                    name: 'minSupport',
                    fieldLabel: 'Minimum Support',
                    value: '2',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'analyzerName',
                    fieldLabel: 'Minimum Support',
                    value: '2',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'chunkSize',
                    fieldLabel: 'Chunk Size(MB)',
                    value: '100',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'minDF',
                    fieldLabel: 'Min frequency within the document',
                    value: '1',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'maxDFSigma',
                    fieldLabel: 'Max frequency within the document',
                    value: '-1.0',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'maxDFPercent',
                    fieldLabel: 'Max Document frequency percent',
                    value: '99',
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Weight',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'weight',
                            value: 'TFIDF',
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
                                    {name: 'TF', value: 'TF', description: 'tf'},
                                    {name: 'TFIDF', value: 'TFIDF', description: 'tfidf'}
                                ]
                            })
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'norm',
                    itemId: 'normVal',
                    fieldLabel: 'Normalization'
                },
                {
                    xtype: 'textfield',
                    name: 'minLLR',
                    fieldLabel: 'Minimum log Likelihood Ratio',
                    value: '1.0',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'numReducers',
                    fieldLabel: 'Num. of Reducers',
                    value: '1',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'maxNGramSize',
                    fieldLabel: 'Maximum Ngram Size',
                    tooltip: '2=bigrams, 3=trigrams, etc.',
                    value: '1',
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Overwrite output directory',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'overwrite'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Sequential Access Vector',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'sequentialAccessVector'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Named Vector',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'namedVector'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Log Normalization',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'logNormalize'
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
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    value: 'org.apache.mahout.vectorizer.SparseVectorsFromSequenceFiles',
                    disabledCls: 'disabled-plain',
                    readOnly: true
                },
                {
                    xtype: '_dependencyGrid',
                    title: 'Dependency JAR',
                    flex: 1
                }
            ]
        },
        {
            title: 'I/O Path',
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
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Input Path',
                    defaults: {
                        hideLabel: true
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: '_browserField',
                            name: 'input',
                            allowBlank: false,
                            readOnly: false,
                            flex: 1
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Output path',
                    defaults: {
                        hideLabel: true
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: '_browserField',
                            name: 'output',
                            allowBlank: false,
                            readOnly: false,
                            flex: 1
                        }
                    ]
                }
            ],
            listeners: {
                afterrender: function (form, eOpts) {
                    var canvas = Ext.ComponentQuery.query('canvas')[0];
                    var canvasForm = canvas.getForm();
                }
            }
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
                    value: '<a href="https://mahout.apache.org/users/classification/bayesian.html" target="_blank">Naive Bayes</a>'
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

//        props.mapreduce.params.push("seq2sparse");

        if (props.input) {
            props.mapreduce.params.push("--input", props.input);
        }

        if (props.output) {
            props.mapreduce.params.push("--output", props.output);
        }

        if (props.minSupport) {
            props.mapreduce.params.push("--minSupport", props.minSupport);
        }

        if (props.analyzerName) {
            props.mapreduce.params.push("--analyzerName", props.analyzerName);
        }

        if (props.chunkSize) {
            props.mapreduce.params.push("--chunkSize", props.chunkSize);
        }

        if (props.minDF) {
            props.mapreduce.params.push("--minDF", props.minDF);
        }

        if (props.maxDFSigma) {
            props.mapreduce.params.push("--maxDFSigma", props.maxDFSigma);
        }

        if (props.maxDFPercent) {
            props.mapreduce.params.push("--maxDFPercent", props.maxDFPercent);
        }

        if (props.weight) {
            props.mapreduce.params.push("--weight", props.weight);
        }

        if (props.norm) {
            props.mapreduce.params.push("--norm", props.norm);
        }

        if (props.minLLR) {
            props.mapreduce.params.push("--minLLR", props.minLLR);
        }

        if (props.numReducers) {
            props.mapreduce.params.push("--numReducers", props.numReducers);
        }

        if (props.maxNGramSize) {
            props.mapreduce.params.push("--maxNGramSize", props.maxNGramSize);
        }

        if (props.overwrite) {
            props.mapreduce.params.push("--overwrite");
        }

        if (props.sequentialAccessVector) {
            props.mapreduce.params.push("--sequentialAccessVector", props.sequentialAccessVector);
        }

        if (props.namedVector) {
            props.mapreduce.params.push("--namedVector", props.namedVector);
        }

        if (props.logNormalize) {
            props.mapreduce.params.push("--logNormalize", props.logNormalize);
        }

        this.callParent(arguments);
    }
});