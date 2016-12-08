Ext.define('Flamingo.model.oozie.dashboard.monitoring.CoordModel', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id' },
        { name: 'app_name' },
        { name: 'app_path' },
        {
            name: 'status',
            convert: function (value, record) {
                return statusConverter(value);
            }
        },
        { name: 'group_name' },
        { name: 'frequency' },
        { name: 'user_name' },
        { name: 'time_unit' },
        { name: 'start_time' },
        { name: 'next_matd_time' },
        { name: 'end_time' }
    ]
});
