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
Ext.define('Flamingo.view.workflowdesigner.property.mahout.ALG_MAHOUT_STREAMING_K_MEANS', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ALG',
    alias: 'widget.ALG_MAHOUT_STREAMING_K_MEANS',

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
                    xtype: 'textfield',
                    name: 'numClusters',
                    fieldLabel: 'Num of Clusters',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'estimatedNumMapClusters',
                    fieldLabel: 'Use Mapper',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'estimatedDistanceCutoff',
                    fieldLabel: 'Estimate Cutoff Distance',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'maxNumIterations',
                    fieldLabel: 'Max. Number of Iteration',
                    value: '10',
                    vtype: 'numeric',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'trimFraction',
                    fieldLabel: 'Fractions normalization',
                    value: '0.9',
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Init Random Number',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'randomInit'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Ignore Weights',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'ignoreWeights'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'testProbability',
                    fieldLabel: 'Test Probability',
                    value: '0.1',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'numBallKMeansRuns',
                    fieldLabel: 'Run BallKMeans Num',
                    vtype: 'numeric',
                    value: '4',
                    allowBlank: true
                },
                {  //Distance Measure
                    xtype: 'textfield',
                    name: 'distanceMeasure',
                    fieldLabel: 'A Distance Measuring Instance Class Name',
                    tooltip: '',
                    value: 'org.apache.mahout.common.distance.SquaredEuclideanDistanceMeasure',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'searcherClass',
                    fieldLabel: 'Search Class',
                    value: 'org.apache.mahout.math.neighborhood.ProjectionSearch',
                    allowBlank: true
                },
                { //TODO:enabled when searcherClass is ProjectionSearch or  FastProjectionSearch
                    xtype: 'textfield',
                    name: 'numProjections',
                    fieldLabel: 'Projection Num',
                    vtype: 'numeric',
                    value: '3',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'searchSize',
                    fieldLabel: 'Search Num',
                    allowBlank: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Reduce KMeans Streaming',
                    defaultType: 'checkboxfield',
                    items: [
                        {
                            name: 'reduceStreamingKMeans'
                        }
                    ]
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: 'Execution Method',
                    columns: 2,
                    items: [
                        {
                            xtype: 'radiofield',
                            boxLabel: 'MapReduce',
                            name: 'method',
                            inputValue: 'mapreduce'
                        },
                        {
                            xtype: 'radiofield',
                            boxLabel: 'Sequential',
                            name: 'method',
                            inputValue: 'sequential'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'tempDir',
                    fieldLabel: 'Temp. Directory',
                    allowBlank: true
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
                    value: 'org.apache.mahout.clustering.streaming.mapreduce.StreamingKMeansDriver',
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
                    value: '<a href="http://mahout.apache.org/users/clustering/streaming-k-means.html" target="_blank">Streaming K-Means</a>'
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

//        props.mapreduce.params.push("streamingkmeans");

        if (props.input) {
            props.mapreduce.params.push("--input", props.input);
        }

        if (props.output) {
            props.mapreduce.params.push("--output", props.output);
        }

        if (props.overwrite) {
            props.mapreduce.params.push("--overwrite");
        }

        if (props.numClusters) {
            props.mapreduce.params.push("--numClusters", props.numClusters);
        }

        if (props.estimatedNumMapClusters) {
            props.mapreduce.params.push("--estimatedNumMapClusters", props.estimatedNumMapClusters);
        }

        if (props.estimatedDistanceCutoff) {
            props.mapreduce.params.push("--estimatedDistanceCutoff", props.estimatedDistanceCutoff);
        }

        if (props.maxNumIterations) {
            props.mapreduce.params.push("--maxNumIterations", props.maxNumIterations);
        }

        if (props.trimFraction) {
            props.mapreduce.params.push("--trimFraction", props.trimFraction);
        }

        if (props.randomInit) {
            props.mapreduce.params.push("--randomInit", props.randomInit);
        }

        if (props.ignoreWeights) {
            props.mapreduce.params.push("--ignoreWeights", props.ignoreWeights);
        }

        if (props.testProbability) {
            props.mapreduce.params.push("--testProbability", props.testProbability);
        }

        if (props.numBallKMeansRuns) {
            props.mapreduce.params.push("--numBallKMeansRuns", props.numBallKMeansRuns);
        }

        if (props.distanceMeasure) {
            props.mapreduce.params.push("--distanceMeasure", props.distanceMeasure);
        }

        if (props.searcherClass) {
            props.mapreduce.params.push("--searcherClass", props.searcherClass);
        }

        if (props.numProjections) {
            props.mapreduce.params.push("--numProjections", props.numProjections);
        }

        if (props.searchSize) {
            props.mapreduce.params.push("--searchSize", props.searchSize);
        }

        if (props.reduceStreamingKMeans) {
            props.mapreduce.params.push("--reduceStreamingKMeans", props.reduceStreamingKMeans);
        }

        if (props.method) {
            props.mapreduce.params.push("--method", props.method);
        }

        if (props.startPhase) {
            props.mapreduce.params.push("--startPhase", props.startPhase);
        }

        if (props.endPhase) {
            props.mapreduce.params.push("--endPhase", props.endPhase);
        }

        this.callParent(arguments);
    }
});