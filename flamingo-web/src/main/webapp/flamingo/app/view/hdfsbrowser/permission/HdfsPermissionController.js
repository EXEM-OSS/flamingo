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

Ext.define('Flamingo.view.hdfsbrowser.permission.HdfsPermissionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.hdfsPermissionViewController',

    /**
     * 권한 설정 창을 화면에 표시한 후 서버로부터 디렉토리 또는 파일 정보를 가져온다.
     */
    onAfterRender: function (window) {
        var me = this;
        var refs = me.getReferences();

        refs.hdfsPermission.getForm().setValues(window.permissionData);
    },

    /**
     * 권한 설정 창을 종료한다.
     */
    onCancelPermission: function () {
        this.getView().close();
    },

    /**
     * 변경한 권한 정보를 적용한다.
     */
    onChangePermission: function () {
        var me = this;
        var fileStatus = me.getView().fileStatus; // isFile
        var refs = me.getReferences();
        var permissionFormValues = refs.hdfsPermission.getValues();
        var selectedNode = me.getView().record;
        var currentPath = selectedNode.get('fullyQualifiedPath');
        var parentPath = me.getView().node;
        var files = [];
        var file;
        var fileNames = [];

        // 파일만 권한을 변경할 경우
        if (fileStatus) {
            var gridItem = query('hdfsFilePanel');
            var checkedFiles = gridItem.getSelectionModel().getSelection();

            if (checkedFiles.length == 1) {
                file = checkedFiles[0].get('id');
                fileNames = checkedFiles[0].get('filename');
            } else {
                for (var i = 0; i <= checkedFiles.length - 1; i++) {
                    files[i] = checkedFiles[i].get('id');
                    fileNames[i] = checkedFiles[i].get('filename');
                }
            }
        }

        var url = CONSTANTS.FS.HDFS_SET_PERMISSION;
        var owner = permissionFormValues.owner;
        var group = permissionFormValues.group;
        var recursiveOwner = permissionFormValues.recursiveOwner;
        var ownerRead = permissionFormValues.ownerRead == true ? 4 : 0;
        var ownerWrite = permissionFormValues.ownerWrite == true ? 2 : 0;
        var ownerExecute = permissionFormValues.ownerExecute == true ? 1 : 0;
        var groupRead = permissionFormValues.groupRead == true ? 4 : 0;
        var groupWrite = permissionFormValues.groupWrite == true ? 2 : 0;
        var groupExecute = permissionFormValues.groupExecute == true ? 1 : 0;
        var otherRead = permissionFormValues.otherRead == true ? 4 : 0;
        var otherWrite = permissionFormValues.otherWrite == true ? 2 : 0;
        var otherExecute = permissionFormValues.otherExecute == true ? 1 : 0;
        var ownerPermission = ownerRead + ownerWrite + ownerExecute;
        var groupPermission = groupRead + groupWrite + groupExecute;
        var otherPermission = otherRead + otherWrite + otherExecute;
        var recursivePermission = permissionFormValues.recursivePermission;
        var params = {
            currentPath: currentPath,
            owner: owner,
            group: group,
            recursiveOwner: fileStatus ? 0 : recursiveOwner,
            permission: ownerPermission + '' + groupPermission + '' + otherPermission,
            recursivePermission: fileStatus ? 0 : recursivePermission,
            fileStatus: fileStatus ? 'FILE' : 'DIRECTORY',
            files: checkedFiles && checkedFiles.length == 1 ? file : files.join(),
            fileNames: checkedFiles && checkedFiles.length == 1 ? fileNames : fileNames.join()
        };

        var progress = Ext.MessageBox.show({
            title: 'Notification',
            message: 'Changing ownership',
            width: 300,
            wait: true,
            waitConfig: {interval: 200},
            progress: true,
            closable: true
        });

        invokePostByMap(url, params,
            function (response) {
                var obj = Ext.decode(response.responseText);

                progress.close();
                if (obj.success) {
                    info('Notification', 'Permission has been changed.');
                    me.fireEvent('permissionChanged');
                    me.getView().close();
                } else if (obj.error.cause) {
                    error('Error', obj.error.cause);
                } else {
                    error('Error', obj.error.message);
                }
            },
            function () {
                progress.close();
                error('Warning', 'Please contact system admin');
            }
        );
    }
});