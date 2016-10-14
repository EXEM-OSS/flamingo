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
Ext.define('Flamingo.view.workflowdesigner.editor.Editor', {
    extend: 'Ext.util.Observable',
    path: '',
    sourceCode: '',
    autofocus: true,
    fontSize: '12px',
    theme: 'clouds',
    printMargin: false,
    printMarginColumn: 80,
    highlightActiveLine: true,
    highlightGutterLine: true,
    highlightSelectedWord: true,
    showGutter: true,
    fullLineSelection: true,
    tabSize: 4,
    useSoftTabs: false,
    showInvisible: false,
    useWrapMode: false,
    codeFolding: true,
    value: '',
    readOnly: false,

    constructor: function (owner, config) {
        var me = this;
        me.owner = owner;

        me.addEvents({'editorcreated': true}, 'change');

        me.callParent();
    },

    initEditor: function () {
        var me = this;

        ace.require("ace/ext/language_tools");
        me.editor = ace.edit(me.editorId);
        me.editor.setOptions({
            enableBasicAutocompletion: true
        });
        me.editor.ownerCt = me;
        me.setMode(me.parser);
        me.setTheme(me.theme);
        me.editor.getSession().setUseWrapMode(me.useWrapMode);
        me.editor.setShowFoldWidgets(me.codeFolding);
        me.editor.setShowInvisibles(me.showInvisible);
        me.editor.setHighlightGutterLine(me.highlightGutterLine);
        me.editor.setHighlightSelectedWord(me.highlightSelectedWord);
        me.editor.renderer.setShowGutter(me.showGutter);
        me.setFontSize(me.fontSize);
        me.editor.setShowPrintMargin(me.printMargin);
        me.editor.setPrintMarginColumn(me.printMarginColumn);
        me.editor.setHighlightActiveLine(me.highlightActiveLine);
        me.editor.getSession().setTabSize(me.tabSize);
        me.editor.getSession().setUseSoftTabs(me.useSoftTabs);
        me.editor.setReadOnly(me.readOnly);
        me.setValue(me.sourceCode);

        me.editor.getSession().on('change', function () {
            me.fireEvent('change', me);

        }, me);

        if (me.autofocus)
            me.editor.focus();
        else {
            me.editor.renderer.hideCursor();
            me.editor.blur();
        }

        me.editor.initialized = true;
        me.fireEvent('editorcreated', me);
    },

    getEditor: function () {
        return this.editor;
    },

    getSession: function () {
        return this.editor.getSession();
    },

    getTheme: function () {
        return this.editor.getTheme();
    },

    setTheme: function (name) {
        this.editor.setTheme("ace/theme/" + name);
    },

    setMode: function (mode) {
        this.editor.getSession().setMode("ace/mode/" + mode);
    },

    getValue: function () {
        return this.editor.getSession().getValue();
    },

    setValue: function (value) {
        this.editor.getSession().setValue(value);
    },

    insertValue: function (value) {
        var position = this.editor.getCursorPosition();
        this.editor.getSession().insert(position, value);
    },

    setFontSize: function (value) {
        this.editor.setFontSize(value);
    },

    undo: function () {
        this.editor.undo();
    },

    resize: function () {
        this.editor.resize();
    },

    redo: function () {
        this.editor.redo();
    }
});
