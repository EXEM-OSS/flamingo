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
Ext.define('Flamingo.view.workflowdesigner.editor.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.AceEditor',
    mixins: {
        editor: 'Flamingo.view.workflowdesigner.editor.Editor'
    },
    layout: 'fit',
    autofocus: true,
    border: false,

    listeners: {
        resize: function () {
            if (this.editor) {
                this.editor.resize();
            }
        },
        activate: function () {
            if (this.editor && this.autofocus) {
                this.editor.focus();
            }
        },
        editorcreated: function (comp) {
            // AceEditor가 생성되었을 때 스크립트의 내용을 설정한다.
            comp.setValue(this.script);
        }
    },

    initComponent: function () {
        var me = this,
            items = {
                xtype: 'component'
            };

        Ext.apply(me, {
            items: items
        });

        me.callParent(arguments);
    },

    onRender: function () {
        var me = this;

        if (me.sourceEl != null) {
            //me.sourceCode = Ext.get(me.sourceEl).getHTML();
            //me.sourceCode = Ext.get(me.sourceEl).dom.innerHTML;
            me.sourceCode = Ext.get(me.sourceEl).dom.outerText;
            //me.sourceCode = Ext.get(me.sourceEl).dom.value;
        }

        me.editorId = me.items.keys[0];
        me.oldSourceCode = me.sourceCode;

        me.callParent(arguments);

        // init editor on afterlayout
        me.on('afterlayout', function () {
            if (me.url) {
                Ext.Ajax.request({
                    url: me.url,
                    success: function (response) {
                        me.sourceCode = response.responseText;
                        me.initEditor();
                    }
                });
            }
            else {
                me.initEditor();
            }

        }, me, {
            single: true
        });
    },

    setScript: function (script) {
        this.script = script;
    }
});