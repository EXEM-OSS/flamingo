Ext.define('Flamingo.view.oozie.dashboard.count.WorkflowChart', {
    extend: 'Ext.panel.Panel',
    xtype: 'workflowchart',
    layout: 'fit',


    items: {
        xtype: 'cartesian',
        reference: 'chart',
        bind: {
            store: '{wfCountStore}'
        },
        legend: {
            type: 'sprite',
            docked: 'bottom'
        },
        axes: [{
            type: 'numeric',
            position: 'left',
            grid: true,
            fields: ['succeeded', 'failed', 'killed']
        }, {
            type: 'category',
            position: 'bottom',
            grid: true,
            fields: 'start_time'
        }],
        series: [{
            type: 'line',
            xField: 'start_time',
            yField: 'succeeded',
            title: 'SUCCEEDED',
            style: {
                lineWidth: 2
            },
            marker: {
                radius: 4,
                lineWidth: 2
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
                    var title = item.series.getTitle();

                    tooltip.setHtml('<span style="color: white;">' + title +  ': ' + record.get(item.series.getYField()) + '</span>');
                }
            }
        },{
            type: 'line',
            xField: 'start_time',
            yField: 'failed',
            title: 'FAILED',
            style: {
                lineWidth: 2
            },
            marker: {
                radius: 4,
                lineWidth: 2
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
                    var title = item.series.getTitle();

                    tooltip.setHtml('<span style="color: white;">' + title +  ': ' + record.get(item.series.getYField()) + '</span>');
                }
            }
        },{
            type: 'line',
            xField: 'start_time',
            yField: 'killed',
            title: 'KILLED',
            style: {
                lineWidth: 2
            },
            marker: {
                radius: 4,
                lineWidth: 2
            },
            highlightCfg: {
                scaling: 2
            },
            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
                    var title = item.series.getTitle();

                    tooltip.setHtml('<span style="color: white;">' + title +  ': ' + record.get(item.series.getYField()) + '</span>');
                }
            }
        }]
    }
});