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
 * ETL Grep
 *
 * @cli hadoop jar flamingo2-mapreduce-hadoop2-2.0.5-job.jar grep --input <IN> --output <OUT> --inputDelimiter ',' --outputDelimiter '|' --columnSize 12 --grepMode COLUMN --columnsToGrep 0 --regEx '112\.216\.16\.138'
 * @extend Flamingo.view.workflowdesigner.property._NODE_ETL
 * @author <a href="mailto:haneul.kim@cloudine.co.kr">Haneul, Kim</a>
 * @see <a href="http://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html" target="_blank">Apache Hadoop MapReduce Tutorial</a>
 */
Ext.ns('Flamingo.view.workflowdesigner.property.etl');
Ext.define('Flamingo.view.workflowdesigner.property.etl.ETL_GREP', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_ETL',
    alias: 'widget.ETL_GREP',

    width: 450,
    height: 320,

    items: [
        {
            title: 'Parameter',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 170
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Input Delimiter',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: 'inputDelimiter',
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
                            name: 'inputDelimiterValue',
                            flex: 1,
                            vtype: 'exceptcommaspace',
                            disabled: true,
                            allowBlank: false,
                            value: ','
                        }
                    ]
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Column Size',
                    name: 'columnSize',
                    minValue: 0,
                    allowBlank: false
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Grep Mode',
                    name: 'grepMode',
                    value: 'ROW',
                    allowBlank: false,
                    editable: false,
                    displayField: 'displ',
                    valueField: 'value',
                    queryMode: 'local',
                    store: {
                        fields: ['displ', 'value'],
                        data: [
                            {displ: 'ROW', value: 'ROW'},
                            {displ: 'COLUMN', value: 'COLUMN'}
                        ]
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Grep to columns',
                    name: 'columnsToGrep',
                    emptyText: 'Only when Grep Mode is COLUMN, Starts to 0, separated by \',\'',
                    minValue: 0,
                    value: 0
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Regexp',
                    name: 'regEx',
                    allowBlank: false
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
                    value: 'grep',
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
                // MapReduce가 동작하는데 필요한 입력 경로를 지정한다.  이 경로는 N개 지정가능하다.
                {
                    xtype: '_inputGrid',
                    title: 'Input Path',
                    flex: 1
                },
                // MapReduce가 동작하는데 필요한 출력 경로를 지정한다. 이 경로는 오직 1개만 지정가능하다.
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
        props.mapreduce.params.push('--inputDelimiter', '\'' + (props.inputDelimiter === 'CUSTOM' ? props.inputDelimiterValue : props.inputDelimiter) + '\'');
        props.mapreduce.params.push('--columnSize', props.columnSize);
        props.mapreduce.params.push('--grepMode', props.grepMode);
        if (props.grepMode === 'COLUMN') {
            props.mapreduce.params.push('--columnsToGrep', props.columnsToGrep);
        }
        props.mapreduce.params.push('--regEx', props.regEx);

        this.callParent(arguments);
    }
});