/**
 * Created by seungmin on 2016. 8. 17..
 */

Ext.define('Flamingo.model.oozie.bundle.BundleActionModel', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'jobId', mapping: 'coordJobId' },
        { name: 'app_name', mapping: 'coordJobName' },
        {
            name: 'status',
            convert: function (value, record) {
                return statusConverter(value);
            }
        },
        { name: 'user' },
        { name: 'group' },
        { name: 'frequency' },
        { name: 'time_unit', mapping: 'timeUnit' },
        { name: 'start_time', mapping: 'startTime' },
        { name: 'end_time', mapping: 'endTime' },
        { name: 'next_materiallized_time', mapping: 'nextMaterializedTime' }
    ]
});