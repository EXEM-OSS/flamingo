/**
 * Remote Repository
 *
 * @type {{}}
 * @private
 */
OG.handler.RemoteRepo = {};
/**
 * Remote Handler
 *
 * @class
 * @requires OG.*
 *
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.handler.RemoteHandler = function () {
    this._REPO = OG.handler.RemoteRepo;
    this._CLASSNAME = 'org.uengine.opengraph.RemoteService';
    this._SESSIONID = null;
    this._ENCODESUFFIX = '_%$';
    this._SCHEDULER = null;
};
OG.handler.RemoteHandler.prototype = {
    encodeJson: function (obj) {
        return JSON.stringify(obj).replace(/"/gi, this._ENCODESUFFIX);
    },
    getRepo: function () {
        return this._REPO;
    },
    setCanvasForIdentifier: function (canvas, identifier) {
        var repo = this.getRepo();
        if (!repo[identifier]) {
            repo[identifier] = {
                canvas: null,
                users: []
            };
        }
        repo[identifier].canvas = canvas;
        return repo[identifier];
    },
    getCanvasByIdentifier: function (identifier) {
        var repo = this.getRepo();
        if (!repo[identifier]) {
            return null;
        }

        return repo[identifier].canvas;
    },
    getRemote: function (param) {
        var obj = {
            __className: this._CLASSNAME
        };
        if (param) {
            for (var key in param) {
                obj[key] = param[key];
            }
        }
        return new MetaworksObject(obj, 'body');
    },
    /**
     * 서버로부터 온 Json User 객체를 OG.handler.RemoteUser 로 변환한다.
     *
     * @param serverUser Object
     * @return OG.handler.RemoteUser
     */
    convertRemoteUser: function (serverUser) {
        var remoteUser = new OG.handler.RemoteUser();
        remoteUser.setKey(serverUser['key']);
        remoteUser.setName(serverUser['name']);
        remoteUser.setSessionId(serverUser['sessionId']);
        remoteUser.setIsMaster(serverUser['isMaster']);
        remoteUser.setEditable(serverUser['editable']);
        return remoteUser;
    },
    /**
     * 사용된 메타웍스 오브젝트를 제거한다.
     * 브라우저 가비지 제거
     *
     * @param remote MetaworksObject
     *
     */
    closeRemote: function (remote) {
        var objectId = remote.__objectId;
        $('#objDiv_' + objectId).remove();
        delete mw3.objects[objectId];
    },
    getCanvasId: function (canvas) {
        return canvas._CONTAINER.id;
    },

    /**
     * 캔버스를 리모트모드로 변경한다.
     *
     * @param canvas 캔버스
     * @param identifier 리모트그룹 식별자
     * @param user OG.handler.RemoteUser 유저
     * @param callback Callback
     *
     * @return callback(OG.handler.RemoteUser) 서버 등록 후 갱신된 유저
     *
     */
    startRemote: function (canvas, identifier, user, callback) {
        var me = this;
        if (!canvas || !identifier || !user) {
            return;
        }
        if (!user.key || !user.name) {
            return;
        }
        canvas.setRemotable(true);
        canvas.setIdentifier(identifier);
        me.setCanvasForIdentifier(canvas, identifier);

        me.registeToServer(identifier, user, function (user) {
            callback(user);
        });
    },
    /**
     * 현재 자신의 세션아이디를 구한다.
     *
     * @param callback Callback
     *
     * @return callback(String sessionId) sessionId
     *
     */
    getSelfSession: function (callback) {
        if (this._SESSIONID) {
            callback(this._SESSIONID);
            return;
        }
        var me = this;
        var remote = this.getRemote();
        var objectId = remote.__objectId;
        remote.selfSession(null, function () {
            var sessionId = mw3.objects[objectId]['currentSessionId'];
            me.closeRemote(remote);

            if (sessionId) {
                me._SESSIONID = sessionId;
            }
            callback(sessionId);
        });
    },
    /**
     * 서버에 현재 사용자를 등록한다.
     *
     * @param identifier 리모트그룹 식별자
     * @param user OG.handler.RemoteUser 유저
     * @param callback Callback
     *
     * @return callback(OG.handler.RemoteUser) 등록된 유저
     *
     */
    registeToServer: function (identifier, user, callback) {

        var me = this, result;
        var remote = this.getRemote({
            identifier: identifier,
            remoteUser: me.encodeJson(user)
        });
        var objectId = remote.__objectId;
        remote.registe(null, function (value) {

            result = mw3.objects[objectId];
            me.closeRemote(remote);
            var remoteUser = me.convertRemoteUser(JSON.parse(result['remoteUser']));
            callback(remoteUser);
        })
    },

    /**
     * From Server.
     * 주어진 캔바스의 유저 목록을 업데이트한다.
     *
     * @param data identifier, 유저목록 remoteUsers
     *
     */
    updateRemoteUser: function (data) {
        var me = this;
        var parse = JSON.parse(data);
        var identifier = parse.identifier;
        var remoteServerUsers = parse.remoteUsers;

        if (!this.getRepo()[identifier]) {
            return;
        }

        var remoteUsers = [];
        var canvas = this.getCanvasByIdentifier(identifier);
        this.getSelfSession(function (sessionId) {
            $.each(remoteServerUsers, function (index, serverUser) {
                if (serverUser.sessionId && serverUser.sessionId == sessionId) {
                    canvas.setRemoteEditable(serverUser.editable);
                    canvas.setRemoteIsMaster(serverUser.isMaster);

                    $(canvas.getRootElement()).trigger('remoteStatusUpdated', [serverUser]);
                }
                if (serverUser.isMaster) {
                    remoteUsers.push(me.convertRemoteUser(serverUser));
                }
            });
            $.each(remoteServerUsers, function (index, serverUser) {
                if (!serverUser.isMaster) {
                    remoteUsers.push(me.convertRemoteUser(serverUser));
                }
            });
            me.getRepo()[identifier]['users'] = remoteUsers;


            var canvasDiv = $('#' + me.getCanvasId(canvas));
            canvasDiv.find('.userPanel').remove();
            var userPanel = $('<div class="userPanel"></div>');
            userPanel.css({
                position: 'absolute',
                top: '0px',
                left: '0px'
            });
            canvasDiv.append(userPanel);
            $.each(remoteUsers, function (index, remoteUser) {
                var userDiv = $('<div class="userDiv" data-key="' + remoteUser.getKey() + '"></div>');
                if (remoteUser.isMaster) {
                    userDiv.append('<span>' + remoteUser.getName() + ' (Master)</span>');
                } else {
                    userDiv.append('<span>' + remoteUser.getName() + ' </span>');

                    if (canvas.getRemoteIsMaster()) {
                        var controller;
                        if (!remoteUser.editable) {
                            controller = $('<button>Read Only</button>');
                            controller.data('identifier', identifier);
                            controller.data('mode', 'readonly');
                            controller.data('user', remoteUser);
                        } else {
                            controller = $('<button>Editable</button>');
                            controller.data('identifier', identifier);
                            controller.data('mode', 'editable');
                            controller.data('user', remoteUser);
                        }
                        userDiv.append(controller);

                        controller.click(function () {
                            var clickedIdentifier = $(this).data('identifier');
                            var clickedMode = $(this).data('mode');
                            var user = $(this).data('user');
                            if (clickedMode === 'readonly') {
                                user.setEditable(true);
                            } else {
                                user.setEditable(false);
                            }
                            me.updateUserState(clickedIdentifier, user, function () {

                            });
                        });
                    }
                }
                userPanel.append(userDiv);
            });
        });
    },

    /**
     * 서버에 사용자 상태를 업데이트시킨다.
     *
     * @param identifier 리모트그룹 식별자
     * @param user OG.handler.RemoteUser 유저
     * @param callback Callback
     *
     * @return callback(OG.handler.RemoteUser) 변경된 유저
     *
     */
    updateUserState: function (identifier, user, callback) {

        var me = this, result;
        var remote = this.getRemote({
            identifier: identifier,
            remoteUser: me.encodeJson(user)
        });
        var objectId = remote.__objectId;
        remote.updateUserState(null, function () {

            result = mw3.objects[objectId];
            me.closeRemote(remote);
            var remoteUser = me.convertRemoteUser(JSON.parse(result['remoteUser']));
            callback(remoteUser);
        })
    },

    /**
     * From Server.
     * 주어진 캔버스를 업데이트한다.
     *
     * @param data identifier, canvasJsonString
     *
     */
    updateCanvas: function (data) {
        var parse = JSON.parse(data);
        var identifier = parse.identifier;
        var canvasData = parse.canvasData;

        var canvas = this.getCanvasByIdentifier(identifier);
        if (!canvas || !canvas.getRemotable()) {
            return;
        }
        canvas.setRemoteDuring(true);
        canvas.loadJSON(canvasData);
        canvas.setRemoteDuring(false);
        $(canvas.getRootElement()).trigger('updateCanvas', [canvasData]);
    },

    /**
     * To Server.
     * 주어진 캔바스를 브로드캐스팅한다.
     *
     * @param OG.graph.Canvas canvas
     * @param callback Callback
     *
     * @return callback(OG.graph.Canvas) canvas
     */
    broadCastCanvas: function (canvas, callback) {
        if (!canvas.getRemotable()) {
            callback(null);
            return;
        }
        if (!canvas.getRemoteEditable()) {
            callback(null);
            return;
        }

        var identifier = canvas.getIdentifier();
        var me = this, result;
        var remote = this.getRemote({
            identifier: identifier,
            canvasData: me.encodeJson(canvas.toJSON())
        });
        var objectId = remote.__objectId;
        remote.broadCastCanvas(null, function () {
            result = mw3.objects[objectId];
            me.closeRemote(remote);
            callback(canvas);
        })
    },
    /**
     * To Server.
     * 주어진 리모트그룹에 사용자가 종료하였음을 알린다.
     *
     * @param identifier 리모트그룹 식별자
     * @param callback Callback
     *
     */
    remoteExit: function (identifier, callback) {

        var me = this, result;
        var remote = this.getRemote({
            identifier: identifier
        });
        var objectId = remote.__objectId;
        remote.remoteUserExited(null, function () {
            result = mw3.objects[objectId];
            me.closeRemote(remote);
            callback(null);
        })
    },
    /**
     * Scheduler, To Server.
     *
     * 브라우저의 재종료 없이 캔버스가 삭제되었을 경우
     * 관련 캐쉬를 삭제하고 서버에 사용자가 종료되었음을 알린다.
     *
     */
    checkExpiredRemoteCanvas: function () {
        if (this._SCHEDULER) {
            return;
        }

        var me = this, repo, identifier, canvas;
        this._SCHEDULER = setInterval(function () {
                repo = me.getRepo();
                for (identifier in repo) {
                    canvas = repo[identifier].canvas;
                    if (canvas && me.getCanvasId(canvas) && $('#' + me.getCanvasId(canvas)).length) {
                        return;
                    }
                    delete repo[identifier];
                    me.remoteExit(identifier, function () {
                    });
                }
            }, 1000
        );
    }
};
OG.handler.RemoteHandler.prototype.constructor = OG.handler.RemoteHandler;
OG.RemoteHandler = new OG.handler.RemoteHandler();
OG.RemoteHandler.checkExpiredRemoteCanvas();
