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