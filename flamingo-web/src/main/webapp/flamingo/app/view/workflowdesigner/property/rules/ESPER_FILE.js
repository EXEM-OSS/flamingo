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
 * CEP Esper File
 *
 * @cli hadoop jar flamingo2-mapreduce-hadoop2-2.0.5-job.jar esper --input <INPUT> --output <OUTPUT> --delimiter ',' --columnNames 'name,product,id' --eplPath <PATH> --deleteOutput true
 * @extend Flamingo.view.workflowdesigner.property._NODE_ETL
 * @author <a href="mailto:haneul.kim@cloudine.co.kr">Haneul, Kim</a>
 * @see <a href="http://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html" target="_blank">Apache Hadoop MapReduce Tutorial</a>
 * @see <a href="http://www.espertech.com/esper/tutorial.php" target="_blank">Esper Tutorial</a>
 */
Ext.ns('Flamingo.view.workflowdesigner.property.rules');
Ext.define('Flamingo.view.workflowdesigner.property.rules.ESPER_FILE', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ETL',
    alias: 'widget.ESPER_FILE',

    width: 450,
    height: 320,

    items: [
        {
            title: 'Parameter',
            xtype: 'form',
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                labelWidth: 170
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Log Delimiter',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'delimiter',
                            allowBlank: false,
                            value: ',',
                            editable: false,
                            displayField: 'name',
                            valueField: 'value',
                            queryMode: 'local',
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
                                        value: '\u0009',
                                        description: '\\t'
                                    },
                                    {
                                        name: 'Blank',
                                        value: '\u0020',
                                        description: ' '
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
                                    var customValueField = combo.next('textfield');
                                    if (newValue === 'CUSTOM') {
                                        customValueField.enable();
                                        customValueField.isValid();
                                    } else {
                                        customValueField.disable();
                                        if (newValue) {
                                            customValueField.setValue(newValue);
                                        } else {
                                            customValueField.setValue(',');
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'delimiterValue',
                            flex: 1,
                            vtype: 'exceptcommaspace',
                            disabled: true,
                            allowBlank: false,
                            value: ','
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Log Column Names',
                    name: 'columnNames',
                    emptyText: 'Separated by \',\'',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Column Types',
                    name: 'columnTypes',
                    emptyText: 'Column types are empty',
                    regex: /^(string|int|integer|long|boolean|byte|float|double)+(,(string|int|integer|long|boolean|byte|float|double)+)*$/,
                    regexText: 'Column types REGEX',
                    allowBlank: false
                },
                {
                    xtype: '_browserField',
                    fieldLabel: 'Esper path',
                    name: 'eplPath',
                    allowBlank: false,
                    readOnly: false,
                    flex: 1
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
                    fieldLabel: 'JAR Path',
                    value: ETL.JAR,
                    disabledCls: 'disabled-plain',
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    value: 'esper',
                    disabledCls: 'disabled-plain',
                    readOnly: true
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
                    xtype: '_inputGrid',
                    title: 'Input Path',
                    flex: 1
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
                    value: '<a href="http://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html" target="_blank">Apache Hadoop MapReduce Tutorial</a>'
                },
                {
                    xtype: 'displayfield',
                    height: 20,
                    value: '<a href="http://www.espertech.com/esper/tutorial.php" target="_blank">Esper Tutorial</a>'
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
            driver: props.driver || '',
            jar: props.jar || '',
            confKey: props.hadoopKeys || '',
            confValue: props.hadoopValues || '',
            params: []
        };

        if (props.input) {
            props.mapreduce.params.push("--input", props.input);
        }
        if (props.output) {
            props.mapreduce.params.push("--output", props.output);
        }
        props.mapreduce.params.push('--delimiter', '\'' + (props.delimiter === 'CUSTOM' ? props.delimiterValue : props.delimiter) + '\'');
        props.mapreduce.params.push("--columnNames", '\'' + props.columnNames + '\'');
        props.mapreduce.params.push("--columnTypes", '\'' + props.columnTypes + '\'');
        props.mapreduce.params.push("--eplPath", props.eplPath);

        this.callParent(arguments);
    }
});