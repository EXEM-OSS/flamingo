/**
 * Created by seungmin on 2016. 8. 16..
 */

Ext.define('Flamingo.model.oozie.bundle.BundleModel', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'jobId', mapping: 'id' },
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
        { name: 'end_time' },
        { name: 'kickoff_time' },
        { name: 'created_time' },
        { name: 'active', type: 'boolean'}
    ]
});
