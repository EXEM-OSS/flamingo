Ext.define('Flamingo.model.oozie.workflow.WorkflowModel', {
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
        { name: 'run' },
        { name: 'user', mapping: 'user_name' },
        { name: 'duration',
            convert: function(value, record) {
                var start, end, diff;

                if (record.get('status').match('RUNNING') != null) {
                    start = Ext.Date.parse(record.get('start_time'), "Y-m-d H:i:s", true);
                    end = new Date();
                    diff = (end.getTime() - start.getTime()) / 1000;
                    return toHumanReadableTime(Math.floor(diff));
                } else if (
                    record.get('status').match('SUCCEEDED') != null ||
                    record.get('status').match('FAILED') != null ||
                    record.get('status').match('KILLED') != null) {
                    start = Ext.Date.parse(record.get('start_time'), "Y-m-d H:i:s", true);
                    end = Ext.Date.parse(record.get('end_time'), "Y-m-d H:i:s", true);
                    diff = (end.getTime() - start.getTime()) / 1000;
                    return toHumanReadableTime(Math.floor(diff));
                } else {
                    return '';
                }
            }
        },
        { name: 'created_time' },
        { name: 'start_time' },
        { name: 'last_modified_time' },
        { name: 'end_time' },
        { name: 'parent', mapping: 'parent_id' },
        { name: 'active', type: 'boolean'}
    ]
});
