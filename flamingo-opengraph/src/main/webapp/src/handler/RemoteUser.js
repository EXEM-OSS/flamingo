/**
 * Remote User
 *
 * @class
 * @requires OG.*
 *
 * @example
 * var user = new OG.handler.RemoteUser(key, name, sessionId);
 *
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.handler.RemoteUser = function (key, name, sessionId) {

    this.key = key;
    this.name = name;
    this.sessionId = sessionId;
    this.isMaster = false;
    this.editable = false;
};
OG.handler.RemoteUser.prototype = {
    getKey: function () {
        return this.key;
    },
    setKey: function (key) {
        this.key = key;
    },
    getName: function () {
        return this.name;
    },
    setName: function (name) {
        this.name = name;
    },
    getSessionId: function () {
        return this.sessionId;
    },
    setSessionId: function (sessionId) {
        this.sessionId = sessionId;
    },
    getIsMaster: function () {
        return this.isMaster;
    },
    setIsMaster: function (ismaster) {
        this.isMaster = ismaster;
    },
    getEditable: function () {
        return this.editable;
    },
    setEditable: function (editable) {
        this.editable = editable;
    }
};
OG.handler.RemoteUser.prototype.constructor = OG.handler.RemoteUser;
OG.RemoteUser = OG.handler.RemoteUser();