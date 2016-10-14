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
Ext.util.Observable.observe(Ext.data.Connection);
Ext.data.Connection.on('requestcomplete', function(conn, response, options, eOpts) {
    try {
        var r = Ext.decode(response.responseText);
        if (!Ext.isEmpty(r.sessionExpired) && r.sessionExpired) {
            Ext.Msg.show({
                title: '세선만료',//message.msg('main.session_expired'),
                message: '세션이 만료되었습니다.',//message.msg('main.msg.session_expired'),
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING,
                fn: function(btn) {
                    window.location = '/';
                }
            });
        }
    } catch (err) {

    }
});
Ext.data.Connection.on('requestexception', function(conn, response, options, eOpts) {
    switch(response.status) {
        case 401:
        case 909:
        case 999:
            Ext.Msg.show({
                title: '세션만료',//message.msg('main.session_expired'),
                message: '세션이 만료되었습니다',//message.msg('main.msg.session_expired'),
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING,
                fn: function(btn) {
                    window.location = '/';
                }
            });
            break;
    }
});
Ext.define('Override.data.Connection', {
    override: 'Ext.data.Connection',
    /**
     * HTTP POST Ajax 방식으로 서비스를 호출한다. 이 메소드는 XML 형식으로 요청하고 JSON 형식으로 응답을 받는다.
     *
     * @param httpUrl POST로 호출할 URL
     * @param params 요청으로 전달할 파라미터
     * @param body 요청으로 전달할 XML
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */

    invokePostByXML: function (httpUrl, params, body, onSuccess, onFailure) {
        Ext.Ajax.request({
            url: httpUrl,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/xml; charset=utf-8;'
            },
            params: params,
            xmlData: body,
            success: onSuccess,
            failure: onFailure
        });
    },

    /**
     * HTTP POST Ajax 방식으로 서비스를 호출한다. 이 메소드는 JSON 형식으로 요청 및 응답을 주고 받는다.
     *
     * @param httpUrl POST로 호출할 URL
     * @param map 파라미터로 전달할 Key Value 형식의 Map
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */
    invokePostByMap: function (httpUrl, map, onSuccess, onFailure) {
        Ext.Ajax.request({
            url: httpUrl,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8;'
            },
            params: Ext.encode(map),
            success: onSuccess,
            failure: onFailure
        });
    },

    /**
     * HTTP POST Ajax 방식으로 서비스를 호출한다. 이 메소드는 Text 형식으로 요청하고 JSON 형식으로 응답을 받는다.
     *
     * @param httpUrl POST로 호출할 URL
     * @param params 요청으로 전달할 파라미터
     * @param body 요청으로 전달할 Text
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */
    invokePostByText: function (httpUrl, params, body, onSuccess, onFailure) {
        Ext.Ajax.request({
            url: httpUrl,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain; charset=utf-8;'
            },
            params: params,
            xmlData: body,
            success: onSuccess,
            failure: onFailure
        });
    },

    /**
     * HTTP POST Ajax 방식으로 서비스를 호출한다. 이 메소드는 JSON 형식으로 요청하고 JSON 형식으로 응답을 받는다.
     *
     * @param httpUrl POST로 호출할 URL
     * @param params 요청으로 전달할 파라미터
     * @param body 요청으로 전달할 JSON
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */
    invokePostByJSON: function (httpUrl, params, body, onSuccess, onFailure) {
        Ext.Ajax.request({
            url: httpUrl,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8;'
            },
            params: params,
            xmlData: body,
            success: onSuccess,
            failure: onFailure
        });
    },

    /**
     * HTTP GET Ajax 방식으로 서비스를 호출한다. 이 메소드는 JSON 형식으로 응답을 주고 받는다.
     *
     * @param httpUrl GET로 호출할 URL
     * @param map 파라미터로 전달할 Key Value 형식의 Map
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */
    invokeGet: function (httpUrl, map, onSuccess, onFailure) {
        Ext.Ajax.request({
            url: httpUrl,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8;'
            },
            params: map,
            success: onSuccess,
            failure: onFailure
        });
    },

    invokeGetSync: function (b, e, g, c) {
        var d = function () {
            if (window.ActiveXObject) {
                try {
                    var h = new ActiveXObject("Msxml2.XMLHTTP");
                    return h
                } catch (j) {
                    try {
                        var h = new ActiveXObject("Microsoft.XMLHTTP");
                        return h
                    } catch (i) {
                        return null
                    }
                }
            } else {
                if (window.XMLHttpRequest) {
                    var h = new XMLHttpRequest();
                    return h
                } else {
                    return null
                }
            }
        };
        var a = b;
        var f = d();
        f.onreadystatechange = function () {
            if (f.readyState == 4) {
                if (f.status == 200) {
                    g(f)
                } else {
                    c(f)
                }
            }
        };
        f.open("GET", a, false);
        f.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        f.send(e)
    },

    /**
     * HTTP GET Ajax 방식으로 서비스를 호출한다. 이 메소드는 JSON 형식으로 응답을 주고 받는다.
     *
     * @param httpUrl GET로 호출할 URL
     * @param headers GET로 호출시 사용할 HTTP Header
     * @param map 파라미터로 전달할 Key Value 형식의 Map
     * @param onSuccess 성공시 호출하는 이벤트 콜백
     * @param onFailure 실패시 호출하는 이벤트 콜백
     */
    invokeGetWithHeader: function (httpUrl, headers, map, onSuccess, onFailure) {
        Ext.Ajax.request({
            url: httpUrl,
            method: 'GET',
            headers: headers,
            params: map,
            success: onSuccess,
            failure: onFailure
        });
    }
});
//Define Shortcut
var invokePostByMap = Ext.Ajax.invokePostByMap;
var invokeGet = Ext.Ajax.invokeGet;
var invokeGetSync = Ext.Ajax.invokeGetSync;
var invokePostByJSON = Ext.Ajax.invokePostByJSON;
var invokePostByXML = Ext.Ajax.invokePostByXML;
var invokeGetWithHeader = Ext.Ajax.invokeGetWithHeader;