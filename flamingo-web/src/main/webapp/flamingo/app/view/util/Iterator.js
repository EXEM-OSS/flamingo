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
Ext.define('Flamingo.view.util.Iterator', {
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