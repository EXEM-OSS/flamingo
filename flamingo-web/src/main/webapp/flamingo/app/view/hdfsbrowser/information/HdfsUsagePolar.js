/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ext.define('Flamingo.view.hdfsbrowser.information.HdfsUsagePolar', {
    extend: 'Ext.Panel',
    alias: 'widget.hdfsUsagePolarPanel',

    border: true,

    items: [
        {
            xtype: 'polar',
            reference: 'hdfsUsagePolar',
            store: {
                fields: ['name', 'value']
            },
            shadow: true,
            interactions: 'itemhighlight',
            colors: ['#90ED7D', '#434348', '#7CB5EC'],
            series: {
                type: 'pie',
                style: {
                    stroke: 'gray' // line color
                },
                rotation: 0,
                angleField: 'value',
                label: {
                    field: 'name',
                    font: '12px NanumGothic',
                    fontFamily: 'NanumGothic',
                    calloutLine: {
                        length: -1,
                        width: 0
                    }
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (storeItem) {
                        this.setHtml(fileSize(storeItem.get('value')));
                    }
                }
            }
        }
    ],
    tools: [
        {
            type: 'refresh',
            tooltip: 'Refresh',
            handler: 'onHdfsUsagePolarRefreshClick'
        }
    ]
});