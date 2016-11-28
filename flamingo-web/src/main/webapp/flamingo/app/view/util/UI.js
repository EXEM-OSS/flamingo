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
Ext.define('Flamingo.view.util.UI', {
    singleton: true,

    /**
     * ExtJS Grid의 컬럼을 Auto Size를 적용한다.
     */
    autoSize: function (grid) {
        var columns = grid.headerCt.getGridColumns();
        var i;
        for (i = 0; i < columns.length; i++) {
            columns[i].autoSize(i);
        }
    },

    /**
     * ExtJS Grid의 컬럼을 Auto Size를 적용한다.
     */
    fit: function (grid) {
        var columns = grid.headerCt.getGridColumns();
        var i;
        for (i = 0; i < columns.length; i++) {
            columns[i].maxWidth = 10000;
            columns[i].autoSize(i);
        }
    },

    /**
     * 컴포넌트를 Selector를 이용하여 lookup한다. 한개의 컴포넌트인 경우에만 사용할 수 있다.
     */
    query: function (name) {
        return Ext.ComponentQuery.query(name)[0];
    },

    getActiveTabIndex: function (tabPanel) {
        var activeTab = tabPanel.getActiveTab();
        return tabPanel.items.findIndex('id', activeTab.id);
    },

    fireButton: function (selector) {
        var button = App.UI.query(selector);
        button.fireHandler();
    },

    fireEvent: function (selector, event) {
        var comp = App.UI.query(selector);
        comp.fireEvent(event, comp);
    },

    isEmpty: function (selector) {
        var comp = App.UI.query(selector);
        return isBlank(comp.getValue());
    },

    getSelected: function (grid) {
        return grid.getView().getSelectionModel().getSelection()[0];
    },

    /**
     * UI 컴포넌트를 비활성화 시킨다.
     */
    disable: function (component) {
        if (this.is('String', component)) {
            var comp = this.lookup(component);
            comp.setDisabled(true);
        } else {
            component.setDisabled(true);
        }
    },

    /**
     * UI 컴포넌트를 활성화 시킨다.
     */
    enable: function (component) {
        if (this.is('String', component)) {
            var comp = this.lookup(component);
            comp.setDisabled(false);
        } else {
            component.setDisabled(false);
        }
    },

    /**
     * 자료형을 검사한다.
     */
    is: function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    },

    /**
     * 로그 메시지를 남긴다.
     */
    log: function (prefix, output) {
        if (typeof console === "object" && console.log) {
            if (typeof output !== "undefined") {
                console.log('[' + prefix + '] ' + output);
            } else {
                console.log(prefix);
            }
        }
    },

    /**
     * 도움말 창을 생성한다.
     */
    newHelp: function (title, height, width, url) {
        return Ext.create('Ext.Window', {
            title: title ? title : 'Help',
            width: height ? height : 850,
            height: width ? width : 600,
            closable: true,
            modal: false,
            closeAction: 'close',
            resizable: true,
            padding: '5 5 5 5',
            layout: 'fit',
            url: url,
            listeners: {
                beforerender: function () {
                    this.add(new Ext.Panel({
                        html: '<iframe style="overflow:auto;width:100%;height:100%;" frameborder="0"  src="' + this.url + '"></iframe>',
                        border: false,
                        autoScroll: true
                    }));
                }
            }

        });
    },

    /**
     * 팝업창을 생성한다.
     */
    msg: function (title, format) {
        var msgCt = Ext.core.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var t = '<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>'
        var m = Ext.core.DomHelper.append(msgCt, t, true);
        m.hide();
        m.slideIn('t').ghost("t", {delay: 6000, remove: true});
    },

    /**
     * 팝업창을 생성한다.
     */
    msgPopup: function (title, format) {
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        Ext.Msg.alert({
            title: title,
            message: s,
            iconCls: 'fa fa-check-circle fa-lg'
        });

        App.UI.notification(format);
    },


    /**
     * 팝업창을 생성한다.
     */
    infomsg: function (title, format) {
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        Ext.Msg.alert({
            title: title,
            message: s,
            iconCls: 'fa fa-check-circle fa-lg'
        });
    },

    /**
     * 팝업창을 생성한다.
     */
    errormsg: function (title, format) {
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));

        Ext.Msg.alert({
            title: title,
            message: s,
            iconCls: 'fa fa-exclamation-circle fa-lg'
        });
    },

    notification: function (msg) {
        var c = Ext.getCmp('grdNotification');

        if (c == undefined) {
            return;
        }

        c.getStore().insert(0, {time: Ext.util.Format.date(new Date(), 'G:H:i'), msg: msg});
    },


    getTabItem: function (d, c) {
        var b = d.tabBar.items.indexOf(c);
        return d.getComponent(b)
    },
    
    getTabIndex: function (c, b) {
        return c.tabBar.items.indexOf(b)
    },
    
    updateNode: function (b) {
        var c = b.getSelectionModel().getLastSelected();
        var d = b.getStore().getNodeById(c.data.id);
        b.getStore().load({node: d})
    },

    updateParentNode: function (b) {
        var d = b.getSelectionModel().getLastSelected();
        var c = d.parentNode;
        var e = b.getStore().getNodeById(c.data.id);
        b.getStore().load({node: e})
    },
    
    updateSelectedNode: function (b, c) {
        var d = b.getStore().getNodeById(c.data.id);
        b.getStore().load({node: d})
    }
});

var log = Flamingo.view.util.UI.log;
var query = Flamingo.view.util.UI.query;
var autoSize = Flamingo.view.util.UI.autoSize;
var msg = Flamingo.view.util.UI.msgPopup;
var info = Flamingo.view.util.UI.infomsg;
var error = Flamingo.view.util.UI.errormsg;
var updateNode = Flamingo.view.util.UI.updateNode;
var updateParentNode = Flamingo.view.util.UI.updateParentNode;
var getTabItem = Flamingo.view.util.UI.getTabItem;
var getTabIndex = Flamingo.view.util.UI.getTabIndex;
var updateSelectedNode = Flamingo.view.util.UI.updateSelectedNode;
var progressStore;