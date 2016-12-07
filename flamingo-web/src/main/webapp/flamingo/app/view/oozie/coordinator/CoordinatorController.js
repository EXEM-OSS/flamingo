Ext.define('Flamingo.view.oozie.coordinator.CoordinatorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.coordinatorController',

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
        this.controlJob(CONSTANTS.OOZIE.COORDINATOR.JOB.RESUME);
    },

    onJobSuspendBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.COORDINATOR.JOB.SUSPEND);
    },

    onJobKillBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.COORDINATOR.JOB.KILL);
    },

    controlJob: function(mode){
        var me = this;
        var refs = me.getReferences();
        var store = refs.coordinatorgrid.getStore();

        if (refs.txtCoordJobId.getValue() == '') {
            Ext.Msg.alert('Confirm', '셀을 선택해 주세요');
            return;
        }

        Ext.Ajax.request({
            url: mode,
            params: {jobId: refs.txtCoordJobId.getValue()}
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
        var store = this.getStore('coordinatorStore');
        var value = refs.coordForm.getForm().getValues();

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.status = refs.cbxStatus.rawValue;
        store.proxy.extraParams.text = value.txtFind;
        store.proxy.extraParams.gubun = value.cbxGubun;
        store.load();

        this.init();
    },

    init: function () {
        var refs = this.getReferences();

        refs.txtCoordJobId.setValue('');
        refs.txtCoordName.setValue('');
        refs.txtCoordActionId.setValue('');
        refs.txtExternalId.setValue('');

        refs.coordinatorgriddetail.getStore('coordinatorActionStore').removeAll();
        refs.coordinatorworkflowactionlist.getStore('coordWorkflowActionList').removeAll();

        refs.coordinatorgriddetail.setCollapsed(true);
        refs.coordinatorworkflowactionlist.setCollapsed(true);
    },

    onAppPathClick: function () {
        var refs = this.getReferences();
        var hdfsPath = refs.txfCoordAppPath.getValue();

        //TODO config에 HDFS 경로를 추가해서 해당값으로 Replace 하도록 한다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser', {
            path: hdfsPath.replace('hdfs://hdp01.exem.oss:8020', '')
        }).show();
    },

    onRowDblClick: function ( grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var store = this.getStore('coordinatorActionStore');
        var workflowActionStore = refs.coordinatorworkflowactionlist.getStore('coordWorkflowActionList');

        refs.txtCoordActionId.setValue('');
        refs.txtExternalId.setValue('');
        workflowActionStore.removeAll();

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = record.get('jobId');
        store.load();

        refs.coordinatorgriddetail.setCollapsed(false);
        refs.coordinatorworkflowactionlist.setCollapsed(true);
    },

    onCoordActionListRowDblClick: function ( grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var store = this.getStore('coordWorkflowActionList');
        if (record.get('externalId') == null) {
            store.removeAll();
            return;
        }
        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = record.get('externalId');
        store.load();

        refs.coordinatorworkflowactionlist.setCollapsed(false);
    },

    onWorkflowActionListRowDblClick: function (grid , record , tr , rowIndex , e , eOpts) {
        Ext.create('Flamingo.view.oozie.dashboard.WorkflowActionDetailPop', {
            title: 'Action (Name: ' + record.get('app_name') + ' / ID: ' + record.get('jobId') + ')',
            inputData: record
        }).show();
    },

    onUploadClick: function() {
        Ext.create('Flamingo.view.oozie.coordinator.upload.Upload').show();
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

    onCoordinatorRowClick: function (grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        refs.txtCoordJobId.setValue(record.get('jobId'));
        refs.txtCoordName.setValue(record.get('app_name'));
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

    onCoordActionListRowClick: function (grid, record, tr, rowIndex, e, eOpts) {
        var refs = this.getReferences();

        refs.txtCoordActionId.setValue(record.get('jobId'));
        refs.txtExternalId.setValue(record.get('externalId'));
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