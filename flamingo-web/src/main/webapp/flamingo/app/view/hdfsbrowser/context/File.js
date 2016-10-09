Ext.define('Flamingo.view.hdfsbrowser.context.File', {
    extend: 'Ext.menu.Menu',
    xtype: 'filemenu',

    requires: [
        'Flamingo.view.hdfsbrowser.context.ContextController'
    ],

    controller: 'hdfscontext',

    items: [{
        text: 'Copy',
        iconCls: 'common-directory-copy',
        itemId: 'copyFileMenu',
        tooltip: 'Copy selected directory to destination.',
        handler: 'onMenuitemClick'
    },
    {
        text: 'Move',
        iconCls: 'common-directory-move',
        itemId: 'moveFileMenu',
        tooltip: 'Move selected directory to destination.',
        handler: 'onMenuitemClick'
    },
    {
        text: 'Rename',
        iconCls: 'common-directory-remove',
        itemId: 'renameFileMenu',
        tooltip: 'Rename selected directory.',
        handler: 'onMenuitemClick'
    },
    {
        text: 'Delete',
        iconCls: 'common-database-remove',
        itemId: 'deleteFileMenu',
        tooltip: 'Delete selected directory.',
        handler: 'onMenuitemClick'
    },
    '-',
    {
        text: 'Download',
        iconCls: 'common-download',
        reference: 'downloadButton',
        itemId: 'downloadFileMenu',
        tooltip: 'Download a file',
        handler: 'onMenuitemClick'
    },
    '-',
    {
        text: 'Preview',
        iconCls: 'common-file-view',
        itemId: 'viewFileContents',
        tooltip: 'Preview the file.',
        handler: 'onMenuitemClick'
    },
    '-',
    {
        text: 'File Property',
        iconCls: 'common-information',
        itemId: 'fileInfo',
        tooltip: 'View property of the selected file.',
        handler: 'onMenuitemClick'

    }]
});