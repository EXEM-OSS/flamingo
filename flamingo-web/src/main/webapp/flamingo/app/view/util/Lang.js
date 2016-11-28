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
Ext.define('Flamingo.view.util.Lang', {
    singleton: true,

    /**
     * 지정한 객체의 자료형을 반환한다.
     */
    getType: function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    },

    /**
     * 자료형을 검사한다.
     */
    is: function is(type, obj) {
        return obj !== undefined && obj !== null && this.getType(obj) === type;
    },

    /**
     * 배열 여부를 검사한다.
     */
    isArray: function (obj) {
        return this.is('Array', obj);
    },

    /**
     * 문자열 여부를 검사한다.
     */
    isString: function (obj) {
        return this.is('String', obj);
    },

    /**
     * 숫자 여부를 검사한다.
     */
    isNumber: function (obj) {
        return this.is('Number', obj);
    },

    /**
     * Boolean형으로 변환한다.
     */
    toBoolean: function (obj) {
        return (/^true$/i).test(obj);
    }
});

var toBoolean = util.Lang.toBoolean;