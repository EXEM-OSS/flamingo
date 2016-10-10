/**
 * @class App.Util.Lang
 * @singleton
 * @author Cloudine Inc
 * @since 0.1
 */
Ext.define('util.Lang', {
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