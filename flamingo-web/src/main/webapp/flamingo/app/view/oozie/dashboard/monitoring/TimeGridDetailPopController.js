Ext.define('Flamingo.view.oozie.dashboard.monitoring.TimeGridDetailPopController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.timeGridDetailPopController',

    onAfterrender: function (view) {
        var refs = this.getReferences();
        var store = this.getStore('workflowActionStore');
        var url = CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SELECT;

        refs.wfForm.getForm().setValues(view.inputData.getData());
        refs.detail.width = (window.innerWidth - 200) / 2;

        store.proxy.extraParams.timezoneId = getTimeZone();
        store.proxy.extraParams.jobId = view.inputData.get('id');
        store.load({
            callback: function (response) {
                if (response.length > 0) {
                    refs.actionForm.getForm().setValues(response[0].getData());

                    Ext.defer(function() {
                        refs.childgrid.getStore('childStore').load({
                            params: {
                                jobId: response[0].get('wf_job_id'),
                                timezoneId: getTimeZone(),
                                actionId: response[0].get('id')
                            }
                        });
                    }, 300);
                    refs.workflowgriddetail.getSelectionModel().select(0);
                }
            }
        });

        refs.txtDefinitionJobName.setValue(view.inputData.get('app_name'));
        refs.txtDefinitionJobId.setValue(view.inputData.get('id'));

        refs.updateBtn.setHidden(true);

        this.onDetailClick(url, view.inputData.get('id'), 'wfDefinition');
    },

    statusRenderer: function (value) {
        return statusConverter(value);
    },

    onDetailClick: function (url, jobId, reference) {
        var refs = this.getReferences();
        invokeGet(url,
            {jobId: jobId},
            function(response){
                switch (reference) {
                    case 'wfDefinition':
                        refs.definitionEditor.setValue(Ext.decode(response.responseText).map.jobDefinition);
                        break;
                    case 'wfConfiguration':
                        refs.confEditor.setValue(Ext.decode(response.responseText).map.jobConfiguration);
                        break;
                    case 'wfLog':
                        refs.logEditor.setValue(Ext.decode(response.responseText).map.jobLog);
                        break;
                    default:
                        break;
                }
            },
            function(response, opts){
                error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
            }
        );
    },

    onWfTabChangePop: function (tabPanel, newCard, oldCard, eOpts) {
        var refs = this.getReferences();
        var url;
        var jobName = tabPanel.up('window').inputData.get('app_name');
        var jobId = tabPanel.up('window').inputData.get('id');

        if (jobId == '') return;

        switch (newCard.reference) {
            case 'wfDefinition':
                url = CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SELECT;
                refs.txtDefinitionJobName.setValue(jobName);
                refs.txtDefinitionJobId.setValue(jobId);
                break;
            case 'wfConfiguration':
                url = CONSTANTS.OOZIE.WORKFLOW.JOB.CONFIGURATION.SELECT;
                refs.txtConfJobName.setValue(jobName);
                refs.txtConfJobId.setValue(jobId);
                break;
            case 'wfLog':
                url = CONSTANTS.OOZIE.WORKFLOW.JOB.LOG.SELECT;
                refs.txtLogJobName.setValue(jobName);
                refs.txtLogJobId.setValue(jobId);
                break;
            default:
                break;
        }

        this.onDetailClick(url, jobId, newCard.reference);
    },

    onActionDetailTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        var refs = this.getReferences();
        switch (newCard.reference) {
            case 'actionForm':
                break;
            case 'configuration':
                refs.configuration.setValue(refs.workflowgriddetail.getSelectionModel().getSelection()[0].get('configuration'));
                break;
            default:
                break;
        }
    },

    onActionRowDblClick: function (grid , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        refs.actionForm.getForm().setValues(record.getData());
        refs.configuration.setValue(record.get('configuration'));

        Ext.defer(function() {
            refs.childgrid.getStore('childStore').load({
                params: {
                    jobId: record.get('wf_job_id'),
                    timezoneId: getTimeZone(),
                    actionId: record.get('id')
                }
            });
        }, 300);
    },

    onConsoleURL: function () {
        var refs = this.getReferences();
        window.open(refs.actionForm.getForm().getValues().console_url);
    }
});