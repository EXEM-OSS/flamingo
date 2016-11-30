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
 * Spark Job Property View
 * spark-submit
 * --class 'Reasoner'
 * --master yarn-cluster
 * --executor-memory 64g
 * --executor-cores 24
 * target/scala-2.10/reasoner_2.10-1.0.jar
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property.OOZIE_SPARK
 */
Ext.define('Flamingo.view.workflowdesigner.property.OOZIE_SPARK', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.OOZIE_SPARK',

    requires: [
        'Flamingo.view.workflowdesigner.property._JarBrowserField',
        'Flamingo.view.workflowdesigner.property._BrowserField',
        'Flamingo.view.workflowdesigner.property._InputGrid',
        'Flamingo.view.workflowdesigner.property._JarGrid',
        'Flamingo.view.workflowdesigner.property._KeyValueGrid'
    ],

    width: 600,
    height: 360,

    items: [
        {
            title: 'Spark',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 120
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    value: 'When Spark Cluster is running on YARN, Spark Master URL must be set to a yarn-cluster. Total Executor CORE parameter is ignored. <a href\="https\://spark.apache.org/docs/latest/running-on-yarn.html" target\="_blank">Running Spark on YARN</a> <a href\="https\://spark.apache.org/docs/latest/submitting-applications.html" target\="_blank">Submitting Applications</a>',
                    height: 40
                },
                {
                    xtype: '_jarBrowserField',
                    name: 'jar',
                    fieldLabel: 'Spark JAR',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Spark Driver',
                    emptyText: 'org.apache.spark.examples.SparkPi',
                    allowBlank: false
                },
                {
                    xtype: 'checkboxfield',
                    name: 'yarn',
                    itemId: 'yarn',
                    checked: true,
                    fieldLabel: 'YARN',
                    boxLabel: 'Use',
                    handler: function (check) {
                        var sparkMasterUrl = check.nextSibling('textfield');

                        if (check.checked) {
                            sparkMasterUrl.setValue('yarn-cluster');
                        } else {
                            // 처음 로딩한 url 값이 호스트네임 패턴일 경우 한 번더 체크
                            if (sparkMasterUrl.lastValue != config['spark.master.url']
                                && sparkMasterUrl.lastValue != sparkMasterUrl.initialValue) {
                                sparkMasterUrl.setValue(sparkMasterUrl.lastValue);
                            } else {
                                sparkMasterUrl.setValue(config['spark.master.url']);
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'sparkMasterUrl',
                    itemId: 'sparkMasterUrl',
                    fieldLabel: 'Spark Master URL',
                    emptyText: 'Standalone Mode',
                    allowBlank: false,
                    value: 'yarn-cluster'
                },
                {
                    xtype: 'textfield',
                    name: 'totalExecutorCores',
                    fieldLabel: 'Total Executor COREs',
                    emptyText: 'Standalone Mode (--total-executor-cores)',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'executorMemory',
                    fieldLabel: 'Executor Memory',
                    emptyText: 'YARN & Standalone Mode (--executor-memory)',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'numExecutors',
                    fieldLabel: 'Executors',
                    emptyText: 'YARN & Standalone Mode (--num-executors)',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'driverMemory',
                    fieldLabel: 'Driver Memory',
                    emptyText: 'YARN Mode (--driver-memory)',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'queue',
                    fieldLabel: 'Queue',
                    emptyText: 'YARN Mode (--queue)',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'executorCores',
                    fieldLabel: 'Executor COREs',
                    emptyText: 'YARN Mode (--executor-cores)',
                    allowBlank: true
                }
            ]
        },
        {
            title: 'Dependency (JAR)',
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
                    value: 'Adds necessary dependencies for Spark jobs.'
                },
                {
                    xtype: '_jarGrid',
                    title: 'Dependency (JAR)',
                    name: 'dependencies',
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
                    value: 'Set additional key\=value when executing Spark Jobs. Parameters for the --conf option.'
                },
                {
                    xtype: '_keyValueGrid',
                    flex: 1
                }
            ]
        },
        {
            title: 'Command Parameter',
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
                    value: 'Set necessary parameters for Spark jobs. i.e. HDFS input path, output path, etc.'
                },
                {
                    xtype: '_commandlineGrid',
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
                    value: '<a href="https://spark.apache.org/docs/latest/" target="_blank">Apache Spark</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="https://spark.apache.org/examples.html" target="_blank">Spark Examples</a>'
                }
            ]
        }
    ],
    listeners: {
        afterrender: function () {
            var sparkMasterUrl = query('HADOOP_SPARK #sparkMasterUrl');
            var yarn = query('HADOOP_SPARK #yarn');

            if (sparkMasterUrl.lastValue == sparkMasterUrl.initialValue) {
                yarn.setValue(1);
            } else {
                sparkMasterUrl.setValue(sparkMasterUrl.lastValue);
                yarn.setValue(0);
            }
        }
    }
});