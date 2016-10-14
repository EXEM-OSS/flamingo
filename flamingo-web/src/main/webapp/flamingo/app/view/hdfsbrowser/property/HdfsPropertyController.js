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
Ext.define('Flamingo.view.hdfsbrowser.property.HdfsPropertyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.hdfsPropertyViewController',

    /**
     * 속성창을 화면에 표시한 후 서버로부터 디렉토리 또는 파일 정보를 가져온다.
     *
     * @param window Window 속성창
     */
    onAfterRender: function (window) {
        var me = this;
        var refs = me.getReferences();

        refs.hdfsProperty.getForm().setValues(window.propertyData);
    }
});