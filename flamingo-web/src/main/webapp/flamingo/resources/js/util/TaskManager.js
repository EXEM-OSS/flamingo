/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
