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
Ext.define('Flamingo.view.s3browser.simple.SimpleObject', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.simpleObjectPanel',

    requires: [
        'Ext.toolbar.Breadcrumb'
    ],

    border: true,

    bind: {
        store: '{folderStore}'
    },
    selModel: {
        selType: 'checkboxmodel',
        showHeaderCheckbox: false
    },
    viewConfig: {
        stripeRows: true,
        getRowClass: function () {
            return 'cell-height-30';
        }
    },
    columns: [
        {
            xtype: 'templatecolumn',
            align: 'center',
            width: 30,
            tpl: '<tpl if="bucket"><i class="fa fa-folder-o fa-lg" aria-hidden="true"></i></tpl>' +
                '<tpl if="folder"><i class="fa fa-folder-o fa-lg" aria-hidden="true"></i></tpl>',
            sortable: false
        },
        {
            text: 'Name',
            align: 'left',
            flex: 1,
            dataIndex: 'name',
            tdCls: 'monospace-column'
        }
    ],
    bbar: [
        {
            xtype: 'button',
            text: 'Prev',
            reference: 'pagePrevButton',
            disabled: true,
            iconCls: 'x-item-disabled x-tbar-page-prev',
            handler: 'onPagePrevClick'
        }, {
            xtype: 'displayfield',
            reference: 'dfPage',
            value: 'Page 1'
        }, {
            xtype: 'button',
            text: 'Next',
            iconAlign: 'right',
            reference: 'pageNextButton',
            disabled: false,
            iconCls: 'x-item-disabled x-tbar-page-next',
            handler: 'onPageNextClick'
        }
    ],

    listeners: {
        itemdblclick: 'onListItemdblclick',
        afterrender: 'onAfterRender'
    }
});