Ext.define('Flamingo.view.oozie.workflow.WorkflowDetailPopController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wfDetailPopController',

    listen: {
        controller: {
            'simpleHdfsDirectoryBrowserController': {
                simpleHdfsClose: 'onWorkflowSimpleHdfsClose'
            }
        }
    },

    onTabChangePop: function (tabPanel, newCard, oldCard, eOpts) {
        var refs = this.getReferences();
        var url;
        var jobName = tabPanel.up('window').jobName;
        var jobId = tabPanel.up('window').jobId;

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

    onAfterrender: function(view){
        var refs = this.getReferences();

        if (view.jobId == '') {
            refs.wfDefinition.tab.hide();
            refs.wfConfiguration.tab.hide();
            refs.ganttDetail.setActiveTab(refs.wfLog);

            refs.txtLogJobId.setHidden(true);
            refs.txtLogJobName.setHidden(true);

            invokeGet(CONSTANTS.OOZIE.COORDINATOR.JOB.LOG.COORDACTIONSELECT,
                {coordActionId: view.coordActionId},
                function(response){
                    refs.logEditor.setValue(Ext.decode(response.responseText).map.jobActionLog);
                }
            );
        } else {
            var url = CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SELECT;

            refs.txtDefinitionJobName.setValue(view.jobName);
            refs.txtDefinitionJobId.setValue(view.jobId);


            this.onDetailClick(url, view.jobId, 'wfDefinition');
        }
    },

    onEditorUpdate: function () {
        var refs = this.getReferences();

        if (refs.updateBtn.text == 'Edit') {
            refs.updateBtn.setText('Save As');
            refs.updateBtn.setIconCls('fi icon-fm-save');
            refs.definitionEditor.editor.setReadOnly(false);
            refs.cancelBtn.setHidden(false);
        } else {
            Ext.MessageBox.show({
                title: 'Alert',
                message: '저장 하시겠습니까?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function (btn) {
                    if (btn == 'yes') {
                        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsDirectoryBrowser').show();
                    }
                }
            });
        }
    },

    onEditorCancel: function () {
        var refs = this.getReferences();
        refs.updateBtn.setText('Edit');
        refs.updateBtn.setIconCls('fi icon-fm-document-edit');
        refs.definitionEditor.editor.setReadOnly(true);
        refs.cancelBtn.setHidden(true);

        this.onAfterrender(this.getView());
    },

    onWorkflowSimpleHdfsClose: function (record) {
        var refs = this.getReferences();

        var params = {
            definition: refs.definitionEditor.getValue(),
            path: record.get('fullyQualifiedPath'),
            checked: false,
            fileName: refs.txtDefinitionJobId.getValue()
        };

        invokeGet(CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SAVE,
            params,
            function(response){
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    refs.updateBtn.setText('Edit');
                    refs.updateBtn.setIconCls('fi icon-fm-document-edit');
                    refs.definitionEditor.editor.setReadOnly(true);
                    Ext.Msg.alert('Confirm', '저장 되었습니다.');
                } else {
                    Ext.MessageBox.show({
                        title: 'Warning',
                        message: '디렉토리에 동일한 파일명이 존재합니다.<br>덮어쓰시겠습니까?',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        fn: function (btn) {
                            if (btn == 'yes') {
                                params.checked = true;
                                invokeGet(CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SAVE,
                                    params,
                                    function(response){
                                        refs.updateBtn.setText('Edit');
                                        refs.updateBtn.setIconCls('fi icon-fm-document-edit');
                                        refs.definitionEditor.editor.setReadOnly(true);
                                        Ext.Msg.alert('Confirm', '저장 되었습니다.');
                                    }
                                );
                            }
                        }
                    });
                }

            },
            function(response, opts){
                error(message.msg('common.warning'), format(message.msg('common.failure'), config['system.admin.email']));
            }
        );
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
    }

});
