/**
 * Created by seungmin on 2016. 7. 19..
 */

Ext.define('Flamingo.view.oozie.bundle.BundleModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.bundleModel',

    stores: {
        bundleStore: {
            model: 'Flamingo.model.oozie.bundle.BundleModel',
            autoLoad: false,
            pageSize: 4,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.BUNDLE.SELECT,
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
        bundleActionStore: {
            model: 'Flamingo.model.oozie.bundle.BundleActionModel',
            autoLoad: false,
            pageSize: 4,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.BUNDLE.ACTION.SELECT,
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
        bundleCoordActionList: {
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

        bundleWorkflowActionList: {
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



