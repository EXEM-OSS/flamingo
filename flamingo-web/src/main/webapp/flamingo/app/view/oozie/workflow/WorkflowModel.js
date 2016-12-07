Ext.define('Flamingo.view.oozie.workflow.WorkflowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.workflowModel',

    stores: {
        workflowStore: {
            model: 'Flamingo.model.oozie.workflow.WorkflowModel',
            autoLoad: false,
            pageSize: 50,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.WORKFLOW.SELECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                },
                extraParams: {
                    timezoneId: getTimeZone()
                }
            }
        },

        workflowActionStore: {
            model: 'Flamingo.model.oozie.workflow.WorkflowActionModel',
            autoLoad: false,

            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.WORKFLOW.ACTION.SELECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                },
                extraParams: {
                    timezoneId: getTimeZone()
                }
            }
        },

        comboboxStore: {
                fields: ['key', 'name'],
                data: [{
                    'key': 'app_name',
                    'name': 'NAME'
                }, {
                    'key': 'id',
                    'name': 'ID'
                }, {
                    'key': 'user_name',
                    'name': 'USER'
                }]
        },

        statusStore: {
            fields: ['key', 'name', 'checked'],
            data: [{
                'key': 'ALL',
                'name': 'ALL',
                'checked': false
            },{
                'key': 'SUCCEEDED',
                'name': 'SUCCEEDED',
                'checked': false
            },{
                'key': 'FAILED',
                'name': 'FAILED',
                'checked': false
            },{
                'key': 'KILLED',
                'name': 'KILLED',
                'checked': false
            },{
                'key': 'RUNNING',
                'name': 'RUNNING',
                'checked': false
            },{
                'key': 'SUSPENDED',
                'name': 'SUSPENDED',
                'checked': false
            },{
                'key': 'PREP',
                'name': 'PREP',
                'checked': false
            }]
        },

        timeZones_store: {
            fields: ['timezoneDisplayName','timezoneId'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_TIMEZONE,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        childStore: {
            fields: [
                {
                    name: 'child_url',
                    convert: function(value) {
                        return '<a href="' + value + '" target="_blank">' + value +'</a>'
                    }
                }
            ],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.WORKFLOW.ACTION.CHILD_URL,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        }
    }
});






