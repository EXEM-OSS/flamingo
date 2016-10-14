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
Ext.define('Flamingo.view.workflowdesigner.nodeList.NodeTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.nodeTab',

    requires: [
        'Flamingo.view.workflowdesigner.nodeList.NodeList'
    ],

    minTabWidth: 120,

    items: [
        {
            title: 'All',
            xtype: 'nodeList'
        },
        {
            title: 'Hadoop Ecosystem',
            xtype: 'nodeList',
            type: 'HADOOP'
        },
        {
            title: 'Statistics',
            xtype: 'nodeList',
            type: 'STATISTICS'
        },
        {
            title: 'Data Process',
            xtype: 'nodeList',
            type: 'ETL'
        },
        {
            title: 'Ankus',
            xtype: 'nodeList',
            type: 'MINING'
        },
        {
            title: 'Mahout',
            xtype: 'nodeList',
            type: 'MAHOUT'
        },
        {
            title: 'In-Memory',
            xtype: 'nodeList',
            type: 'INMEMORY'
        },
        {
            title: 'Integration',
            xtype: 'nodeList',
            type: 'INT'
        },
        {
            title: 'RULES',
            xtype: 'nodeList',
            type: 'RULES'
        },
        {
            title: 'ETC',
            xtype: 'nodeList',
            type: 'OTHERS'
        },
        {
            title: 'GIS',
            xtype: 'nodeList',
            type: 'GIS'
        }
    ]
});