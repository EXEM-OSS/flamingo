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
/*Ext.define('Flamingo.view.main.MainController', {
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

});*/

Ext.define('Flamingo.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
            }
        }
    },
    routes: {
        ':node': 'onRouteChange'
    },
    lastView: null,
    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this;
        var refs = me.getReferences();

        var centerPanel = refs.centerPanel,
            //mainLayout = centerPanel.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) || store.findNode('viewType', hashTag),
            view = (node && node.get('viewType')) || hashTag,
            //lastView = me.lastView,
            existingItem = centerPanel.child('component[routeId=' + hashTag + ']'),
            newView;

        // Kill any previously routed window
        //centerPanel.removeAll();
        /*if (lastView && lastView.isWindow) {
         centerPanel.removeAll();
         //lastView.destroy();
         }*/

        var lastView = centerPanel.items[0];

        if (!existingItem) {
            try {
                newView = Ext.create({
                    xtype: view,
                    routeId: hashTag,  // for existingItem search later
                    hideMode: 'offsets'
                });
            } catch (err) {
                /*newView = Ext.create({
                 xtype: 'page404',
                 routeId: hashTag,  // for existingItem search later
                 hideMode: 'offsets'
                 });*/
                Ext.Msg.alert('Error', '404 Not Found!', function () {
                    me.setCurrentView(me.lastView.routeId);
                });
                return;
            }

        }

        if (node.getDepth() == 1) {
            Ext.each(store.root.childNodes, function (child) {
                if (child != node) {
                    child.collapse();
                }
            });
        }

        if (node.parentNode) {
            node.parentNode.expand();
        }

        navigationList.setSelection(node);

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    centerPanel.add(existingItem);
                    //mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                centerPanel.removeAll();
                centerPanel.add(newView);
                Ext.resumeLayouts(true);
            }
        }

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
    },
    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));
        if (to) {
            this.redirectTo(to);
        }
    },
    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationContainer = refs.navigationContainer,
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;
        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();
            //refs.senchaLogo.setWidth(new_width);
            navigationContainer.setWidth(new_width);
            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);
            Ext.resumeLayouts(); // do not flush the layout here...
            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                navigationContainer.setScrollable('y');
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }
            // Start this layout first since it does not require a layout
            //refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});
            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationContainer.width = new_width;
            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');
            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationContainer.setScrollable(false);
                navigationContainer.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                    },
                    single: true
                });
            }
        }
    },
    onMainViewRender: function () {
        if (!window.location.hash) {
            this.redirectTo("designer");
        }
    },
    onRouteChange: function (id) {
        this.setCurrentView(id);
    },
    onSearchRouteChange: function () {
        this.setCurrentView('searchresults');
    },
    onSwitchToModern: function () {
        Ext.Msg.confirm('Switch to Modern', 'Are you sure you want to switch toolkits?',
            this.onSwitchToModernConfirmed, this);
    },
    onSwitchToModernConfirmed: function (choice) {
        if (choice === 'yes') {
            var s = location.search;
            // Strip "?classic" or "&classic" with optionally more "&foo" tokens
            // following and ensure we don't start with "?".
            s = s.replace(/(^\?|&)classic($|&)/, '').replace(/^\?/, '');
            // Add "?modern&" before the remaining tokens and strip & if there are
            // none.
            location.search = ('?modern&' + s).replace(/&$/, '');
        }
    },
    onEmailRouteChange: function () {
        this.setCurrentView('email');
    },
    onLogoutClick: function () {
        $('#logout_form').submit();
    }
});

