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
Ext.define('Flamingo.view.s3browser.upload.UploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.uploadViewController',

    onAfterRender: function(window) {
        this.getViewModel().set('bucketName', window.bucketName);
        this.getViewModel().set('path', window.prefix);
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
                    status: files[i].size >= grid.maxUploadSize ? 'Capacity Exceeded' : 'Ready',
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

    onUploadClick: function() {
        var grid = this.getView();

        grid.xhrHashMap = new Ext.util.HashMap();
        this.upload(grid, grid.getStore().getRange(), 0);

        this.closeWindow();
    },

    upload: function (grid, records, idx) {
        var xhr = new XMLHttpRequest();

        if (records.length < idx + 1) {
            return;
        }

        if (records[idx].get('status') == 'Ready' || records[idx].get('status') == 'Cancel') {
            grid.xhrHashMap.add(records[idx].get('name'), xhr);
        }
        else {
            this.upload(grid, records, ++idx);
            return;
        }

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
            return;
        }, false);

        var uploadUrl = CONSTANTS.FS.S3_UPLOAD_OBJECT;
        var formData = new FormData();

        var bucketName = this.getViewModel().get('bucketName'),
            path = this.getViewModel().get('path'),
            key = path + records[idx].get('name');

        formData.append("file", records[idx].get('file'));
        formData.append("bucketName", bucketName);
        formData.append("key", key);

        xhr.open("POST", uploadUrl);
        xhr.send(formData);
    },

    closeWindow: function() {
        this.getView().close();
    }
});