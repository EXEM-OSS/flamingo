Ext.define('Flamingo.view.oozie.systeminfo.SystemInfoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.systeminfoModel',

    stores: {
        confStore: {
            fields: ['name', 'value'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.SYSTEMINFO.CONFIGURATION_SELECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        propsStore: {
            fields: ['name', 'value'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.SYSTEMINFO.JAVA_SYSTEM_PROPS_SELECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        },

        envStore: {
            fields: ['name', 'value'],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: CONSTANTS.OOZIE.SYSTEMINFO.OS_ENV_SELECT,
                reader: {
                    type: 'json',
                    rootProperty: 'list',
                    totalProperty: 'total'
                }
            }
        }
    }
});