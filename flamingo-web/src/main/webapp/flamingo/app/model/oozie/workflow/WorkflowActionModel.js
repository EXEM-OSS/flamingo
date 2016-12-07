Ext.define('Flamingo.model.oozie.workflow.WorkflowActionModel', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'wf_app_name' },
        { name: 'wf_app_path' },
        { name: 'wf_parent' },
        { name: 'wf_conf' },
        { name: 'wf_job_id' },
        { name: 'jobId', mapping: 'id' },
        { name: 'app_name', mapping: 'name' },
        { name: 'type' },
        { name: 'status' },
        { name: 'transition' },
        { name: 'start_time', mapping: 'startTime' },
        { name: 'end_time', mapping: 'endTime' },
        { name: 'duration',
            convert: function(value, record) {
                var start, end, diff;

                if (record.get('status').match('RUNNING') != null) {
                    start = Ext.Date.parse(record.get('start_time'), "Y-m-d H:i:s", true);
                    end = new Date();
                    diff = (end.getTime() - start.getTime()) / 1000;
                    return toHumanReadableTime(Math.floor(diff));
                } else if (
                    record.get('status').match('OK') != null ||
                    record.get('status').match('ERROR') != null) {
                    start = Ext.Date.parse(record.get('start_time'), "Y-m-d H:i:s", true);
                    end = Ext.Date.parse(record.get('end_time'), "Y-m-d H:i:s", true);
                    diff = (end.getTime() - start.getTime()) / 1000;
                    return toHumanReadableTime(Math.floor(diff));
                } else {
                    return '';
                }
            }
        },
        { name: 'error_code', mapping: 'errorCode' },
        { name: 'error_message', mapping: 'errorMessage' },
        { name: 'external_id', mapping: 'externalId' },
        { name: 'external_status', mapping: 'externalStatus' },
        { name: 'console_url', mapping: 'consoleUrl' },
        { name: 'tracker_uri', mapping: 'trackerUri' },
        { name: 'configuration', mapping: 'conf' }
    ]
});