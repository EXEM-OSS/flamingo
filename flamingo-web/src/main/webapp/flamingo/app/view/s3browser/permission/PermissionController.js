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
Ext.define('Flamingo.view.s3browser.permission.PermissionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.permissionViewController',

    /**
     * Permission창을 화면에 표시한 후 서버로부터 permission정보를 가져와 표시한다.
     *
     * @param window Window Permission창
     */
    onObjectAfterRender: function (view) {
        var viewModel = this.getViewModel(),
            permissionStore = viewModel.getStore('objectPermissionStore'),
            item = view.record.data;

        permissionStore.load({
            params: {
                bucketName: item.bucketName,
                key: item.key
            }
        });
    },

    onBucketAfterRender: function (view) {
        var viewModel = this.getViewModel(),
            permissionStore = viewModel.getStore('bucketPermissionStore'),
            item = view.record.data;

        permissionStore.load({
            params: {
                bucketName: item.bucketName
            }
        });
    }
});