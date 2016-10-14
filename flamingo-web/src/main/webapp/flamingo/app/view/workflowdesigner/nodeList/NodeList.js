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
Ext.define('Flamingo.view.workflowdesigner.nodeList.NodeList', {
    extend: 'Ext.view.View',
    alias: 'widget.nodeList',

    requires: [
        'Flamingo.view.workflowdesigner.nodeList.NodeListController',
        'Flamingo.view.workflowdesigner.nodeList.NodeListModel',
        'Flamingo.model.workflowdesigner.NodeMeta'
    ],

    controller: 'nodeListController',

    viewModel: {
        type: 'nodeListModel'
    },

    bind: {
        store: '{nodemeta}'
    },

    cls: 'node-list',

    tpl: [
        '<div style="width: {[values.length * 80]}px;">',
        '<tpl for=".">',
        '<div class="{[values.disabled ? "thumb-wrap-disable" : "thumb-wrap"]}" id="{identifier}">',
        '<div class="thumb"><img src="{icon}" title="{description}"></div>',
        '<span style="font-size: 12px;word-wrap: break-word;">{name}</span>',
        '</div>',
        '</tpl>',
        '</div>'
    ],
    singleSelect: true,
    trackOver: true,
    autoScroll: true,
    overItemCls: 'x-item-over',
    itemSelector: 'div.thumb-wrap',
    selectedItemClass: 'x-item-selected',

    listeners: {
        beforerender: 'onNodeListBeforerender',
        render: 'onNodeListRender'
    }
});