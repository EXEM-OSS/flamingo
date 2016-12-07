Ext.define('Flamingo.view.oozie.dashboard.count.TotalCountChart', {
    extend: 'Ext.panel.Panel',
    xtype: 'totalchart',

    layout: 'fit',
    items: [{
        xtype: 'cartesian',
        reference: 'totalChart',
        insetPadding: '40 40 20 20',
        width: '100%',
        height: 500,
        bind: {
            store: '{totalCountStore}'
        },
        sprites: [{
            type: 'text',
            text: 'Workflow Total',
            fontSize: 15,
            width: 100,
            height: 30,
            x: 40, // the sprite x position
            y: 20  // the sprite y position
        }],
        /*legend: {
            docked: 'top'
        },*/
        axes: [{
            type: 'numeric',
            position: 'bottom',
            fields: 'count',
            grid: true
        },{
            type: 'category',
            position: 'left',
            fields: 'status',
            grid: true
        }],
        series: [{
            type: 'bar',
            xField: 'status',
            yField: 'count',
            label: {
                field: 'count',
                display: 'insideEnd'
            }
        }]
    }]
});