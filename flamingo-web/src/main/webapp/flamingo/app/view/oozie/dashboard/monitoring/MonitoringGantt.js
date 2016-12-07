Ext.define('Flamingo.view.oozie.dashboard.monitoring.MonitoringGantt', {
    extend: 'Ext.tab.Panel',
    xtype: 'monitoringgantt',

    layout: 'fit',

    items: [{
        xtype: 'panel',
        title: 'Job Statistics Per Hour',
        layout: 'border',
        reference: 'gridPanel',
        items: [{
            xtype: 'component',
            region: 'north',
            height: 30,
            html:
            '<div style="background-color: white;">' +
                '<svg>' +
                    '<rect x="5px" y="10px" width="10px" height="10px" class="legend-succeeded"></rect>' +
                    '<text x="20px" y="20px">Succeeded</text>' +
                    '<rect x="85px" y="10px" width="10px" height="10px" class="legend-failed"></rect>' +
                    '<text x="100px" y="20px">Failed</text>'+
                '</svg>' +
            '</div>'
        },{
            xtype: 'timegrid',
            region: 'center',
            reference: 'timeGrid',
            scrollable: true,
            flex: 1,
            bind: {
                store: '{timeGridStore}'
            },
            listeners: {
                celldblclick: 'onCellDblClick'
            }
        },{
            xtype: 'timegriddetail',
            region: 'south',
            reference: 'timeGridDetail',
            scrollable: true,
            collapsed: true,
            collapsible: true,
            cls: 'panel-shadow',
            frame: true,
            collapseDirection: Ext.Component.DIRECTION_BOTTOM,
            margin: '5 0 0 0',
            height: 200,
            padding: '0 0 10 0',
            viewConfig: {
                emptyText: 'No data to display'
            },
            bind: {
                store: '{timeGridDetailStore}'
            },
            listeners: {
                rowdblclick: 'onJobHistoryRowDblClick'
            }
        }]
    },{
        xtype: 'panel',
        title: 'Timeline',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        reference: 'chartPanel',
        items: [{
            xtype: 'panel',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            tbar: ['->',{
                text: 'Zoom In',
                iconCls: 'fa fa-search-plus',
                handler: 'onZoomIn'
            },{
                text: 'Zoom Out',
                iconCls: 'fa fa-search-minus',
                handler: 'onZoomOut'
            },{
                text: 'Move Left',
                iconCls: 'fa fa-angle-double-left',
                handler: 'onMoveLeft'
            },{
                text: 'Move Right',
                iconCls: 'fa fa-angle-double-right',
                handler: 'onMoveRight'
            }],
            items: [{
                xtype: 'component',
                height: 30,
                flex: 1,
                html:
                '<div>' +
                    '<svg>' +
                        '<rect x="5px" y="10px" width="10px" height="10px" class="legend-succeeded"></rect>' +
                        '<text x="20px" y="20px">Succeeded</text>' +
                        '<rect x="85px" y="10px" width="10px" height="10px" class="legend-failed"></rect>' +
                        '<text x="100px" y="20px">Failed</text>'+
                    '</svg>' +
                '</div>'
            }]
        },{
            xtype: 'timeline',
            reference: 'timelineView',
            scrollable: true,
            flex: 1,
            bind: {
                store: '{workflowTimeline}'
            },
            options: {
                zoomable: false,
                editable: false,
                showCurrentTime: false,
                align: 'center',
                type: 'range'
            }
        }]
    }],
    listeners: {
        tabchange: 'onGridTabChange',
        beforeclose: 'onBeforeclose'
    }
});