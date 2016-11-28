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
Ext.define('Flamingo.view.util.WebBrowser', {
    singleton: true,
    
    /**
     * 모바일 장치인지 확인한다.
     */
    isMobile: function () {
        return /iPad|iPhone|Android|Mobile|Opera Mini|Opera Mobi|POLARIS|Symbian|BlackBerry|LG|MOT|SAMSUNG|Nokia|SonyEricsson|webOS|PalmOS|Fennec|Windows CE|MIDP|SHW-M380/.test(navigator.userAgent);
    },

    /**
     * iPad인지 확인한다.
     */
    isIPad: function () {
        return /iPad/.test(navigator.userAgent);
    },

    /**
     * 크롬 브라우저인지 확인한다.
     */
    isChrome: function () {
        return /Chrome/.test(navigator.userAgent);
    },

    /**
     * WebSocket의 지원 여부를 확인한다.
     */
    isSupportWebSocket: function () {
        var supported = ("WebSocket" in window);
        return supported;
    }    
});
