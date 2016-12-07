/**
 * Created by seungmin on 2016. 8. 11..
 */


Ext.define('Flamingo.model.oozie.coordinator.CoordinatorActionModel', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'jobId', mapping: 'id' },
        { name: 'type' },
        {
            name: 'status',
            convert: function (value, record) {
                return statusConverter(value);
            }
        },
        { name: 'created_time', mapping: 'createdTime' },
        { name: 'nominal_time', mapping: 'nominalTime' },
        { name: 'last_modified_time', mapping: 'lastModifiedTime' },
        { name: 'error_code', mapping: 'errorCode' },
        { name: 'error_message', mapping: 'errorMessage' },
        { name: 'external_id', mapping: 'externalId' },
        { name: 'external_status', mapping: 'externalStatus' },
        { name: 'console_url', mapping: 'consoleUrl' },
        { name: 'tracker_uri', mapping: 'trackerUri' },
        { name: 'coordJobId' },
        { name: 'coordJobName' }
    ]
});