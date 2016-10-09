/*
 * Copyright (C) 2011  Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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

    viewModel: {
        type: 'hdfsInformationModel'
    },

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