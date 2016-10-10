/**
 * @class App.Util.WebBrowser
 * @singleton
 * @author Cloudine Inc
 * @since 0.1
 */
Ext.define('App.Util.WebBrowser', {
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
