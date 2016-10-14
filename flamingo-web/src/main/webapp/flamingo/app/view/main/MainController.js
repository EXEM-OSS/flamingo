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
Ext.define('Flamingo.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    routes: {
        ':node': 'onRouteChange'
    },

    onSelect: function(view, record) {
        this.redirectTo(record.get('view'));
    },

    onRouteChange: function(token) {
        this.changeView(token);
    },

    changeView: function(hashtag) {
        var me = this,
            refs = me.getReferences(),
            view;

        refs.mainContainer.removeAll();

        try {
            view = Ext.create({
                xtype: hashtag,
                routeId: hashtag
            });
        } catch(err) {
            me.redirectTo('designer');
            return;
        }

        refs.mainContainer.add(view);
    }

});
