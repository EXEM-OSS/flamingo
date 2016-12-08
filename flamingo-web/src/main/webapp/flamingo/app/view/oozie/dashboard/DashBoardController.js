Ext.define('Flamingo.view.oozie.dashboard.DashBoardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashBoardController',

    listen: {
        controller: {
            simpleHdfsFileBrowserController: {
                simpleHdfsClose: 'onSimpleHdfsClose'
            }
        }
    },

    onAfterrender: function (view) {
        var refs = this.getReferences();

        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        var currentTimezone = Ext.state.Manager.get("TimezoneId","GMT");
        refs.cbxTimezone.setValue(currentTimezone);

        this.onFind();
    },

    onAfterrenderGrid: function (view) {
        // monitoringGrid load
        var parentId = view.up('component').getItemId();
        var filter = 'status=FAILED;status=SUCCEEDED;status=KILLED';

        if (parentId == 'oozieDashBoard') {
            filter = 'status=RUNNING';
        }

        Ext.defer(function() {
            view.getViewModel().getStore('workflowStore').load({
                params: {
                    filter: filter,
                    timezoneId: getTimeZone()
                }
            });
        }, 300);
    },
    
    onChartClick: function () {
        var refs = this.getReferences();
        
        refs.monitoringGantt.setHidden(false);
        refs.monitoringGrid.setHidden(true);
        
    },
    
    onGridClick: function () {
        var refs = this.getReferences();
        
        refs.monitoringGantt.setHidden(true);
        refs.monitoringGrid.setHidden(false);
    },

    onPrevDate: function () {
        var refs = this.getReferences();
        var currentDate = refs.currentDate.getValue();
        var prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
        refs.currentDate.setValue(prevDate);
        this.onFind();
    },

    onNextDate: function () {
        var refs = this.getReferences();
        var currentDate = refs.currentDate.getValue();
        var nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        refs.currentDate.setValue(nextDate);
        this.onFind();
    },

    onJobCbxChange: function (jobCbx , newValue , oldValue , eOpts) {
        var refs = this.getReferences();
        var grid = refs.monitoringGrid;
        var store;
        var filter = null;
        Ext.suspendLayouts();
        switch (newValue) {
            case 'WORKFLOW':
                store = grid.getViewModel().getStore('workflowStore');
                grid.reconfigure(store.reload({
                    params: {
                        filter: filter,
                        timezoneId: getTimeZone()
                    }
                }), [
                    {xtype: 'rownumberer', width: 40},
                    {text: "Job Id", width: 300, dataIndex: 'id', style: 'text-align:center'},
                    {text: "Name", width: 150, dataIndex: 'app_name', style: 'text-align:center'},
                    {text: "Status", width: 150, dataIndex: 'status', align: 'center'},
                    {text: "Run", width: 50, dataIndex: 'run', align: 'center'},
                    {text: "User", width: 100, dataIndex: 'user_name', align: 'center'},
                    {text: "Duration", width: 80, dataIndex: 'duration', align: 'center'},
                    {text: "Group", width: 80, dataIndex: 'group_name', hidden: true},
                    {text: "Created", flex: 1, dataIndex: 'created_time', align: 'center'},
                    {text: "Started", flex: 1, dataIndex: 'start_time', align: 'center'},
                    {text: "Last Modified", flex: 1, dataIndex: 'last_modified_time', align: 'center'},
                    {text: "Ended", flex: 1, dataIndex: 'end_time', align: 'center'},
                    {text: "Parent Id", dataIndex: 'parent_id', hidden: true},
                    {text: "App Path", dataIndex: 'app_path', hidden: true},
                    {text: "Definition", dataIndex: 'definition', hidden: true},
                    {text: "Configuration", dataIndex: 'configuration', hidden: true},
                    {text: "Log", dataIndex: 'log', hidden: true}
                ]);
                break;
            case 'COORDINATOR':
                store = grid.getViewModel().getStore('coordStore');
                grid.reconfigure(store.reload({
                    params: {
                        filter: filter,
                        timezoneId: getTimeZone()
                    }
                }), [
                    {xtype: 'rownumberer', width: 40},
                    {text: "Job Id", width: 300, dataIndex: 'id', style: 'text-align:center'},
                    {text: "Name", width: 150, dataIndex: 'app_name', style: 'text-align:center'},
                    {text: "Status", width: 150, dataIndex: 'status', align: 'center'},
                    {text: "Frequency", width: 100, dataIndex: 'frequency', align: 'center'},
                    {text: "User", width: 100, dataIndex: 'user_name', align: 'center'},
                    {text: "Group", width: 80, dataIndex: 'group_name', hidden: true},
                    {text: "Unit", width: 140, dataIndex: 'time_unit', align: 'center'},
                    {text: "Started", flex: 1, dataIndex: 'start_time', align: 'center'},
                    {text: "NextMaterialization", flex: 1, dataIndex: 'next_matd_time', align: 'center'},
                    {text: "Ended", flex: 1, dataIndex: 'end_time', align: 'center'}
                ]);
                break;
            case 'BUNDLE':
                store = grid.getViewModel().getStore('bundleStore');
                grid.reconfigure(store.reload({
                    params: {
                        filter: filter,
                        timezoneId: getTimeZone()
                    }
                }), [
                    {xtype: 'rownumberer', width: 40},
                    {text: "Job Id", width: 300, dataIndex: 'id', style: 'text-align:center'},
                    {text: "Name", width: 150, dataIndex: 'app_name', style: 'text-align:center'},
                    {text: "Status", width: 150, dataIndex: 'status', align: 'center'},
                    {text: "User", width: 100, dataIndex: 'user_name', align: 'center'},
                    {text: "Group", width: 80, dataIndex: 'group_name', hidden: true},
                    {text: "KickoffTime", flex: 1, dataIndex: 'kickoff_time', align: 'center'},
                    {text: "CreatedTime", flex: 1, dataIndex: 'created_time', align: 'center'}
                ]);
                break;
        }

        Ext.resumeLayouts(true);
    },

    onFind: function () {
        var me = this;
        var refs = me.getReferences();
        var datetime = new Date(refs.currentDate.rawDate).getTime();

        refs.timeGridDetail.getStore('timeGridDetailStore').removeAll();
        refs.timeGridDetail.setTitle('Workflow Job History Per Hour');


        Ext.defer(function() {
            me.getView().getViewModel().getStore('timeGridStore').load({
                params: {
                    datetime: datetime,
                    timezoneId: getTimeZone()
                },
                callback: function() {
                    Ext.defer(function() {
                        $("[data-toggle=tooltip]").tooltip({container: 'body'});
                    }, 300);
                }
            });
            me.getView().getViewModel().getStore('workflowTimeline').load({
                params: {
                    datetime: datetime,
                    timezoneId: getTimeZone()
                }
            });
            me.getView().getViewModel().getStore('wfCountStore').load({
                params: {
                    datetime: datetime,
                    timezoneId: getTimeZone()
                }
            });
        }, 300);

        invokeGet(CONSTANTS.OOZIE.DASHBOARD.MONITORING.INFO,
            {},
            function (response) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                    me.getViewModel().set('oozie', obj.map);
                    me.getViewModel().notify();
                }
                else {
                    error('오류', '데이터를 읽어오는 중 오류가 발생하였습니다.');
                }
            },
            function () {
                error('오류', '데이터를 읽어오는 중 오류가 발생하였습니다.');
            }
        );

        invokeGet(CONSTANTS.OOZIE.DASHBOARD.MONITORING.WORKFLOW_STATUS_COUNT,
            {datetime: datetime},
            function (response) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    me.getViewModel().set('workflow', obj.map);
                    me.getViewModel().notify();
                }
                else {
                    error('오류', '데이터를 읽어오는 중 오류가 발생하였습니다.');
                }
            },
            function () {
                error('오류', '데이터를 읽어오는 중 오류가 발생하였습니다.');
            }
        );
    },

    onJobDetailClose: function () {
        var refs = this.getReferences();
        
        refs.jobDetail.setHidden(true);
        refs.realTimeGrid.setHidden(false);
        refs.jobCount.setHidden(false);
    },

    onJobDetailOpen: function (record) {
        var refs = this.getReferences();

        refs.jobDetail.inputData = record;
        refs.jobDetail.setTitle('Job (Name: ' + record.get('app_name') + ' / ID: ' + record.get('id') + ')');
        refs.realTimeGrid.setHidden(true);
        refs.jobCount.setHidden(true);
        refs.jobDetail.setHidden(false);
    },

    onItemDblClick: function(grid, record, item, index, e, eOpts) {
        if (grid.up('component').reference == 'monitoringGrid') {
            this.onJobDetailOpen(record);
            this.setWorkflowAction(record);
        }
    },

    gridRenderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var failedData, killedData;
        if (value != '') {
            failedData = record.getData()['getF' + (colIndex)];
            killedData = record.getData()['getK' + (colIndex)];

            if (failedData != undefined || killedData != undefined) {
                metaData.tdCls = 'grid-failed';
            } else {
                metaData.tdCls = 'grid-succeeded';
            }
        }
        return value;
    },

    onTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        switch (newCard.reference) {
            case 'info':
                break;
            case 'definition':
                newCard.setValue(tabPanel.inputData.getData().definition);
                break;
            case 'configuration':
                newCard.setValue(tabPanel.inputData.getData().configuration);
                break;
            case 'log':
                newCard.setValue(tabPanel.inputData.getData().log);
                break;
            default:
                break;
        }
    },

    onCellDblClick: function (view , td , cellIndex , record , tr , rowIndex , e , eOpts) {
        var refs = this.getReferences();
        var data = record.getData()['date' + (cellIndex)];

        if (data != '' && data != undefined) {
            var succeededData = record.getData()['getS' + (cellIndex)];
            var failedData = record.getData()['getF' + (cellIndex)];
            var killedData = record.getData()['getK' + (cellIndex)];
            var datetime;

            if (succeededData != undefined) {
                datetime = succeededData.start_time;
            } else if (failedData != undefined) {
                datetime = failedData.start_time;
            } else if (killedData != undefined) {
                datetime = killedData.start_time;
            }

            refs.timeGridDetail.getStore('timeGridDetailStore').load({
                params: {
                    datetime: datetime,
                    appName: record.getData().app_name,
                    status: '',
                    timezoneId: getTimeZone()
                }
            });

            refs.timeGridDetail.setTitle('Workflow Job History Per Hour ( ' + record.getData().app_name + '_' + (cellIndex) + ' )');

            refs.timeGridDetail.setCollapsed(false);
        }
    },

    onGanttDetailAfterrender: function (view) {
        var refs = this.getReferences();
        var succeededData = view.inputData['getS' + (view.cellIndex)];
        var failedData = view.inputData['getF' + (view.cellIndex)];
        var killedData = view.inputData['getK' + (view.cellIndex)];

        if (failedData == undefined && killedData == undefined) {
            refs.ganttFailGrid.tab.hide();
        }

        if (succeededData == undefined) {
            refs.ganttSuccessGrid.tab.hide();
            refs.ganttDetail.setActiveTab(refs.ganttFailGrid);
        } else {
            Ext.defer(function() {
                view.getViewModel().getStore('timeGridDetailStore').load({
                    params: {
                        datetime: succeededData.start_time,
                        appName: view.inputData.app_name,
                        status: succeededData.status,
                        timezoneId: getTimeZone()
                    }
                })
            }, 300);
        }
    },

    onTabChangePop: function (tabPanel, newCard, oldCard, eOpts) {
        var window = tabPanel.up('window');
        var succeededData = window.inputData['getS' + (window.cellIndex)];
        var failedData = window.inputData['getF' + (window.cellIndex)];
        var killedData = window.inputData['getK' + (window.cellIndex)];
        var datetime, status;

        switch (newCard.reference) {
            case 'ganttSuccessGrid':
                datetime = succeededData.start_time;
                status = succeededData.status;
                break;
            case 'ganttFailGrid':
                if (failedData == undefined) {
                    datetime = killedData.start_time;
                    status = killedData.status;
                } else {
                    datetime = failedData.start_time;
                    status = failedData.status;
                }
                break;
        }

        window.getViewModel().getStore('timeGridDetailStore').load({
            params: {
                datetime: datetime,
                appName: window.inputData.app_name,
                status: status,
                timezoneId: getTimeZone()
            }
        });
    },

    onRowDblClick: function (grid , record , tr , rowIndex , e , eOpts) {
        Ext.create('Flamingo.view.oozie.dashboard.WorkflowActionDetailPop', {
            title: 'Action (Name: ' + record.get('name') + ' / ID: ' + record.get('id') + ')',
            inputData: record
        }).show();
    },

    setWorkflowAction: function (record) {
        var refs = this.getReferences();

        refs.jobId.setValue(record.get('id'));
        refs.name.setValue(record.get('app_name'));
        refs.appPath.setValue(record.get('app_path'));
        refs.run.setValue(record.get('run'));
        refs.status.setValue(record.get('status'));
        refs.user.setValue(record.get('user_name'));
        refs.group.setValue(record.get('group_name'));
        refs.parentCoord.setValue(record.get('parent_id'));

        refs.createTime.setValue(record.get('created_time'));
        refs.startTime.setValue(record.get('start_time'));
        refs.lastModified.setValue(record.get('last_modified_time'));
        refs.endTime.setValue(record.get('end_time'));

        var store = this.getViewModel().getStore('workflowActionStore');
        store.proxy.extraParams.timezoneId = getTimeZone();
        this.getViewModel().getStore('workflowActionStore').load({
            params: {
                jobId: record.get('id')
            }
        });
    },

    onActionDetailPopAfterrender: function (view) {
        var refs = this.getReferences();
        refs.actionForm.getForm().setValues(view.inputData.getData());

        Ext.defer(function() {
            refs.childgrid.getStore('childStore').load({
                params: {
                    jobId: view.inputData.get('wf_job_id'),
                    timezoneId: getTimeZone(),
                    actionId: view.inputData.get('id')
                }
            });
        }, 300);
    },

    onActionDetailTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        switch (newCard.reference) {
            case 'actionForm':
                break;
            case 'configuration':
                this.getReferences().configuration.setValue(tabPanel.up('window').inputData.getData().configuration);
                break;
            default:
                break;
        }
    },

    onConsoleURL: function () {
        var refs = this.getReferences();
        window.open(refs.actionForm.getForm().getValues().console_url);
    },

    onAppPathClick: function () {
        var refs = this.getReferences();
        var hdfsPath = refs.appPath.getValue();

        //TODO config에 HDFS 경로를 추가해서 해당값으로 Replace 하도록 한다.
        Ext.create('Flamingo.view.hdfsbrowser.simple.SimpleHdfsFileBrowser', {
            path: hdfsPath.replace('hdfs://hdp01.exem.oss:8020', '')
        }).show();
    },

    onSimpleHdfsClose: function (record) {

    },

    onZoomIn: function () {
        this.zoom(-0.2);
    },

    onZoomOut: function () {
        this.zoom(0.2);
    },

    onMoveLeft: function () {
        this.move(0.2);
    },

    onMoveRight: function () {
        this.move(-0.2);
    },

    zoom: function (percentage) {
        var timeline = this.getReferences().timelineView.timeline;
        if (timeline == undefined) return;

        var range = timeline.getWindow();
        var interval = range.end - range.start;

        timeline.setWindow({
            start: range.start.valueOf() - interval * percentage,
            end:   range.end.valueOf()   + interval * percentage
        });
    },

    move: function (percentage) {
        var timeline = this.getReferences().timelineView.timeline;
        if (timeline == undefined) return;

        var range = timeline.getWindow();
        var interval = range.end - range.start;

        timeline.setWindow({
            start: range.start.valueOf() - interval * percentage,
            end:   range.end.valueOf()   - interval * percentage
        });
    },

    onGridTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        var me = this;
        var refs = me.getReferences();
        var datetime = new Date(refs.currentDate.rawDate).getTime();
        var store;

        switch (newCard.reference) {
            case 'gridPanel':
                store = me.getView().getViewModel().getStore('timeGridStore');
                break;
            case 'chartPanel':
                store = me.getView().getViewModel().getStore('workflowTimeline');
                break;
        }

        store.reload({
            params: {
                datetime: datetime,
                timezoneId: getTimeZone()
            },
            callback: function() {
                Ext.defer(function() {
                    $("[data-toggle=tooltip]").tooltip({container: 'body'});
                },1000);
            }
        });
    },

    onRefresh: function () {
        this.onFind();
    },

    onBeforeclose: function() {
        $('.ui-helper-hidden-accessible').remove();
    },

    onJobHistoryRowDblClick: function (grid , record , tr , rowIndex , e , eOpts) {
        Ext.create('Flamingo.view.oozie.dashboard.monitoring.TimeGridDetailPop', {
            title: 'Workflow (Name: ' + record.get('app_name') + ' / ID: ' + record.get('id') + ')',
            inputData: record,
            width: window.innerWidth - 200,
            height: window.innerHeight - 200
        }).show();
    },

    statusRenderer: function (value) {
        return statusConverter(value);
    },

    onTimezoneSelect: function (combo , value) {
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires: new Date(new Date().getTime()+315569259747) // about 10 years from now!
        }));
        Ext.state.Manager.set("TimezoneId", value.get('timezoneId'));

        this.onFind();
    }

});