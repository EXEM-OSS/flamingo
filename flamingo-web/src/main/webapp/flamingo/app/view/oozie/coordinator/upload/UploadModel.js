Ext.define('Flamingo.view.oozie.coordinator.upload.UploadModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.coordinatorUpload',

    stores: {
        properties: {
            fields: ['path']
        }
    }
});