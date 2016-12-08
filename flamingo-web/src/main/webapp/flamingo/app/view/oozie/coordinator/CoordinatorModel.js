Ext.define('Flamingo.view.oozie.coordinator.CoordinatorModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.coordinatorModel',

    stores: {
        coordinatorStore: {
            model: 'Flamingo.model.oozie.coordinator.CoordinatorModel',
            autoLoad: false,
            pageSize: 4,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.COORDINATOR.SELECT,
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
        coordinatorActionStore: {
            model: 'Flamingo.model.oozie.coordinator.CoordinatorActionModel',
            autoLoad: false,
            pageSize: 4,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.COORDINATOR.ACTION.SELECT,
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

        coordWorkflowActionList: {
            model: 'Flamingo.model.oozie.workflow.WorkflowActionModel',
            autoLoad: false,

            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.WORKFLOW.ACTION.SELECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
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
            fields: ['key', 'name'],
            data: [{
                'key': 'ALL',
                'name': 'ALL'
            },{
                'key': 'SUCCEEDED',
                'name': 'SUCCEEDED'
            },{
                'key': 'FAILED',
                'name': 'FAILED'
            },{
                'key': 'KILLED',
                'name': 'KILLED'
            },{
                'key': 'RUNNING',
                'name': 'RUNNING'
            },{
                'key': 'SUSPENDED',
                'name': 'SUSPENDED'
            },{
                'key': 'PREP',
                'name': 'PREP'
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
        }
    }
});






