Ext.define('Flamingo.view.hdfsbrowser.context.Directory', {
    extend: 'Ext.menu.Menu',
    xtype: 'directorymenu',

    requires: [
        'Flamingo.view.hdfsbrowser.context.ContextController'
    ],

    controller: 'hdfscontext',

    items: [
        {
            text: 'Copy',
            iconCls: 'common-directory-copy',
            itemId: 'copyDirectoryMenu',
            tooltip: 'Copy selected directory to destination.',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Move',
            iconCls: 'common-directory-move',
            itemId: 'moveDirectoryMenu',
            tooltip: 'Move selected directory to destination.',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Rename',
            iconCls: 'common-directory-remove',
            itemId: 'renameDirectoryMenu',
            tooltip: 'Rename selected directory.',
            handler: 'onMenuitemClick'
        },
        {
            text: 'Delete',
            iconCls: 'common-database-remove',
            itemId: 'deleteDirectoryMenu',
            tooltip: 'Delete selected directory.',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Merge',
            iconCls: 'common-directory-merge',
            itemId: 'mergeFileMenu',
            tooltip: 'Merge all the files in the selected path into a single file.',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Directory Property',
            iconCls: 'common-information',
            itemId: 'getInfoMenu',
            tooltip: 'Shows property of the selected directory.',
            handler: 'onMenuitemClick'
        },
        '-',
        {
            text: 'Set Permission',
            iconCls: 'common-user-auth',
            itemId: 'permissionMenu',
            tooltip: 'Set permission to access the selected directory.',
            handler: 'onMenuitemClick'
        }
    ]
});