Ext.define('Flamingo.view.oozie.dashboard.DashBoardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashBoardModel',

    data: {
        workflow: {
            appsRunning: 0,
            appsSucceeded: 0,
            appsKilled: 0,
            appsSuspended: 0,
            appsAll: 0,
            appsFailed: 0,
            appsPrep: 0
        }
    },

    stores: {
        jobCombobox: {
            fields: ['name', 'value'],
            data: [{
                'name': 'Workflow',
                'value': 'WORKFLOW'
            },{
                'name': 'Coordinator',
                'value': 'COORDINATOR'
            },{
                'name': 'Bundle',
                'value': 'BUNDLE'
            }]
        },
        workflowStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.WorkflowModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WORKFLOW,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        workflowActionStore: {
            model: 'Flamingo.model.oozie.workflow.WorkflowActionModel',
            autoLoad: false,

            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WORKFLOW_ACTION,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        coordStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.CoordModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_COORDINATOR,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        bundleStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.BundleModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_BUNDLE,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        timeGridStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.GanttModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_GANTTGRID,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        timeGridDetailStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.WorkflowModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_GANTTGRIDDETAIL,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        wfCountStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.JobCountModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WFCOUNT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        coordCountStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.JobCountModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_COORDCOUNT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        bundleCountStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.JobCountModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_BUNDLECOUNT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        totalCountStore: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.JobCountModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_TOTALCOUNT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        workflowTimeline: {
            model: 'Flamingo.model.oozie.dashboard.monitoring.Timeline',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WORKFLOW_TIMELINE,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total',
                    keepRawData: true
                }
            }
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