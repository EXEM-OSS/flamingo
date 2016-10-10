Ext.define('util.JavaMap', {
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