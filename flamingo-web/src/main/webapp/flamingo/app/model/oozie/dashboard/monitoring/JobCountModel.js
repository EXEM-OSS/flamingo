Ext.define('Flamingo.model.oozie.dashboard.monitoring.JobCountModel', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'succeeded' },
        { name: 'failed' },
        { name: 'killed' },
        {
            name: 'start_time',
            convert: function(value) {
                return Ext.Date.format(new Date(value), "H");
            }
        }
    ]
});
