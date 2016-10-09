/*
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
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
Ext.define('Flamingo.view.hdfsbrowser.HiveDatabasePanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.hiveDatabasePanel',

    bodyPadding: 10,

    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 130
    },

    defaultType: 'textfield',

    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        var me = this;
        this.items = [
            {
                xtype: 'textfield',
                itemId: 'databaseName',
                name: 'databaseName',
                fieldLabel: message.msg('hive.database_name'),
                allowBlank: false,
                vtype: 'alphanum',
                value: ''
            },
            {
                xtype: 'textfield',
                itemId: 'comment',
                name: 'comment',
                fieldLabel: message.msg('hive.column.desc')
            },
            {
                xtype: 'textfield',
                itemId: 'location',
                name: 'location',
                disabled: true,
                disabledCls: 'disabled-plain',
                fieldLabel: message.msg('hive.database_location')
            }
        ];

        me.callParent(arguments);
    }
});