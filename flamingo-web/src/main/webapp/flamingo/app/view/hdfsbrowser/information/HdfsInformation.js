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
Ext.define('Flamingo.view.hdfsbrowser.information.HdfsInformation', {
    extend: 'Ext.Panel',
    alias: 'widget.hdfsInformationPanel',

    requires: [
        'Flamingo.view.hdfsbrowser.information.HdfsInformationController',
        'Flamingo.view.hdfsbrowser.information.HdfsInformationModel',
        'Flamingo.view.hdfsbrowser.information.HdfsSummary',
        'Flamingo.view.hdfsbrowser.information.HdfsUsagePolar'
    ],

    controller: 'hdfsInformationViewController',
    viewModel: 'hdfsInformationModel',

    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'hdfsSummaryPanel',
            title: 'HDFS Summary',
            iconCls: 'fa fa-newspaper-o fa-fw',
            autoScroll: true,
            flex: 1,
            margin: '0 0 5 0'
        },
        {
            xtype: 'hdfsUsagePolarPanel',
            title: 'HDFS Usage (DFS, Non-DFS)',
            iconCls: 'fa fa-pie-chart fa-fw',
            layout: 'fit',
            margin: '0 5 5 5',
            width: 300
        },
        {
            xtype: 'hdfsTop5DirectoryPanel',
            title: 'HDFS Top 5 Directory (Root Standard)',
            iconCls: 'fa fa-tasks fa-fw',
            width: 300,
            margin: '0 0 5 0'
        }
    ],
    listeners: {
        afterrender: 'onAfterRender'
    }
});