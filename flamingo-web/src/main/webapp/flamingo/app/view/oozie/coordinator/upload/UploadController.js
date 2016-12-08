Ext.define('Flamingo.view.oozie.coordinator.upload.UploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.coordinatorUpload',

    listen: {
        controller: {
            'simpleHdfsFileBrowserController': {
                simpleHdfsClose: 'onSimpleHdfsClose'
            }
        }
    },

    onHdfsBrowserClick: function() {
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsBrowser').show();
    },

    onAddClick: function() {
        var me = this,
            store = me.getViewModel().getStore('properties');

        store.insert(store.getCount(), {});
    },

    onDelClick: function () {
        var me = this,
            refs = me.getReferences(),
            grid = refs.propertyGrid,
            store = grid.getStore(),
            selection = grid.getSelectionModel().getSelection();

        if (selection.length == 0) {
            error('Confirm', '삭제할 행을 선택하시오.');
            return;
        }

        store.remove(selection);
    },

    onBrowseClick: function() {
        this.getViewModel().set('row', -1);
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser').show();
    },

    onColumBrowseClick: function(grid, row) {
        var me = this;

        me.getViewModel().set('row', row);

        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser').show();
    },

    onSimpleHdfsClose: function(record) {
        var me = this,
            refs = me.getReferences(),
            viewModel = me.getViewModel(),
            store = viewModel.getStore('properties'),
            row = viewModel.get('row');

        if (row < 0) {
            if (record.get('filename') != 'coordinator.xml') {
                info('Confirm', 'coordinator.xml 파일만 선택할 수 있습니다.');
            }
            else {
                refs.xmlPath.setValue(record.get('fullyQualifiedPath'));
                refs.parentPath.setValue(record.get('path'));
            }
        }
        else {
            store.getAt(row).set('path', record.get('fullyQualifiedPath'));
        }

    },

    onRunClick: function() {
        var me = this,
            refs = me.getReferences(),
            store = me.getViewModel().getStore('properties');

        var params = {
            properties: store.records2Json(store.getData().items),
            apppath: refs.parentPath.getValue()
        };

        invokePostByMap(CONSTANTS.OOZIE.COORDINATOR.RUN,
            params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    info('성공', 'Coordinator를 실행하였습니다.');
                } else if (obj.error.cause) {
                    error(message.msg('common.notice'), obj.error.cause);
                } else {
                    error(message.msg('common.notice'), obj.error.message);
                }
            },
            function () {
                error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
            }
        );

    }
});