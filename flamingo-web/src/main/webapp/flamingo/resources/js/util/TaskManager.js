/**
 * @class App.TaskManager
 * @singleton
 * @author Cloudine Inc
 * @since 0.1
 */
Ext.define('util.TaskManager', {
    singleton: true,

    constructor: function (config) {
        config = config || {};
        var me = this;
        me.initialConfig = config;
        me.taskMap = new Ext.util.HashMap();
    },

    getKey: function (group, name) {
        return group + '_' + name;
    },

    getCount: function () {
        return this.taskMap.getCount();
    },

    start: function (group, name, task) {
        var key = this.getKey(group, name);
        if (this.taskMap.containsKey(key)) {
            this.stop(key);
        }

        this.taskMap.add(key, task);
        log(format(MSG.HADOOP_LOG_ADDED_TASK, key));
        log(format(MSG.HADOOP_LOG_COUNT_TASK, this.taskMap.getCount()));

        Ext.TaskManager.start(task);
    },

    stop: function (group, name) {
        var key = this.getKey(group, name);
        var task = this.taskMap.get(key);
        if (task) {
            this.taskMap.removeAtKey(key);
            Ext.TaskManager.stop(task);

            log(format(MSG.HADOOP_LOG_REMOVED_TASK, key));
            log(format(MSG.HADOOP_LOG_COUNT_TASK, this.taskMap.getCount()));
        }
    },

    stopAll: function (group) {
        var map = this.taskMap;
        this.taskMap.each(function (key, value, length) {
            if (startsWith(key, group + '_')) {
                map.removeAtKey(key);
                Ext.TaskManager.stop(value);
                log(format(MSG.HADOOP_LOG_REMOVED_TASK, key));
                log(format(MSG.HADOOP_LOG_COUNT_TASK, map.getCount()));
            }
        });
    }
});
