Ext.define('util.Map', {
    singleton: true,
    map: {},

    value: {},

    getKey: function (id) {
        return id;
    },

    put: function (id, value) {
        var key = this.getKey(id);
        this.value[key] = value;
    },

    contains: function (id) {
        var key = this.getKey(id);
        return this.value[key];
    },

    get: function (id) {
        var key = this.getKey(id);
        if (this.value[key]) {
            return this.value[key];
        }
        return null;
    },

    remove: function (id) {
        var key = this.getKey(id);
        if (this.contains(id)) {
            this.value[key] = undefined;
        }
    }
});