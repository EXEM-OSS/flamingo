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
Ext.define('Flamingo.view.workflowdesigner.property.mahout.ALG_MAHOUT_PARALLEL_ALS', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ALG',
    alias: 'widget.ALG_MAHOUT_PARALLEL_ALS',

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
                    name: 'lambda',
                    fieldLabel: 'Lambda',
                    allowBlank: false

                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: 'Implicit Feedback',
                    columns: 2,
                    items: [
                        {
                            xtype: 'radiofield',
                            boxLabel: 'True',
                            name: 'implicitFeedback',
                            inputValue: 'true'
                        },
                        {
                            xtype: 'radiofield',
                            boxLabel: 'False',
                            name: 'implicitFeedback',
                            inputValue: 'false'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'alpha',
                    fieldLabel: 'Alpha',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'numFeatures',
                    fieldLabel: 'Num. of Features',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'numIterations',
                    fieldLabel: 'Num. of Iterations',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'numThreadsPerSolver',
                    fieldLabel: 'Num of Threads per Mapper',
                    allowBlank: true
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: 'Uses Long IDs',
                    columns: 2,
                    items: [
                        {
                            xtype: 'radiofield',
                            boxLabel: 'True',
                            name: 'usesLongIDs',
                            inputValue: 'true'
                        },
                        {
                            xtype: 'radiofield',
                            boxLabel: 'False',
                            name: 'usesLongIDs',
                            inputValue: 'false'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Temp Directory',
                    defaults: {
                        hideLabel: true,
                        margin: "5 0 0 0"
                    },
                    layout: 'hbox',
                    items: [
                        {
                            xtype: '_browserField',
                            name: 'tempDir',
                            allowBlank: true,
                            readOnly: false,
                            flex: 1
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'startPhase',
                    fieldLabel: 'Start Phase',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'endPhase',
                    fieldLabel: 'End Phase',
                    allowBlank: true
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
                    value: 'org.apache.mahout.cf.taste.hadoop.als.ParallelALSFactorizationJob',
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
                        hideLabel: true,
                        margin: "5 0 0 0"  // Same as CSS ordering (top, right, bottom, left)
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
                    value: '<a href="http://mahout.apache.org/users/recommender/intro-als-hadoop.html" target="_blank">ALS Recommendations</a>'
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

//        props.mapreduce.params.push("parallelALS");

        if (props.input) {
            props.mapreduce.params.push("--input", props.input);
        }

        if (props.output) {
            props.mapreduce.params.push("--output", props.output);
        }

        if (props.lambda) {
            props.mapreduce.params.push("--lambda", props.lambda);
        }

        if (props.implicitFeedback) {
            props.mapreduce.params.push("--implicitFeedback", props.implicitFeedback);
        }

        if (props.alpha) {
            props.mapreduce.params.push("--alpha", props.alpha);
        }

        if (props.numFeatures) {
            props.mapreduce.params.push("--numFeatures", props.numFeatures);
        }

        if (props.numIterations) {
            props.mapreduce.params.push("--numIterations", props.numIterations);
        }

        if (props.numThreadsPerSolver) {
            props.mapreduce.params.push("--numThreadsPerSolver", props.numThreadsPerSolver);
        }

        if (props.usesLongIDs) {
            props.mapreduce.params.push("--usesLongIDs", props.usesLongIDs);
        }

        if (props.tempDir) {
            props.mapreduce.params.push("--tempDir", props.tempDir);
        }

        if (props.startPhase) {
            props.mapreduce.params.push("--startPhase", props.startPhase);
        }

        if (props.endPhase) {
            props.mapreduce.params.push("--endPhase", props.endPhase);
        }

        this.callParent(arguments);
    }
})
