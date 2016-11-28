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
Ext.define('Flamingo.view.editor.AbstractEditor', {
    extend: 'Flamingo.view.editor.EditorPanel',
    alias: 'widget.abstractEditor',

    requires: ['Flamingo.view.editor.EditorMixin'],

    initComponent: function () {
        var me = this
        var wordCount = Ext.create('Ext.toolbar.TextItem', {text: message.msg('common.position') + ': 0'}),
            lineCount = Ext.create('Ext.toolbar.TextItem', {text: message.msg('common.lines') + ': 0'});

        //TODO status bar 확인필요.
        /*Ext.apply(me, {
            bbar: Ext.create('FEM.component._StatusBar', {
                itemId: 'statusBar',
                items: [lineCount, wordCount]
            })
        });*/

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

                wordCount.update(message.msg('common.position') + ': ' + c.column);
                lineCount.update(message.msg('common.lines') + ': ' + l);

            }, me);

            me.editor.commands.addCommand({
                name: "execute",
                bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
                exec: function (editor) {
                    var executeBtn = query('#executeButton');
                    executeBtn.fireHandler();
                }
            });
        });

        me.callParent(arguments);
    }
});