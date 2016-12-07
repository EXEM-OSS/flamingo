Ext.define('Flamingo.model.oozie.dashboard.monitoring.WorkflowModel', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id' },
        { name: 'app_name' },
        { name: 'app_path' },
        { name: 'status' },
        { name: 'group_name' },
        { name: 'run' },
        { name: 'user_name' },
        { name: 'definition' },
        { name: 'configuration' },
        { name: 'log' },
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
        { name: 'parent_id' }
    ]
});
