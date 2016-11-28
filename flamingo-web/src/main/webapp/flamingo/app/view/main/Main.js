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
Ext.define('Flamingo.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    requires: [
        'Flamingo.view.main.MainController',
        'Flamingo.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: 'main',

    layout: 'border',

    items: [{
        xtype: 'component',
        region: 'north',
        height: 80,
        cls: 'header',
        html: '<div class="logo"><h1>FLAMINGO</h1></div>'
    },{
        xtype: 'dataview',
        region: 'west',
        bind: {
            store: '{menu}'
        },
        width: 260,
        cls: 'nav',
        itemSelector: 'li',
        tpl: [
            '<ul>',
            '<tpl for=".">',
                '<li class="depth_1">{text}<span class="icon"><i class="{icon}" aria-hidden="true"></i></span>',
            '</tpl>',
            '</ul>'
        ],
        listeners: {
            select: 'onSelect'
        }
    },{
        xtype: 'container',
        reference: 'mainContainer',
        region: 'center',
        flex: 1,
        layout: 'fit'
    }]

});
