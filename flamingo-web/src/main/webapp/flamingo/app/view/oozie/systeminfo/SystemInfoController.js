Ext.define('Flamingo.view.oozie.systeminfo.SystemInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.systeminfoController',

    onBtnRefresh: function (btn) {
        switch (btn.up('panel').down().activeTab.text) {
            case 'Configuration':
                this.getView().getViewModel().getStore('confStore').reload();
                break;
            case 'Java System Properties':
                this.getView().getViewModel().getStore('propsStore').reload();
                break;
            case 'OS Environment':
                this.getView().getViewModel().getStore('envStore').reload();
                break;
        }
    },

    onBtnDownload: function (btn) {
        var url;
        switch (btn.up('panel').down().activeTab.text) {
            case 'Configuration':
                url = CONSTANTS.OOZIE.SYSTEMINFO.CONFIGURATION_DOWNLOAD;
                break;
            case 'Java System Properties':
                url = CONSTANTS.OOZIE.SYSTEMINFO.PROPERTIES_DOWNLOAD;
                break;
            case 'OS Environment':
                url = CONSTANTS.OOZIE.SYSTEMINFO.SHELLSCRIPT_DOWNLOAD;
                break;
        }

        Ext.core.DomHelper.append(document.body, {
            tag: 'iframe',
            id: 'testIframe' + new Date().getTime(),
            css: 'display:none;visibility:hidden;height:0px;',
            src: url,
            frameBorder: 0,
            width: 0,
            height: 0
        });
    }
});