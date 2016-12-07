/**
 * Created by seungmin on 2016. 8. 11..
 */

Ext.define('Flamingo.model.oozie.coordinator.CoordinatorModel', {
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
        { name: 'group', mapping: 'group_name' },
        { name: 'user', mapping: 'user_name' },
        { name: 'start_time' },
        { name: 'last_modified_time' },
        { name: 'end_time' },
        { name: 'next_materiallized_time', mapping: 'next_matd_time' },
        { name: 'parent', mapping: 'bundle_id' },
        { name: 'unit', mapping: 'time_unit' },
        { name: 'concurrency' },
        { name: 'frequency' },
        { name: 'active', type: 'boolean' }
    ]
});
