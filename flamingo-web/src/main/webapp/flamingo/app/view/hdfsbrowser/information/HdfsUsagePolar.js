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