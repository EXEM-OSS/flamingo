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
Ext.define('Flamingo.view.hdfsbrowser.viewer.FileViewerWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.fileViewerWindow',
    requires: [
        'Flamingo.view.hdfsbrowser.viewer.FileViewerController',
        'Flamingo.view.hdfsbrowser.viewer.FileViewerForm'
    ],

    controller: 'fileViewerViewController',

    title: 'Preview',
    height: 550,
    width: 850,
    modal: true,
    maximizable: false,
    resizable: false,
    closeAction: 'destroy',
    layout: 'fit',
    afterPageText: '/ {0}',
    emptyPageData: {
        total: '{0}',
        currentPage: '{0}',
        pageCount: 0,
        toRecord: 0,
        fromRecord: 0
    },

    items: [
        {
            xtype: 'fileViewerForm'
        }
    ],

    listeners: {
        afterrender: 'onAfterRender'
    }
});