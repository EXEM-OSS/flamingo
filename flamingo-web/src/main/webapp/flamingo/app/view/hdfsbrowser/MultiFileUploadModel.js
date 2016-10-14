Ext.define('Flamingo.view.hdfsbrowser.MultiFileUploadModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.multiFileUpload',

    stores: {
        multiFileStore: {
            fields: [
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'size',
                    type: 'integer'
                },
                {
                    name: 'type',
                    type: 'string'
                },
                {
                    name: 'status',
                    type: 'string',
                    defaultValue: 'Ready'
                },
                {
                    name: 'progress',
                    type: 'integer'
                },
                {
                    name: 'message',
                    type: 'string'
                },
                {
                    name: 'file',
                    type: 'auto'
                }
            ],
            idProperty: 'name',
            proxy: {
                type: 'memory',
                reader: {
                    type: 'array',
                    idProperty: 'filename'
                }
            }
        }
    }
});