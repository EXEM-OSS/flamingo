Ext.define('util.Iterator', {
    singleton: true,
    
    array: new Array(),

    add: function (obj) {
        this.array[this.array.length] = obj;
    },

    iterator: function () {
        return new App.Util.Iterator(this)
    },

    length: function () {
        return this.array.length;
    },

    get: function (index) {
        return this.array[index];
    },

    addAll: function (obj) {
        if (obj instanceof Array) {
            for (var i = 0; i < obj.length; i++) {
                this.add(obj[i]);
            }
        } else if (obj instanceof ArrayList) {
            for (var i = 0; i < obj.length(); i++) {
                this.add(obj.get(i));
            }
        }
    }
});