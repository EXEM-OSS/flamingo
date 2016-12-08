Ext.define('Flamingo.view.oozie.workflow.WorkflowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.workflowController',

    /***
     * 버튼을 활성화 할지 여부를 설정한다.
     * @param active active값이 true면 비활성화 false면 활성화
     * @param action action값이 true면 Acction Configuration 버튼 비활성화 false면 활성화
     */

    onAfterrender: function (panel) {
        var refs = this.getReferences();

        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        var currentTimezone = Ext.state.Manager.get("TimezoneId","GMT");
        refs.cbxTimezone.setValue(currentTimezone);

        this.onFindClick();
    },
    onJobResumeBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.WORKFLOW.JOB.RESUME);
    },

    onJobSuspendBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.WORKFLOW.JOB.SUSPEND);
    },

    onJobKillBtnClick: function (){
        this.controlJob(CONSTANTS.OOZIE.WORKFLOW.JOB.KILL);
    },
    
    controlJob: function(mode){
        var me = this;
        var refs = me.getReferences();
        var store = refs.workflowgrid.getStore();

        if (refs.txtJobId.getValue() == '') {
            Ext.Msg.alert('Confirm', '셀을 선택해 주세요');
            return;
        }

        Ext.Ajax.request({
            url: mode,
            params: {jobId: refs.txtJobId.getValue()}
        }).then(function(response, opts) {
            var obj = Ext.decode(response.responseText);
            if (obj.success){
                store.reload();
            }
        },
        function(response, opts) {
            error('경고', '해당 Job에 대한 권한이 없습니다.');
        });
    },

    onAppPathClick: function (grid, rowIndex, colIndex) {
        var hdfsPath = grid.getStore().getAt(rowIndex).get('app_path');

        //TODO config에 HDFS 경로를 추가해서 해당값으로 Replace 하도록 한다.
        Ext.create('Flamingo.view.filesystem.hdfs.simple.SimpleHdfsFileBrowser', {
            path: hdfsPath.replace('hdfs://hdp01.exem.oss:8020', ''),
            call: 'oozie'
        }).show();
    },

    onFindClick: function () {
        var me = this;
        var refs = this.getReferences();
        var store = this.getStore('workflowStore');
        var value = refs.wfForm.getForm().getValues();
        var startDate = new Date(value.startDate);
        var endDate = new Date(value.endDate);

        if(refs.cbxStatus.getValue()<1){
            Ext.Msg.alert('Confirm', 'Status를 선택해주세요');
            return;
        }

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.startDate = startDate.getTime() + (startDate.getTimezoneOffset()*60*1000);
        store.proxy.extraParams.endDate = endDate.getTime() + (endDate.getTimezoneOffset()*60*1000);
        store.proxy.extraParams.status = refs.cbxStatus.rawValue;
        store.proxy.extraParams.text = value.txtFind;
        store.proxy.extraParams.gubun = value.cbxGubun;
        store.load();

        this.init();
    },

    init: function () {
        var refs = this.getReferences();

        refs.workflowgriddetail.getStore('workflowActionStore').removeAll();

        refs.txtJobId.setValue('');
        refs.txtName.setValue('');

        refs.workflowgriddetail.setCollapsed(true);
    },

    onWorkflowRowdblClick: function ( grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var store = this.getStore('workflowActionStore');
        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = record.get('jobId');
        store.load();

        refs.workflowgriddetail.setCollapsed(false);
    },

    onWorkflowRowClick: function (grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        refs.txtJobId.setValue(record.get('jobId'));
        refs.txtName.setValue(record.get('app_name'));
    },

    onActionRowDblClick: function (grid , record , tr , rowIndex , e , eOpts) {
        Ext.create('Flamingo.view.oozie.dashboard.WorkflowActionDetailPop', {
            title: 'Action (Name: ' + record.get('app_name') + ' / ID: ' + record.get('jobId') + ')',
            inputData: record
        }).show();
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

    onBtnDetail: function () {
        var refs = this.getReferences();

        if (refs.txtJobId.getValue() == '') {
            info('Warning',  'Please select a workflow job');
            return;
        }

        Ext.create('Flamingo.view.oozie.workflow.WorkflowDetailPop', {
            jobId: refs.txtJobId.getValue(),
            jobName: refs.txtName.getValue(),
            width: window.innerWidth - 200,
            height: window.innerHeight - 100,
            maxHeight: 800,
            maxWidth: 1400
        }).show();
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
