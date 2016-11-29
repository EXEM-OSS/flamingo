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
Ext.define('Flamingo.view.util.JavaMap', {
    singleton: true,
    
    keys: new Array(),

    contains: function (key) {
        var entry = this.findEntry(key);
        return !(entry == null || entry instanceof App.Util.NullKey);
    },

    get: function (key) {
        var entry = this.findEntry(key);
        if (!(entry == null || entry instanceof App.Util.NullKey))
            return entry.value;
        else
            return null;
    },

    put: function (key, value) {
        var entry = this.findEntry(key);
        if (entry) {
            entry.value = value;
        } else {
            this.addNewEntry(key, value);
        }
    },

    remove: function (key) {
        for (var i = 0; i < keys.length; i++) {
            var entry = keys[i];
            if (entry instanceof App.Util.NullKey) continue;
            if (entry.key == key) {
                keys[i] = App.Util.NullKey;
            }
        }
    },

    findEntry: function (key) {
        for (var i = 0; i < keys.length; i++) {
            var entry = keys[i];
            if (entry instanceof App.Util.NullKey) continue;
            if (entry.key == key) {
                return entry
            }
        }
        return null;
    },

    addNewEntry: function (key, value) {
        var entry = new Object();
        entry.key = key;
        entry.value = value;
        keys[keys.length] = entry;
    }
});