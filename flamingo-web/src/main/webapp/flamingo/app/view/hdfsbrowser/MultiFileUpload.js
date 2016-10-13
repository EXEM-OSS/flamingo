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
Ext.define('Flamingo.view.hdfsbrowser.MultiFileUpload', {
    extend: 'Ext.grid.Panel',
    xtype: 'multiFileUploadPanel',

    requires: [
        'Ext.form.field.File',
        'FEM.store.filesystem.hdfs.MultiFileStore'
    ],

    /**
     * 업로드 경로
     */
    uploadPath: '',

    /**
     * Upload 최대 파일 사이즈(byte)
     */
    maxUploadSize: config['file.upload.max.size'],

    /**
     * 업로드 URL
     */
    uploadUrl: CONSTANTS.FS.HDFS_UPLOAD_FILE,

    width: 800,
    height: 250,
    store: {
        type: 'multiFileStore'
    },
    tbar: [
        {
            itemId: 'MF_FILEFIELD',
            xtype: 'filefield',
            buttonOnly: true,
            buttonConfig: {
                iconCls: 'common-search',
                text: 'Find'
            },
            width: 60,
            listeners: {
                afterrender: function (field, eOpts) {
                    field.fileInputEl.dom.setAttribute('multiple', 'multiple');
                },
                change: function (field, value, eOpts) {
                    var grid = field.up('multiFileUploadPanel'),
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
                }
            }
        },
        '-',
        {
            text: 'Delete All',
            iconCls: 'common-delete',
            handler: function (btn) {
                var grid = btn.up('multiFileUploadPanel'),
                    store = grid.getStore();
                store.removeAll();
                grid.down('#MF_FILEFIELD').reset();
            }
        },
        '->',
        {
            text: 'Upload',
            iconCls: 'common-upload',
            handler: function (btn) {
                var grid = btn.up('multiFileUploadPanel'),
                    store = grid.getStore(),
                    record,
                    xhr;

                grid.xhrHashMap = new Ext.util.HashMap();

                grid.upload(grid, grid.getStore().getRange(), 0);
            }
        },
        {
            text: 'Cancel',
            iconCls: 'common-cancel',
            handler: function (btn) {
                var grid = btn.up('multiFileUploadPanel'),
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
            }
        }
    ],
    columns: [
        {
            dataIndex: 'name',
            header: 'File Name',
            flex: 1,
            align: 'center'
        },
        {
            dataIndex: 'size',
            header: 'File Size',
            width: 70,
            fixed: true,
            align: 'center',
            renderer: function (value) {
                return Ext.util.Format.fileSize(value);
            }
        },
        {
            dataIndex: 'type',
            header: 'Type',
            width: 150,
            fixed: true,
            align: 'center'
        },
        {
            dataIndex: 'status',
            header: 'Status',
            width: 70,
            fixed: true,
            align: 'center'
        },
        {
            dataIndex: 'progress',
            header: 'Progress',
            width: 90,
            fixed: true,
            align: 'center',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                if (!value) {
                    value = 0;
                }
                return Ext.String.format('<div class="x-progress x-progress-default x-border-box">' +
                    '<div class="x-progress-text x-progress-text-back" style="width: 76px;">{0}%</div>' +
                    '<div class="x-progress-bar x-progress-bar-default" role="presentation" style="width:{0}%">' +
                    '<div class="x-progress-text" style="width: 76px;"><div>{0}%</div></div></div></div>', value);
            }
        },
        {
            dataIndex: 'message',
            width: 1,
            hidden: true
        }
    ],
    listeners: {
        afterrender: function (grid, eOpts) {
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
                grid.down('#MF_FILEFIELD').fileInputEl.dom.files = event.target.files || event.dataTransfer.files;
            }, false);

            if (grid.dropEvent.type == 'drop') {
                grid.down('#MF_FILEFIELD').fileInputEl.dom.files = grid.dropEvent.target.files || grid.dropEvent.dataTransfer.files;
            }
        }
    },
    bbar: {
        xtype: '_statusBar',
        text: Ext.String.format('Maximum allowed size of file to upload \: {0}',
            Ext.util.Format.fileSize(parseInt(config['file.upload.max.size'])))
    },
    xhrHashMap: new Ext.util.HashMap(),

    /**
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

        //formData.append("username", SESSION.USERNAME);
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