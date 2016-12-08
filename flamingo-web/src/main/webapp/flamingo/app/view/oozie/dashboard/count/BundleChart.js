Ext.define('Flamingo.view.oozie.dashboard.count.BundleChart', {
    extend: 'Ext.panel.Panel',
    xtype: 'bundlechart',

    layout: 'fit',
    items: [{
        xtype: 'cartesian',
        reference: 'bundleChart',
        insetPadding: '40 40 20 20',
        width: '100%',
        height: 500,
        bind: {
            store: '{bundleCountStore}'
        },
        sprites: [{
            type: 'text',
            text: 'Bundle',
            fontSize: 15,
            width: 100,
            height: 30,
            x: 40, // the sprite x position
            y: 20  // the sprite y position
        }],
        axes: [{
            type: 'numeric',
            minimum: 0,
            grid: true,
            position: 'left'
        }, {
            type: 'category',
            label: {
                fontSize: 10
            },
            grid: true,
            position: 'bottom',
            fields: ['start_time']
        }],
        series: [{
            type: 'line',
            title: 'Succeeded',
            marker: {
                type: 'circle',
                size: 2
            },
            style: {
                miterLimit: 0
            },
            xField: 'start_time',
            yField: 'count'
        }]
    }]
});