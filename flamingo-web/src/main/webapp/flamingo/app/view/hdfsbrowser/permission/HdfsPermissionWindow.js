/*
 * Copyright (C) 2011  Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('Flamingo.view.hdfsbrowser.permission.HdfsPermissionWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo.view.hdfsbrowser.permission.HdfsPermissionController',
        'Flamingo.view.hdfsbrowser.permission.HdfsPermissionForm'
    ],

    controller: 'hdfsPermissionViewController',

    title: message.msg('fs.hdfs.permission.window.title'),
    height: 370,
    width: 320,
    modal: true,
    layout: 'fit',
    closeAction: 'destroy',
    resizable: false,

    items: [
        {
            xtype: 'HdfsPermissionFormPanel'
        }
    ],
    buttonAlign: 'right',
    buttons: [
        {
            xtype: 'button',
            text: message.msg('common.change'),
            iconCls: 'common-ok',
            handler: 'onChangePermission'
        },
        {
            xtype: 'button',
            text: message.msg('common.cancel'),
            iconCls: 'common-cancel',
            handler: 'onCancelPermission'
        }
    ],
    listeners: {
        afterrender: 'onAfterRender'
    }
});