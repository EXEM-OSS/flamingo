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
Ext.define('Flamingo.view.s3browser.simple.SimpleS3BrowserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.simpleS3BrowserController',

    /**
     * 목록을 불러와 화면에 표시한다.
     */
    onAfterRender: function() {
        var params = {
            bucketName: '',
            prefix: '',
            continuationToken: ''
        };

        this.listLoad(params);
    },

    /**
     * 저장하고있던 페이지 스토어를 비우고 페이지 숫자와 버튼 상태를 초기화한다.
     */
    clearPageStore: function() {
        var pageStore = this.getData('pageStore'),
            refs = this.getReferences();

        pageStore.removeAll();

        this.setData('resultPage', 1);
        this.setData('pageStore', pageStore);

        refs.dfPage.setValue('Page ' + 1);
        refs.pagePrevButton.setDisabled(true);
    },

    onListItemdblclick: function(grid, record, item) {
        var bucketName = record.get('bucketName'),
            key = record.get('key'),
            pageStore = this.getData('pageStore');

        pageStore.removeAll();

        this.setData('resultPage', 1);

        if (record.get('isBucket')) {
            this.setData('isBucketPage', false);
            this.setData('bucketName', bucketName);
            this.setData('path', '');

            var params = {
                bucketName: bucketName,
                prefix: '',
                continuationToken: ''
            };

            this.listLoad(params);
        } else if (record.get('folder')) {
            this.setData('isBucketPage', false);
            this.setData('bucketName', bucketName);
            this.setData('path', key);

            var params = {
                bucketName: bucketName,
                prefix: key,
                continuationToken: ''
            };

            this.listLoad(params);
        }
    },

    listLoad: function(params) {
        var me = this,
            folderStore = this.getData('folderStore');

        folderStore.getProxy().extraParams.bucketName = params.bucketName;
        folderStore.getProxy().extraParams.prefix = params.prefix;
        folderStore.getProxy().extraParams.continuationToken = params.continuationToken;

        folderStore.load({
            callback: function () {
                var refs = me.getReferences(),
                    pageStore = me.getData('pageStore'),
                    isTruncated = folderStore.getProxy().getReader().rawData.map.isTruncated;

                refs.dfPage.setValue('Page ' + me.getData('resultPage'));

                if (isTruncated == "true") {
                    refs.pageNextButton.setDisabled(false);
                } else {
                    refs.pageNextButton.setDisabled(true);
                }
            }
        });
    },


    /**
     * Folder 스토어가 로드된 이후 breadcrumb 을 위한 데이터를 생성한다.
     * */
    onFolderStoreLoaded: function(store, records, successful, operation) {
        var me = this,
            viewModel = this.getViewModel(),
            item = operation.request.config.params,
            data = [],
            isLast = false,
            fullyQualifiedPath = '',
            breadcrumbStore = this.getData('breadcrumb'),
            pageStore = this.getData('pageStore'),
            resultPage = this.getData('resultPage'),
            folderStore = viewModel.getStore('folderStore'),
            idx, value, prefixArr, str,
            page = this.getData('resultPage'),
            index = (page - 1) * 1000,
            isTruncated = folderStore.getProxy().getReader().rawData.map.isTruncated;

        if (page == 1) {
            me.clearPageStore();
        }

        if (isTruncated == "true") {
            for (var i = 0; i < records.length; i++, index++) {
                pageStore.insert(index, records[i]);
            }
        }

        this.setData('pageStore', pageStore);


        str = 'All Buckets' + '/';
        if (item.bucketName) {
            str += item.bucketName + '/';
        }

        if (item.prefix) {
            str += item.prefix;
        }

        prefixArr = str.split('/');
        for (idx in prefixArr) {
            value = prefixArr[idx];

            if (idx == prefixArr.length - 1) {
                isLast = true;
            }
            if (value !== '' && idx >= 0) {
                fullyQualifiedPath += '/' + value;
                data.push({name: value, isLast: isLast, fullyQualifiedPath: fullyQualifiedPath});
            }
        }

        breadcrumbStore.loadData(data);
    },

    breadcrumbItemclick: function(view, record, item, index) {
        var me = this,
            path = record.get('fullyQualifiedPath');

        var str = '/All Buckets/';
        var strArr = path.split('/');
        var bucketName = '';
        var key = '';
        var params = [];

        if (strArr.length == 2) {
            params.all = true;

        } else if (strArr.length == 3) {
            bucketName = strArr[2];
            params.all = false;
            params.bucket = true;
            params.bucketName = bucketName;

        } else if (strArr.length > 3) {
            bucketName = strArr[2];
            key = path.substring(str.length+bucketName.length+1, path.length);
            params.all = false;
            params.bucket = false;
            params.bucketName = bucketName;
            params.prefix = key + "/";
        }

        me.clearPageStore();
        me.listLoad(params);
    },

    onPagePrevClick: function() {
        var me = this,
            refs = me.getReferences(),
            store = this.getData('objectStore'),
            pageSize = store.pageSize,
            pageStore = this.getData('pageStore'),
            resultPage = this.getData('resultPage');

        var page = resultPage - 1;
        this.setData('resultPage', page);

        if (page == 1) {
            refs.pagePrevButton.setDisabled(true);
        }

        var start = (pageSize * page) - pageSize,
            end = (pageSize * page) - 1,
            datas = pageStore.getRange(start, end);

        store.removeAll();
        store.loadData(datas);

        this.setData('page', page);
        refs.dfPage.setValue('Page ' + page);
    },

    /**
     * 목록 하단에 표시되는 페이지 정보의 다음 버튼이 눌리면 다음 페이지 목록을 로드한다.
     */
    /**
     * 목록 하단에 표시되는 페이지 정보의 다음 버튼이 눌리면 다음 페이지 목록을 로드한다.
     */
    onPageNextClick: function () {
        var me = this,
            refs = me.getReferences(),
            store = this.getData('objectStore'),
            pageSize = store.pageSize,
            pageStore = this.getData('pageStore'),
            resultPage = this.getData('resultPage');

        var page = resultPage + 1;
        this.setData('resultPage', page);

        var end = pageSize * page - 1;
        var start = pageSize * page - pageSize;
        var datas = pageStore.getRange(start, end);

        if (this.getData('resultPage') == 2) {
            refs.pagePrevButton.setDisabled(false);
        }

        if (datas.length > 0) {
            store.removeAll();
            store.setData(datas);
            this.setData('resultPage', page);
            refs.dfPage.setValue('Page ' + page);
        }
        else {
            var params = {
                bucketName: this.getData('bucketName'),
                prefix: this.getData('path'),
                continuationToken: store.getProxy().getReader().rawData.map.continuationToken
            };

            store.removeAll();

            this.setData('resultPage', page);
            refs.dfPage.setValue('Page ' + page);

            me.listLoad(params);
        }
    },

    /**
     * 버킷 또는 폴더 목록에서 선택한 노드 정보를 부모 뷰컨트롤러로 전달한다.
     */
    onOkClick: function () {
        var bucketName = this.getData('bucketName'),
            prefix = this.getData('path');

        if (Ext.isEmpty(bucketName)) {
            Ext.MessageBox.show({
                title: '확인',
                text: 'OK',
                message: 'Please select a file.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return;
        }

        var params = {
            bucketName: bucketName,
            prefix: prefix
        };

        this.fireEvent('simpleOkClick', params);
        this.getView().close();
    },

    onCancelClick: function () {
        this.getView().close();
    },

    /**
     * 뷰모델 데이터를 반환한다.
     *
     * @param key
     * @returns {*}
     */
    getData: function(key) {
        return this.getViewModel().get(key);
    },

    /**
     * 뷰모델 데이터를 설정한다.
     * @param key
     * @param value
     */
    setData: function(key, value) {
        this.getViewModel().set(key, value);
    },
});