Ext.define('Flamingo.view.hdfsbrowser.MultiFileUploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.multiFileUpload',

    onAfterrender: function(grid) {
        var me = this,
            refs = me.getReferences();

        refs.mfFilefield.fileInputEl.dom.setAttribute('multiple', 'multiple');

        // Enable Drag & Drop
        var gridBody = grid.body.dom;
        gridBody.addEventListener("dragover", function (event) {
            event.stopPropagation();
            event.preventDefault();
            gridBody.style.background = '#ffc';
        }, false);
        gridBody.addEventListener("dragleave", function (event) {
            event.stopPropagation();
            event.preventDefault();
            gridBody.style.background = 'white';
        }, false);
        gridBody.addEventListener("drop", function (event) {
            event.stopPropagation();
            event.preventDefault();
            gridBody.style.background = 'white';
            refs.mfFilefield.fileInputEl.dom.files = event.target.files || event.dataTransfer.files;
        }, false);

        if (grid.dropEvent.type == 'drop') {
            refs.mfFilefield.fileInputEl.dom.files = grid.dropEvent.target.files || grid.dropEvent.dataTransfer.files;
        }
    },

    onFilefieldChange: function(field) {
        var me = this,
            grid = me.getView(),
            store = grid.getStore(),
            files = field.fileInputEl.dom.files,
            record;

        for (var i = 0; i < files.length; i++) {
            record = store.getById(files[i].name);
            if (Ext.isEmpty(record)) {
                store.add({
                    name: files[i].name, size: files[i].size, type: files[i].type,
                    status: files[i].size >= grid.maxUploadSize
                        ? 'Capacity Exceeded'
                        : 'Ready',
                    file: files[i]
                });
            } else {
                record.set('size', files[i].size);
                record.set('type', files[i].type);
                record.set('status', files[i].size >= grid.maxUploadSize ? 'Capacity Exceeded' : 'Ready');
                record.set('file', files[i]);
                record.commit();
            }
        }
    },

    onDeleteAllClick: function() {
        var me = this,
            refs = me.getReferences(),
            grid = me.getView(),
            store = grid.getStore();

        store.removeAll();

        refs.mfFilefield.reset();
    },

    onUploadClick: function() {
        var grid = this.getView();

        grid.xhrHashMap = new Ext.util.HashMap();

        grid.upload(grid, grid.getStore().getRange(), 0);
    },

    onCancelClick: function() {
        var grid = this.getView(),
            store = grid.getStore(),
            record;
        if (grid.xhrHashMap) {
            grid.xhrHashMap.each(function (key, value, length) {
                record = store.getById(key);
                if (record && record.get('status') == 'Uploading..') {
                    value.abort();
                }
            });
        }
    },

    /**
     * @private
     * 파일을 업로드한다.
     *
     * @param {Flamingo.model.fs.MultiFile} record
     * @param {XMLHttpRequest} xhr
     */
    upload: function (grid, records, idx) {
        var xhr = new XMLHttpRequest();

        if (records.length < idx + 1) {
            return;
        }

        if (records[idx].get('status') == 'Ready' || records[idx].get('status') == 'Cancel') {
            grid.xhrHashMap.add(records[idx].get('name'), xhr);
        }
        else {
            grid.upload(grid, records, ++idx);
            return;
        }

        var formData = new FormData();

        formData.append("fileName", records[idx].get('file'));
        formData.append("dstPath", this.uploadPath);

        // FIXME > progress 정보 수정 필요
        xhr.upload.addEventListener("progress", function (evt) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            records[idx].set('progress', percentComplete);
            records[idx].set('status', 'Uploading..');
            records[idx].commit();
        }, false);

        xhr.addEventListener("load", function (evt) {
            var response = Ext.decode(evt.target.responseText);

            if (response.success) {
                records[idx].set('status', 'Completed');
                records[idx].commit();
            } else if (response.error.cause) {
                error('Notification', response.error.cause);

                records[idx].set('progress', 0);
                records[idx].set('status', 'Error');
                records[idx].commit();
            } else if (response.error.message) {
                error('Notification', response.error.message);

                records[idx].set('progress', 0);
                records[idx].set('status', 'Error');
                records[idx].commit();
            } else {
                records[idx].set('progress', 0);
                records[idx].set('status', 'Error');
                records[idx].commit();
                error('Error', 'Please contact system admin');
            }
        }, false);

        xhr.addEventListener("error", function (evt) {
            records[idx].set('status', 'Error');
            records[idx].commit();
        }, false);

        xhr.addEventListener("abort", function (evt) {
            records[idx].set('status', 'Cancel');
            records[idx].commit();
        }, false);

        xhr.addEventListener("loadend", function (evt) {
            var response = Ext.decode(evt.target.responseText);

            if (evt.target.status != 200) {
                if (response.error.code == 100) {
                    records[idx].set('progress', 0);
                    records[idx].set('status', 'Duplicated File');
                    records[idx].commit();
                    return;
                }

                records[idx].set('status', 'Error');
                records[idx].commit();
            }

            if (records.length == idx + 1) {
                return;
            }
            grid.upload(grid, records, ++idx);
        }, false);

        xhr.open("POST", this.uploadUrl);
        xhr.send(formData);
    }

});