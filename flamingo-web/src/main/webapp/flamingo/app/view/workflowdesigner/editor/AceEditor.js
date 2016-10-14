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
Ext.define('Flamingo.view.workflowdesigner.editor.AceEditor', {
    extend: 'Flamingo.view.workflowdesigner.editor.Panel',
    alias: 'widget.aceEditor',

    requires: ['Flamingo.view.workflowdesigner.editor.Editor'],

    initComponent: function () {
        var me = this, toolbar = [
            {
                text: 'Undo',
                iconCls: 'common-undo',
                itemId: 'undoButton',
                handler: me.undo,
                scope: me
            },
            {
                text: 'Redo',
                iconCls: 'common-redo',
                itemId: 'redoButton',
                handler: me.redo,
                scope: me
            },
            '->',
            {
                text: 'Setting',
                iconCls: 'common-setting',
                menu: {
                    xtype: 'menu',
                    plain: true,
                    items: [
                        {
                            text: 'Display hidden characters',
                            handler: function () {
                                me.showInvisible = (me.showInvisible) ? false : true;
                                me.editor.setShowInvisibles(me.showInvisible);
                            },
                            checked: (me.showInvisible),
                            scope: me
                        },
                        {
                            text: 'Line breaks',
                            handler: function () {
                                me.useWrapMode = (me.useWrapMode) ? false : true;
                                me.editor.getSession().setUseWrapMode(me.useWrapMode);
                            },
                            checked: (me.useWrapMode),
                            scope: me
                        },
                        {
                            text: 'Folding',
                            handler: function () {
                                me.codeFolding = (me.codeFolding) ? false : true;
                                me.editor.setShowFoldWidgets(me.codeFolding);
                            },
                            checked: (me.codeFolding),
                            scope: me
                        },
                        {
                            text: 'Highlights the current line',
                            handler: function () {
                                me.highlightActiveLine = (me.highlightActiveLine) ? false : true;
                                me.editor.setHighlightActiveLine(me.highlightActiveLine);
                            },
                            checked: (me.highlightActiveLine),
                            scope: me
                        },
                        {
                            text: 'Display line numbers',
                            handler: function () {
                                me.showGutter = (me.showGutter) ? false : true;
                                me.editor.renderer.setShowGutter(me.showGutter);
                            },
                            checked: (me.showGutter),
                            scope: me
                        },
                        {
                            text: 'Highlights selected text',
                            handler: function () {
                                me.highlightSelectedWord = (me.highlightSelectedWord) ? false : true;
                                me.editor.setHighlightSelectedWord(me.highlightSelectedWord);
                            },
                            checked: (me.highlightSelectedWord),
                            scope: me
                        },
                        {
                            xtype: 'menuseparator'
                        },
                        Ext.create('Ext.container.Container', {
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'menuitem',
                                    text: 'Font Size',
                                    handler: function () {
                                    },
                                    flex: 1,
                                    checked: (me.highlightSelectedWord),
                                    scope: me
                                },
                                {
                                    fieldStyle: 'text-align: right',
                                    hideLabel: true,
                                    xtype: 'numberfield',
                                    value: me.fontSize,
                                    minValue: 6,
                                    maxValue: 72,
                                    width: 50,
                                    flex: 0,
                                    plain: true,
                                    listeners: {
                                        change: function (field, value) {
                                            me.fontSize = value;
                                            me.setFontSize(me.fontSize + "px");
                                        }
                                    }
                                }
                            ]
                        }),
                        Ext.create('Ext.container.Container', {
                            layout: {
                                type: 'hbox'
                            },
                            width: 200,
                            items: [
                                {
                                    xtype: 'menuitem',
                                    text: 'Margin display language',
                                    flex: 1,
                                    checked: (me.highlightSelectedWord),
                                    scope: me
                                },
                                {
                                    fieldStyle: 'text-align: right',
                                    hideLabel: true,
                                    xtype: 'numberfield',
                                    value: me.printMarginColumn,
                                    minValue: 1,
                                    maxValue: 200,
                                    width: 50,
                                    flex: 0,
                                    plain: true,
                                    listeners: {
                                        change: function (field, value) {
                                            me.printMarginColumn = value;
                                            me.editor.setPrintMarginColumn(me.printMarginColumn);
                                        }
                                    }
                                }
                            ]
                        }),
                        {
                            xtype: 'menuseparator'
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox'
                            },
                            width: 240,
                            items: [{
                                xtype: 'menuitem',
                                text: 'Theme'
                            },
                                {
                                    xtype: 'combo',
                                    mode: 'local',
                                    flex: 1,
                                    value: me.theme,
                                    triggerAction: 'all',
                                    editable: false,
                                    name: 'Theme',
                                    displayField: 'name',
                                    valueField: 'value',
                                    queryMode: 'local',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: [
                                            {
                                                value: 'ambiance',
                                                name: 'Ambiance'
                                            },
                                            {
                                                value: 'chrome',
                                                name: 'Chrome'
                                            },
                                            {
                                                value: 'clouds',
                                                name: 'Clouds'
                                            },
                                            {
                                                value: 'clouds_midnight',
                                                name: 'Clouds Midnight'
                                            },
                                            {
                                                value: 'cobalt',
                                                name: 'Cobalt'
                                            },
                                            {
                                                value: 'crimson_editor',
                                                name: 'Crimson Editor'
                                            },
                                            {
                                                value: 'dawn',
                                                name: 'Dawn'
                                            },
                                            {
                                                value: 'dreamweaver',
                                                name: 'Dreamweaver'
                                            },
                                            {
                                                value: 'eclipse',
                                                name: 'Eclipse'
                                            },
                                            {
                                                value: 'idle_fingers',
                                                name: 'idleFingers'
                                            },
                                            {
                                                value: 'kr_theme',
                                                name: 'krTheme'
                                            },
                                            {
                                                value: 'merbivore',
                                                name: 'Merbivore'
                                            },
                                            {
                                                value: 'merbivore_soft',
                                                name: 'Merbivore Soft'
                                            },
                                            {
                                                value: 'mono_industrial',
                                                name: 'Mono Industrial'
                                            },
                                            {
                                                value: 'monokai',
                                                name: 'Monokai'
                                            },
                                            {
                                                value: 'pastel_on_dark',
                                                name: 'Pastel on dark'
                                            },
                                            {
                                                value: 'solarized_dark',
                                                name: 'Solarized Dark'
                                            },
                                            {
                                                value: 'solarized_light',
                                                name: 'Solarized Light'
                                            },
                                            {
                                                value: 'textmate',
                                                name: 'TextMate'
                                            },
                                            {
                                                value: 'twilight',
                                                name: 'Twilight'
                                            },
                                            {
                                                value: 'tomorrow',
                                                name: 'Tomorrow'
                                            },
                                            {
                                                value: 'tomorrow_night',
                                                name: 'Tomorrow Night'
                                            },
                                            {
                                                value: 'tomorrow_night_blue',
                                                name: 'Tomorrow Night Blue'
                                            },
                                            {
                                                value: 'tomorrow_night_bright',
                                                name: 'Tomorrow Night Bright'
                                            },
                                            {
                                                value: 'tomorrow_night_eighties',
                                                name: 'Tomorrow Night 80s'
                                            },
                                            {
                                                value: 'vibrant_ink',
                                                name: 'Vibrant Ink'
                                            }
                                        ]
                                    }),
                                    listeners: {
                                        change: function (field, value) {
                                            me.theme = value;
                                            me.setTheme(me.theme);
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ];

        var wordCount = Ext.create('Ext.toolbar.TextItem', {text: format('Position\: {0}' + 0)});
        var lineCount = Ext.create('Ext.toolbar.TextItem', {text: format('Lines\: {0}' + 0)});

        Ext.apply(me, {
            tbar: toolbar,
            bbar: Ext.create('Flamingo2.view.component.StatusBar', {
                items: [lineCount, wordCount]
            })
        });

        // 생성자를 통해서 값이 넘어오면 설정한다.
        var content = this.value;

        me.on('editorcreated', function () {
            // 생성자를 통해서 내용이 넘어오면 생성된 이후에 내용을 채운다
            if (content) {
                me.editor.getSession().setValue(content);
            }

            me.editor.selection.on("changeCursor", function (e) {
                var c = me.editor.selection.getCursor(),
                    l = c.row + 1;

                wordCount.update(format('Position\: {0}' + c.column));
                lineCount.update(format('Lines\: {0}' + l));
            }, me);
        });

        me.callParent(arguments);
    }
});