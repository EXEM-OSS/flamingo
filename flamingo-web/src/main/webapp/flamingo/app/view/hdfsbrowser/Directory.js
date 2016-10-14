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
Ext.define('Flamingo.view.hdfsbrowser.Directory', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.hdfsDirectoryPanel',

    bind: {
        store: '{directoryStore}'
    },
    dockedItems: [
        {
            xtype: 'toolbar',
            items: [
                '->',
                {
                    text: 'Refresh',
                    iconCls: 'common-refresh',
                    reference: 'directoryRefreshBtn',
                    tooltip: 'Refresh directory list.',
                    handler: 'onDirectoryRefreshClick'
                }
            ]
        }
    ],
    listeners: {
        afterrender: 'onDirectoryAfterRender',
        itemclick: 'onClickDirectoryItem',
        itemcontextmenu: 'onDirectoryItemContextMenu',
        simpleHdfsBeforeOk: 'onDirectorySimpleHdfsBeforeOk',
        containercontextmenu: function (tree, event) {
            event.stopEvent();
        }
    }
});