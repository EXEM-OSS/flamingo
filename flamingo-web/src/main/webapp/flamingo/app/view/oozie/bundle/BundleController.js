/**
 * Created by seungmin on 2016. 7. 19..
 */

Ext.define('Flamingo.view.oozie.bundle.BundleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.bundleController',
    requires:[
        'Flamingo.view.oozie.coordinator.CoordinatorController'
    ],

    /***
     * 버튼을 활성화 할지 여부를 설정한다.
     * @param active active값이 true면 비활성화 false면 활성화
     * @param action action값이 true면 Acction Configuration 버튼 비활성화 false면 활성화
     */

    onActionDetailPopAfterrender: function (view) {
        var refs = this.getReferences();
        refs.actionForm.getForm().setValues(view.inputData.getData());
    },

    onAfterrender: function (panel) {
        var refs = this.getReferences();

        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        var currentTimezone = Ext.state.Manager.get("TimezoneId","GMT");
        refs.cbxTimezone.setValue(currentTimezone);

        this.onFindClick();
    },

    onJobResumeBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.BUNDLE.JOB.RESUME);
    },

    onJobSuspendBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.BUNDLE.JOB.SUSPEND);
    },

    onJobKillBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.BUNDLE.JOB.KILL);
    },

    controlJob: function(mode){
        var me = this;
        var refs = me.getReferences();
        var store = refs.bundlegrid.getStore();

        if (refs.txtBundleJobId.getValue() == '') {
            Ext.Msg.alert('Confirm', '셀을 선택해 주세요');
            return;
        }

        Ext.Ajax.request({
            url: mode,
            params: {jobId: refs.txtBundleJobId.getValue()}
        }).then(function(response, opts) {
            var obj = Ext.decode(response.responseText);
            if(obj.success){
                store.reload();
            }
        },
        function(response, opts) {
            error('경고', '해당 Job에 대한 권한이 없습니다.');
        });
    },

    onFindClick: function () {
        var refs = this.getReferences();
        var store = this.getStore('bundleStore');
        var value = refs.bundleForm.getForm().getValues();

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.status = refs.cbxStatus.rawValue;
        store.proxy.extraParams.text = value.txtFind;
        store.proxy.extraParams.gubun = value.cbxGubun;
        store.load();

        this.init();
    },

    init: function () {
        var refs = this.getReferences();

        refs.txtBundleJobId.setValue('');
        refs.txtBundleName.setValue('');
        refs.txtCoordJobId.setValue('');
        refs.txtCoordName.setValue('');
        refs.txtCoordActionId.setValue('');
        refs.txtExternalId.setValue('');

        refs.bundlegriddetail.setCollapsed(true);
        refs.bundlecoordactionlist.setCollapsed(true);
        refs.bundleworkflowactionlist.setCollapsed(true);

        refs.bundlegriddetail.getStore('bundleActionStore').removeAll();
        refs.bundlecoordactionlist.getStore('bundleCoordActionList').removeAll();
        refs.bundleworkflowactionlist.getStore('bundleWorkflowActionList').removeAll();
    },

    onAppPathClick: function () {
        var refs = this.getReferences();
        var hdfsPath = refs.txfAppPath.getValue();

        // FIXME config에 HDFS 경로를 추가해서 해당값으로 Replace 하도록 한다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser', {
            path: hdfsPath.replace('hdfs://hdp01.exem.oss:8020', '')
        }).show();
    },

    onRowDblClick: function ( grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var store = this.getStore('bundleActionStore');

        refs.txtCoordJobId.setValue('');
        refs.txtCoordName.setValue('');
        refs.txtCoordActionId.setValue('');
        refs.txtExternalId.setValue('');

        refs.bundlecoordactionlist.getStore('bundleCoordActionList').removeAll();
        refs.bundleworkflowactionlist.getStore('bundleWorkflowActionList').removeAll();

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = record.get('jobId');
        store.load();

        refs.bundlegriddetail.setCollapsed(false);
        refs.bundlecoordactionlist.setCollapsed(true);
        refs.bundleworkflowactionlist.setCollapsed(true);
    },

    onCoordRowDblClick: function ( grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var store = this.getStore('bundleCoordActionList');

        refs.txtCoordActionId.setValue('');
        refs.txtExternalId.setValue('');

        refs.bundleworkflowactionlist.getStore('bundleWorkflowActionList').removeAll();

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = record.get('jobId');
        store.load();

        refs.bundlecoordactionlist.setCollapsed(false);
        refs.bundleworkflowactionlist.setCollapsed(true);
    },

    onCoordActionListRowDblClick: function ( grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var store = this.getStore('bundleWorkflowActionList');
        if (record.get('externalId') == null) {
            store.removeAll();
            return;
        }
        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = record.get('externalId');
        store.load();

        refs.bundleworkflowactionlist.setCollapsed(false);
    },

    onWorkflowActionListRowDblClick: function (grid , record , tr , rowIndex , e , eOpts) {
        Ext.create('Flamingo.view.oozie.dashboard.WorkflowActionDetailPop', {
            title: 'Action (Name: ' + record.get('app_name') + ' / ID: ' + record.get('jobId') + ')',
            inputData: record
        }).show();
    },

    onRowClick: function (grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        refs.txtBundleJobId.setValue(record.get('jobId'));
        refs.txtBundleName.setValue(record.get('app_name'));
    },

    onCoordRowClick: function (grid, record, tr, rowIndex, e, eOpts) {
        var refs = this.getReferences();
        refs.txtCoordJobId.setValue(record.get('jobId'));
        refs.txtCoordName.setValue(record.get('app_name'));
    },

    onCoordActionListRowClick: function (grid, record, tr, rowIndex, e, eOpts) {
        var refs = this.getReferences();

        refs.txtCoordActionId.setValue(record.get('jobId'));
        refs.txtExternalId.setValue(record.get('externalId'));
    },

    onBtnBundleDetail: function () {
        var refs = this.getReferences();

        if (refs.txtBundleJobId.getValue() == '') {
            Ext.Msg.alert('Confirm', '셀을 선택해 주세요');
            return;
        }

        Ext.create('Flamingo.view.oozie.bundle.BundleDetailPop', {
            jobId: refs.txtBundleJobId.getValue(),
            jobName: refs.txtBundleName.getValue(),
            width: window.innerWidth - 200,
            height: window.innerHeight - 100,
            maxHeight: 800,
            maxWidth: 1400
        }).show();
    },

    onBtnCoordDetail: function () {
        var refs = this.getReferences();

        if (refs.txtCoordJobId.getValue() == '') {
            Ext.Msg.alert('Confirm', '셀을 선택해 주세요');
            return;
        }

        Ext.create('Flamingo.view.oozie.coordinator.CoordinatorDetailPop', {
            jobId: refs.txtCoordJobId.getValue(),
            jobName: refs.txtCoordName.getValue(),
            width: window.innerWidth - 200,
            height: window.innerHeight - 100,
            maxHeight: 800,
            maxWidth: 1400
        }).show();
    },

    onBtnWfDetail: function () {
        var refs = this.getReferences();

        if (refs.txtCoordActionId.getValue() == '') {
            Ext.Msg.alert('Confirm', '셀을 선택해 주세요');
            return;
        }

        if (refs.txtExternalId.getValue() != '') {
            invokeGet(CONSTANTS.OOZIE.WORKFLOW.ACTION.SELECT,
                {
                    jobId: refs.txtExternalId.getValue(),
                    timezoneId: getTimeZone()
                },
                function(response){
                    Ext.create('Flamingo.view.oozie.workflow.WorkflowDetailPop', {
                        jobId: refs.txtExternalId.getValue(),
                        jobName: Ext.decode(response.responseText).list[0].wf_app_name,
                        width: window.innerWidth - 200,
                        height: window.innerHeight - 100,
                        maxHeight: 800,
                        maxWidth: 1400
                    }).show();
                },
                function(response, opts){
                    error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
                }
            );
        } else {
            Ext.create('Flamingo.view.oozie.workflow.WorkflowDetailPop', {
                jobId: refs.txtExternalId.getValue(),
                coordActionId: refs.txtCoordActionId.getValue(),
                width: window.innerWidth - 200,
                height: window.innerHeight - 100,
                maxHeight: 800,
                maxWidth: 1400
            }).show();
        }
    },

    onCbxStatusChange: function ( combo , newValue , oldValue , eOpts) {
        var refs = this.getReferences();
        var store = combo.getStore();

        if (oldValue == null) {
            oldValue = [];
        }

        if (oldValue.indexOf('ALL') == -1 && newValue.indexOf('ALL') != -1) {
            combo.setValue(store.getRange());
        } else if (oldValue.indexOf('ALL') != -1 && newValue.indexOf('ALL') == -1) {
            combo.setValue('');
            newValue = [];
        } else if (oldValue.indexOf('ALL') != -1 && newValue.indexOf('ALL') != -1 && newValue.length < combo.store.getRange().length) {
            var comboValues = combo.getValue();
            comboValues.splice(combo.getValue().indexOf('ALL'), 1);
            combo.setValue(comboValues);
        }

        if (newValue.length == combo.store.getRange().length - 1 && newValue.indexOf('ALL') == -1) {
            var comboValues = combo.getValue();
            comboValues.push('ALL');
            combo.setValue(comboValues);
        }
    },

    statusRenderer: function (value) {
        return statusConverter(value);
    },

    onCbxAfterrender: function (combo) {
        combo.select('ALL');
    },

    onKeyDown: function (key, e, eOpts) {
        if (e.keyCode == 13) {
            this.onFindClick();
        }
    },

    onTimezoneSelect: function (combo , value) {
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires: new Date(new Date().getTime()+315569259747) // about 10 years from now!
        }));
        Ext.state.Manager.set("TimezoneId", value.get('timezoneId'));

        this.onFindClick();
    }
});