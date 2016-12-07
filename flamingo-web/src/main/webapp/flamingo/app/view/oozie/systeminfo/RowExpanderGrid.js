Ext.define('Flamingo.view.oozie.systeminfo.RowExpanderGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'rowexpandergrid',
    
    columnLines: true,

    columns: [
        {text: "Name", width: 450, dataIndex: 'key', menuDisabled: true},
        {text: "Value", dataIndex: 'value', flex: 1, menuDisabled: true}
    ],
    scrollable: true,
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl : new Ext.XTemplate(
            '<p><b>Name: </b> {key}</p>',
            '<p><b>Value: </b> {value}</p>'
        )
    }]
});