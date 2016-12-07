Ext.define('Flamingo.model.oozie.dashboard.monitoring.BundleModel', {
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
        { name: 'user_name' },
        { name: 'kickoff_time' },
        { name: 'created_time' }
    ]
});
