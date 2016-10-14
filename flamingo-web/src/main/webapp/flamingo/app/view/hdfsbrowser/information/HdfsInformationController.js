/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ext.define('Flamingo.view.hdfsbrowser.information.HdfsInformationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.hdfsInformationViewController',

    /**
     * HDFS 브라우저의 정보를 가져온다.
     */
    onAfterRender: function () {
        var me = this;

        me.getHdfsInformation();
        me.getHdfsUsage();
        me.getHdfsTop5();
    },

    /**
     * HDFS Usage (DFS, Non-DFS) 정보를 가져온다.
     */
    getHdfsUsage: function () {
        var me = this,
            refs = me.getReferences();
        var url = CONSTANTS.HADOOP.NAMENODE.INFO;
        var param = {
        };

        invokeGet(url, param,
            function (response) {
                var res = Ext.decode(response.responseText);

                if (res.success) {
                    var hdfsUsagePolar = refs.hdfsUsagePolar;

                    hdfsUsagePolar.getStore().proxy.data = [
                        {
                            name: 'Used Capacity of Non-DFS',
                            value: res.map.capacityUsedNonDFS
                        },
                        {
                            name: 'Used Capacity',
                            value: res.map.used
                        },
                        {
                            name: 'Remaining Capacity',
                            value: res.map.free
                        }
                    ];

                    hdfsUsagePolar.getStore().load();
                } else {
                    error('Error', res.error.cause);
                }
            },
            function () {
                error('Warning', 'Please contact system admin');
            }
        );
    },

    /**
     * HDFS 상위 5 디렉토리 정보를 업데이트한다.
     */
    getHdfsTop5: function () {
        var hdfsTop5Grid = query('hdfsTop5DirectoryPanel #hdfsTop5Grid');

        setTimeout(function () {
            hdfsTop5Grid.getStore().load();
        }, 10);
    },

    /**
     * HDFS 정보를 가져온다.
     */
    getHdfsInformation: function () {
        var hdfsSummaryForm = query('hdfsSummaryPanel #hdfsInformationForm');
        var url = CONSTANTS.HADOOP.NAMENODE.INFO;
        var param = {
        };

        invokeGet(url, param,
            function (response) {
                var res = Ext.decode(response.responseText);

                if (res.success) {
                    hdfsSummaryForm.getForm().reset();
                    hdfsSummaryForm.getForm().setValues(res.map);
                } else {
                    error('Error', res.error.cause);
                }
            },
            function () {
                error('Warning', 'Please contact system admin');
            }
        );
    },

    /**
     * HDFS Summary 정보를 업데이트한다.
     */
    onHdfsSummaryRefreshClick: function () {
        var me = this;

        me.getHdfsInformation();
    },

    /**
     * HDFS Usage (DFS, Non-DFS) 사용량 정보를 업데이트한다.
     */
    onHdfsUsagePolarRefreshClick: function () {
        var me = this;

        me.getHdfsUsage();
    },

    /**
     * HDFS Top 5 디렉토리 목록을 업데이트한다.
     */
    onHdfsTop5DirectoryRefreshClick: function () {
        var me = this;

        me.getHdfsTop5();
    }
});