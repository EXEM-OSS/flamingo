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
Ext.define('Flamingo.view.workflowdesigner.canvas.events.onCanvasActionController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.onCanvasActionViewController',

    /**
     * 생성 버튼 Click 핸들러 : 워크플로우를 새로 생성하기위해 초기화 한다.
     */
    onCreateClick: function () {
        Ext.MessageBox.show({
            title: 'Warning',
            message: 'Do you want to create a new workflow?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var canvas = Ext.ComponentQuery.query('canvas')[0];
                    var variableGrid = Ext.ComponentQuery.query('variableGrid')[0];
                    var form = canvas.getForm();

                    // 워크플로우 기본 정보 초기화
                    form.reset();

                    // 워크플로우 변수 정보 로딩
                    variableGrid.getStore().removeAll();

                    // 워크플로우 그래프 Clear
                    canvas.graph.clear();

                    // 디폴트 시작, 끝 노드 드로잉
                    Ext.create('Flamingo.view.workflowdesigner.canvas.events._drawDefaultNodeController').run();

                    // 툴바 버튼 초기화
                    var runButton = Ext.ComponentQuery.query('canvas #wd_btn_run')[0];
                    runButton.setDisabled(true);

                    var copyButton = Ext.ComponentQuery.query('canvas #wd_btn_copy')[0];
                    copyButton.setDisabled(true);

                    var xmlButton = Ext.ComponentQuery.query('canvas #wd_btn_xml')[0];
                    xmlButton.setDisabled(true);
                }
            }
        });
    },

    /**
     * 저장 버튼 클릭 핸들러 : 워크플로우를 저장한다.
     */
    onSaveClick: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var form = canvas.getForm();
        var id = form.getValues()['id'];
        var isValid = form.isValid() && this._isValidWorkflow();
        var makeXml = this._makeGraphXML;

        if (!isValid) {
            return;
        }

        Ext.MessageBox.show({
            title: 'Warning',
            message: 'Do you want to save the workflow?',
            width: 300,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            scope: this,
            fn: function (btn, text, eOpts) {
                if (btn === 'yes') {
                    var canvas = Ext.ComponentQuery.query('canvas')[0];
                    var form = canvas.getForm();

                    if (form.getValues()['tree_id']) {
                        var params = {
                            id: form.getValues()['id'],
                            processId: form.getValues()['process_id'],
                            processDefinitionId: form.getValues()['process_definition_id'],
                            deploymentId: form.getValues()['deployment_id'],
                            treeId: form.getValues()['tree_id'],
                            parentTreeId: form.getValues()['parent_id']
                        };

                        info('Saving...', 'Saving workflow<br/>Please wait...');

                        invokePostByXML(CONSTANTS.OOZIE.WORKFLOW_SAVE, params, makeXml(),
                            function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (obj.success) {
                                    query('#workflowTreePanel').getStore().load();

                                    query('canvas #wd_btn_run').setDisabled(false);
                                    query('canvas #wd_btn_copy').setDisabled(false);
                                    query('canvas #wd_btn_xml').setDisabled(false);
                                } else {
                                    error('Save failure', 'Could not save the workflow');
                                }
                            },
                            function (response) {
                                error('Save failure', 'Could not save the workflow');
                            }
                        );
                    } else {
                        var popWindow = Ext.create('Ext.Window', {
                            title: 'Please select a folder to save',
                            width: 450,
                            height: 300,
                            modal: true,
                            resizable: true,
                            constrain: true,
                            animateTarget: 'wd_btn_save',
                            layout: 'fit',
                            items: {
                                xtype: 'folderTree'
                            },
                            buttons: [
                                {
                                    text: 'Confirm',
                                    handler: function () {
                                        var treePanel = popWindow.query('treepanel')[0];
                                        var selectedNode = treePanel.getSelectionModel().getLastSelected();
                                        var form = canvas.getForm();
                                        var win = popWindow;

                                        if (selectedNode && selectedNode.data.leaf == false) {
                                            var params = {
                                                id: form.getValues()['id'],
                                                processId: form.getValues()['process_id'],
                                                processDefinitionId: form.getValues()['process_definition_id'],
                                                deploymentId: form.getValues()['deployment_id'],
                                                treeId: form.getValues()['tree_id'],
                                                parentTreeId: selectedNode.data.id
                                            };

                                            info('Saving...', 'Saving workflow<br/>Please wait...');

                                            invokePostByXML(CONSTANTS.OOZIE.WORKFLOW_SAVE, params, makeXml(),
                                                function (response) {
                                                    var obj = Ext.decode(response.responseText);
                                                    if (obj.success) {
                                                        win.close();

                                                        query('#workflowTreePanel').getStore().load();

                                                        form.setValues(obj.map);

                                                        query('canvas #wd_btn_run').setDisabled(false);
                                                        query('canvas #wd_btn_copy').setDisabled(false);
                                                        query('canvas #wd_btn_xml').setDisabled(false);
                                                    } else {
                                                        error('Save failure', 'Could not save the workflow');
                                                    }
                                                },
                                                function () {
                                                    error('Save failure', 'Could not save the workflow');
                                                }
                                            );
                                        } else {
                                            error('Warning', 'Please select a folder to save');
                                        }
                                    }
                                }
                            ]
                        }).show();
                    }
                }
            },
            animateTarget: 'wd_btn_save'
        });
    },

    /**
     * 실행 버튼 Click 핸들러 : 워크플로우를 실행한다.
     */
    onRunClick: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var form = canvas.getForm();
        var isValid = form.isValid() && this._isValidWorkflow();

        if (!isValid) {
            return;
        }

        var params = {
            treeId: form.getValues()['tree_id'],
            name: form.getValues()['name']
        };

        Ext.MessageBox.show({
            title: 'Information',
            message: 'Do you want to execute the workflow?',
            width: 300,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            scope: this,
            fn: function (btn, text, eOpts) {
                if (btn === 'yes') {
                    // 워크플로우를 실행한다.
                    invokePostByMap(CONSTANTS.OOZIE.WORKFLOW_RUN, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                Ext.create('Flamingo.view.workflowdesigner.monitoring.WorkflowMonitoringWindow', {
                                    propertyData: obj.map.identifier
                                }).center().show();

                                //Ext.create('Flamingo.view.workflowdesigner.Toast', {
                                //    title: obj.map.name,
                                //    position: 'tr',
                                //    width: 250,
                                //    jobId: obj.map.jobId,
                                //    slideInDelay: 600,
                                //    autoClose: false,
                                //    slideDownAnimation: 'easeIn'
                                //}).show();
                            } else {
                                error('Failed in executing workflow', obj.error.cause);
                            }
                        },
                        function (response) {
                            error('Failed in executing workflow', response.statusText);
                        }
                    );
                }
            },
            animateTarget: 'wd_btn_run'
        });
    },

    /**
     * 액션 버튼 Click 핸들러 : 워크플로우를 실행한다. //SHELL용 테스터
     */
    onActionClick: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var form = canvas.getForm();
        var isValid = form.isValid() && this._isValidWorkflow();

        if (!isValid) {
            return;
        }

        var params = {
            treeId: form.getValues()['tree_id'],
            name: form.getValues()['name']
        };

        Ext.MessageBox.show({
            title: 'Information',
            message: 'Do you want to execute the workflow action?',
            width: 300,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            scope: this,
            fn: function (btn, text, eOpts) {
                if (btn === 'yes') {
                    // 워크플로우를 실행한다.
                    invokePostByMap(CONSTANTS.OOZIE.WORKFLOW_ACTION, params,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                Ext.create('Flamingo.view.workflowdesigner.monitoring.WorkflowMonitoringWindow', {
                                    propertyData: obj.map.identifier
                                }).center().show();

                                //Ext.create('Flamingo.view.workflowdesigner.Toast', {
                                //    title: obj.map.name,
                                //    position: 'tr',
                                //    width: 250,
                                //    jobId: obj.map.jobId,
                                //    slideInDelay: 600,
                                //    autoClose: false,
                                //    slideDownAnimation: 'easeIn'
                                //}).show();
                            } else {
                                error('Failed in executing workflow', obj.error.cause);
                            }
                        },
                        function (response) {
                            error('Failed in executing workflow', response.statusText);
                        }
                    );
                }
            },
            animateTarget: 'wd_btn_action'
        });
    },

    onWorkflowCopyClick: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var form = canvas.getForm();
        var id = form.getValues()['id'];
        var isValid = form.isValid() && this._isValidWorkflow();

        if (!isValid) {
            return;
        }

        var popWindow = Ext.create('Ext.Window', {
            title: 'Please select a folder to copy.',
            width: 450,
            height: 300,
            modal: true,
            resizable: true,
            constrain: true,
            animateTarget: 'wd_btn_copy',
            layout: 'fit',
            items: {
                xtype: 'folderTree'
            },
            buttons: [
                {
                    text: 'Confirm',
                    handler: function () {
                        var treePanel = popWindow.query('treepanel')[0];
                        var selectedNode = treePanel.getSelectionModel().getLastSelected();
                        var form = canvas.getForm();

                        if (selectedNode && selectedNode.data.leaf == false) {
                            var params = {
                                id: form.getValues()['id'],
                                processId: form.getValues()['process_id'],
                                treeId: form.getValues()['tree_id'],
                                parentTreeId: '' + selectedNode.data.id
                            };

                            var win = popWindow;
                            invokePostByMap(CONSTANTS.DESIGNER.COPY, params,
                                function (response) {
                                    var obj = Ext.decode(response.responseText);
                                    if (obj.success) {
                                        win.close();
                                        query('workflowTree > treepanel').getStore().load();

                                        info('Workflow Copy Success', 'Workflow has been copied<br/>You can see the workflow on workflow list');
                                    } else {
                                        win.close();

                                        error('Workflow Copy Failure', obj.error.cause);
                                    }
                                },
                                function (response) {
                                    win.close();

                                    error('Workflow Copy Failure', response.statusText);
                                }
                            );
                        } else {
                            error('Warning', 'Please select a folder to save');
                        }
                    }
                }
            ]
        }).show();
    },

    /**
     * XML보기 버튼 Click 핸들러 : 워크플로우 XML 을 팝업으로 보여준다.
     */
    onWorkflowXMLClick: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var form = canvas.getForm();
        var id = form.getValues()['id'];

        var params = {
            treeId: form.getValues()['tree_id']
        };

        invokeGet(CONSTANTS.DESIGNER.SHOW, params,
            function (response) {
                var res = Ext.decode(response.responseText);
                var xmlWin = Ext.create('Ext.window.Window', {
                    title: 'Workflow XML',
                    width: 850,
                    height: 600,
                    layout: 'fit',
                    resizable: false,
                    modal: true,
                    closeAction: 'destroy',
                    buttons: [
                        {
                            text: 'Confirm',
                            handler: function () {
                                xmlWin.close();
                            }
                        }
                    ],
                    items: [
                        {
                            itemId: 'xml',
                            border: 0,
                            name: 'xml',
                            xtype: 'aceEditor',
                            forceFit: true,
                            theme: 'chrome',
                            printMargin: false,
                            parser: 'xml',
                            readOnly: true,
                            margin: '5 5 5 5',
                            script: res.object
                        }
                    ],
                    animateTarget: 'wd_btn_xml'
                }).center().show();
            },
            function (response) {
                error('Loading failure', 'We were unable to load the workflow.<br/>Cause\:' + response.statusText);
            }
        );
    },

    /**
     * 워크플로우 그래프의 노드 연결 Validation 을 체크한다.
     *
     * @return {Boolean}
     * @private
     */
    _isValidWorkflow: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            getPropertyWindow = this._getPropertyWindow,
            allNodes = canvas.graph.getElementsByType(),
            nodeData, nodeMeta, nodeProperties,
            prevShapes, nextShapes,
            nextOfPrevShapes, prevOfNextShapes, count = 0, customData,
            propertyWindow;

        canvas.graph.removeAllGuide();

        for (var i = 0; i < allNodes.length; i++) {
            nodeData = Ext.clone(canvas.graph.getCustomData(allNodes[i]));
            if (nodeData && nodeData.metadata) {
                nodeMeta = nodeData.metadata;
                nodeProperties = nodeData.properties;
                prevShapes = canvas.graph.getPrevShapes(allNodes[i]);
                nextShapes = canvas.graph.getNextShapes(allNodes[i]);

                // 1. 이후 노드 최소 연결 노드 수 체크
                if (nodeMeta.minNextNodeCounts >= 0 && nextShapes.length < nodeMeta.minNextNodeCounts) {
                    App.UI.errormsg('Warning', Ext.String.format('There should be at least "{1}" node(s) after "{0}" node.', nodeMeta.name, nodeMeta.minNextNodeCounts));
                    return false;
                }

                // 2. 이전 노드 최소 연결 노드 수 체크
                if (nodeMeta.minPrevNodeCounts >= 0 && prevShapes.length < nodeMeta.minPrevNodeCounts) {
                    App.UI.errormsg('Warning', Ext.String.format('There should be at least "{1}" node(s) after "{0}" node.', nodeMeta.name, nodeMeta.minPrevNodeCounts));
                    return false;
                }

                // 3. START 노드와 직접 연결된 노드는 IN 타입 노드와 반드시 1개 이상 연결 되어야 함
                if (nodeMeta.type === 'START') {
                    for (var j = 0; j < nextShapes.length; j++) {
                        customData = Ext.clone(canvas.graph.getCustomData(nextShapes[j]));

                        // ignoreInput 이 false 인 경우 체크
                        if (customData.metadata.ignoreInput !== true) {
                            prevOfNextShapes = canvas.graph.getPrevShapes(nextShapes[j]);
                            count = 0;
                            for (var k = 0; k < prevOfNextShapes.length; k++) {
                                customData = Ext.clone(canvas.graph.getCustomData(prevOfNextShapes[k]));
                                if (customData && customData.metadata.type === 'IN') {
                                    count++;
                                }
                            }

                            if (count < 1) {
                                canvas.graph.getEventHandler().selectShape(nextShapes[j]);
                                App.UI.errormsg('Warning', 'A node connected to the START node must have a connection with one or more IN nodes.');
                                return false;
                            }
                        }
                    }
                }

                // 4. END 노드와 직접 연결된 노드는 OUT 타입 노드와 반드시 1개 이상 연결 되어야 함
                if (nodeMeta.type === 'END') {
                    for (var j = 0; j < prevShapes.length; j++) {
                        customData = Ext.clone(canvas.graph.getCustomData(prevShapes[j]));

                        // ignoreOutput 이 false 인 경우 체크
                        if (customData.metadata.ignoreOutput !== true) {
                            nextOfPrevShapes = canvas.graph.getNextShapes(prevShapes[j]);
                            count = 0;
                            for (var k = 0; k < nextOfPrevShapes.length; k++) {
                                customData = Ext.clone(canvas.graph.getCustomData(nextOfPrevShapes[k]));
                                if (customData && customData.metadata.type === 'OUT') {
                                    count++;
                                }
                            }

                            if (count < 1) {
                                canvas.graph.getEventHandler().selectShape(prevShapes[j]);
                                App.UI.errormsg('Warning', 'A node connected to the END node must have a connection with one or more OUT nodes.');
                                return false;
                            }
                        }
                    }
                }
                // 5. 노드 프라퍼티 form validation 체크
                if (Ext.isDefined(nodeData.isValidated) && !nodeData.isValidated) {
                    var excludeidentifier = ['BPMN_JOIN', 'BPMN_INCLUSIVE_JOIN', 'SHELL_SAMPLE'];
                    if (
                        $.inArray(nodeMeta.identifier, excludeidentifier) == -1) {

                        propertyWindow = getPropertyWindow(allNodes[i]);
                        if (propertyWindow) {
                            propertyWindow.show();
                            propertyWindow.child(nodeMeta.identifier).isFormValid();
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    },


    /**
     * 프라퍼티 윈도우 인스턴스를 생성하여 반환한다.
     *
     * @param {Element} graphElement 그래프 엘리먼트
     * @return {Ext.Window}
     * @private
     */
    _getPropertyWindow: function (graphElement) {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            nodeData = Ext.clone(canvas.graph.getCustomData(graphElement)),
            nodeMeta = nodeData ? nodeData.metadata : null,
            nodeProperty = nodeData ? nodeData.properties : null,
            popWindow;

        if (nodeMeta && nodeProperty) {
            var nodextype;
            var nodetitle;
            if (nodeMeta.type == 'ROLE') {
                nodextype = 'SHELL_ROLE';
                nodetitle = nodeMeta.name;
            }
            else if (nodeMeta.type == 'NODE') {
                nodextype = 'SHELL_NODE';
                nodetitle = 'Select Node';
            }
            else {
                nodextype = nodeMeta.identifier;
                nodetitle = graphElement.shape.label;
            }

            popWindow = Ext.create('Ext.Window', {
                title: nodetitle,
                modal: true,
                resizable: true,
                constrain: true,
                animateTarget: graphElement,
                layout: 'fit',
                tools: [
                    {
                        type: 'restore',
                        tooltip: 'Window Size',
                        value: 0,
                        handler: function (event, toolEl, panel) {
                            var node = popWindow.child(nodeMeta.identifier);
                            if (this.value == 0) {
                                node.setWidth(850);
                                node.setHeight(500);
                                popWindow.center();
                                this.value = 1;
                            } else if (this.value == 1) {
                                node.setWidth(600);
                                node.setHeight(400);
                                popWindow.center();
                                this.value = 0;
                            }
                        }
                    }
                ],
                items: {
                    xtype: nodextype,
                    nodeData: nodeData,
                    shapeElement: graphElement
                },
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'Confirm',
                        handler: function () {
                            // 노드 프라퍼티 유효성 체크한 후 Graph Element 에 커스텀 데이터로 저장
                            var node = popWindow.child(nodextype), isChanged = false;
                            if (node.isFormValid()) {

                                isChanged = Ext.encode(Ext.clone(canvas.graph.getCustomData(graphElement)).properties) !== Ext.encode(node.getNodeProperties());

                                nodeData.properties = node.getNodeProperties();
                                nodeData.metadata = node.getMetadata();

                                nodeData.filteredProperties = node.getFilteredNodeProperties();

                                nodeData.isValidated = true;
                                node.nodeData = nodeData;
                                canvas.graph.setCustomData(graphElement, node.nodeData);

                                if (isChanged) {

                                    // nodeChanged 이벤트 발생시켜 컬럼 정보 적용
                                    canvas.fireEvent('nodeChanged', canvas, graphElement);

                                    // 라벨이 체인지 되었으면 라벨을 바꿔준다.
                                    canvas.graph.getRenderer().drawLabel(graphElement, nodeData.metadata.name);

                                    //wire된 노드들끼리의 provider 의존관계를 재설정한다.
                                    node.resetProvide();
                                }

                                popWindow.close();
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        handler: function () {
                            popWindow.close();
                        }
                    }
                ]
            });
        }

        return popWindow;
    },

    /**
     * 워크플로우 그래프 XML 을 생성한다.
     *
     * @return {String}
     * @private
     */
    _makeGraphXML: function () {
        var canvas = Ext.ComponentQuery.query('canvas')[0];
        var form = canvas.getForm(),
            variableGrid = query('variableGrid'),
            variableArray = [];

        variableGrid.getStore().each(function (record, idx) {
            variableArray.push({
                name: record.get('name'),
                value: record.get('value')
            });
        });

        canvas.graph.setCustomData(canvas.graph.getRootGroup(), {
            workflow: form.getValues(),
            globalVariables: variableArray
        });
        return canvas.graph.toXML();
    },

    /**
     * 이전 노드들의 식별자, 컬럼구분자, 컬럼정보를 현재 노드에 적용한다.
     *
     * @param {Element} element
     * @private
     */
    _applyPrevColumnInfo: function (element) {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            nodeData = Ext.clone(canvas.graph.getCustomData(element)),
            nodeMeta = nodeData ? nodeData.metadata : {},
            nodeProperties = nodeData ? nodeData.properties : {},
            prevShapes, prevNodeData, prevNodeMeta, prevNodeProperties,
            nextShapes,
            columnNames, columnKorNames, columnTypes, columnDescriptions,
            delimiterType, delimiterValue;

        // 이전 노드들의 컬럼구분자, 컬럼정보를 현재 노드에 적용
        if (nodeMeta.type && nodeMeta.type !== 'START' && nodeMeta.type !== 'END') {
            var hashMap = new Ext.util.HashMap(), prevQualifiers = [], prevDelimiterValue;

            prevShapes = canvas.graph.getPrevShapes(element);
            for (var i = 0; i < prevShapes.length; i++) {
                prevNodeData = Ext.clone(canvas.graph.getCustomData(prevShapes[i]));
                prevNodeMeta = prevNodeData ? prevNodeData.metadata : {};
                prevNodeProperties = prevNodeData ? prevNodeData.properties : {};

                if (prevNodeMeta.type && prevNodeMeta.type !== 'START') {
                    delimiterType = prevNodeProperties.delimiterType;
                    delimiterValue = prevNodeProperties.delimiterValue;

                    // 1. 컬럼구분자, 컬럼명이 일치 해야하는 경우 연결 유효성 체크 -> 컬럼정보설정
                    if (nodeMeta.fixedInputColumns === true || nodeMeta.isCheckColumns === true) {
                        // 이전 노드와 컬럼정보 체크하여 불일치시 연결 해제 처리
                        if (!Ext.isEmpty(prevNodeProperties.columnNames) && !Ext.isEmpty(nodeProperties.prevColumnNames) && !Ext.isEmpty(nodeProperties.prevDelimiterValue) &&
                            (!this._checkColumnInfo(prevNodeProperties, nodeProperties) || !(prevNodeProperties.delimiterType === nodeProperties.prevDelimiterValue ||
                            prevNodeProperties.delimiterValue === nodeProperties.prevDelimiterValue))) {
                            if (this._disconnect(prevShapes[i], element)) {
                                msg('Information', 'The connection is lost because column information has been modified.');
                                this._info('The connection is lost because column information has been modified.');
                                break;
                            }
                        } else {
                            // 컬럼구분자, 컬럼명이 일치해야하는 경우 최종 정보 적용
                            Ext.each(['columnNames', 'columnKorNames', 'columnTypes', 'columnDescriptions'], function (field) {
                                if (Ext.isDefined(prevNodeProperties[field])) {
                                    hashMap.add(field, prevNodeProperties[field].split(','));
                                }
                            });
                        }

                        // 이전 노드 구분자
                        prevDelimiterValue = delimiterType === 'CUSTOM' ? delimiterValue : delimiterType;
                    }
                    // 2. 컬럼구분자, 컬럼명이 일치 안해도 되는 경우 Append
                    else {
                        if (Ext.isEmpty(prevNodeProperties.columnNames)) {
                            if (this._disconnect(prevShapes[i], element)) {
                                msg('Information', 'The connection is lost because column information has been modified.');
                                this._info('The connection is lost because column information has been modified.');
                                break;
                            }
                        }

                        // 컬럼정보 append
                        Ext.each(['columnNames', 'columnKorNames', 'columnTypes', 'columnDescriptions'], function (field) {
                            if (Ext.isDefined(prevNodeProperties[field])) {
                                if (hashMap.containsKey(field)) {
                                    hashMap.get(field).push(prevNodeProperties[field].split(','));
                                } else {
                                    hashMap.add(field, prevNodeProperties[field].split(','));
                                }
                            }
                        });

                        // 식별자 append
                        Ext.each(prevNodeProperties.columnNames.split(','), function () {
                            prevQualifiers.push(prevNodeProperties.outputPathQualifier);
                        });

                        // 이전 노드 구분자
                        prevDelimiterValue = delimiterType === 'CUSTOM' ? delimiterValue : delimiterType;
                    }
                }
            }

            columnNames = hashMap.containsKey('columnNames') ? hashMap.get('columnNames').toString() : "";
            columnKorNames = hashMap.containsKey('columnKorNames') ? hashMap.get('columnKorNames').toString() : "";
            columnTypes = hashMap.containsKey('columnTypes') ? hashMap.get('columnTypes').toString() : "";
            columnDescriptions = hashMap.containsKey('columnDescriptions') ? hashMap.get('columnDescriptions').toString() : "";

            // 3. OUT 타입이면 출력컬럼에 이전 노드 출력컬럼을 자동으로 설정
            if (nodeMeta.type === 'OUT' && nodeMeta.fixedOutputColumns !== true) {
                nodeProperties.columnNames = columnNames;
                nodeProperties.columnKorNames = columnKorNames;
                nodeProperties.columnTypes = columnTypes;
                nodeProperties.columnDescriptions = columnDescriptions;
                nodeProperties.delimiterType = delimiterType || nodeProperties.delimiterType;
                nodeProperties.delimiterValue = delimiterValue || nodeProperties.delimiterValue;
                if (nodeMeta.fixedInputColumns !== true) {
                    nodeProperties.prevDelimiterValue = prevDelimiterValue;
                }

                nodeData.isValidated = false;
                canvas.graph.setCustomData(element, nodeData);
            }
            // 4. 컬럼정보 변경 여부 체크하여 변경된 경우 입력컬럼 정보 적용
            else if (!this._checkColumnInfo(
                    {
                        'columnNames': columnNames,
                        'columnTypes': columnTypes
                    }, nodeProperties) ||
                prevQualifiers.toString() !== nodeProperties.prevQualifier ||
                prevDelimiterValue !== nodeProperties.prevDelimiterValue) {

                // 입력컬럼이 고정인 경우는 변경하지 않음
                if (nodeMeta.fixedInputColumns !== true) {
                    nodeProperties.prevDelimiterValue = prevDelimiterValue;
                    nodeProperties.prevQualifier = prevQualifiers.toString();
                    nodeProperties.prevColumnNames = columnNames;
                    nodeProperties.prevColumnKorNames = columnKorNames;
                    nodeProperties.prevColumnTypes = columnTypes;
                    nodeProperties.prevColumnDescriptions = columnDescriptions;

                    nodeData.isValidated = false;
                    canvas.graph.setCustomData(element, nodeData);
                }

                // 출력컬럼이 고정인 경우는 변경하지 않음
                if (nodeMeta.fixedOutputColumns !== true) {
                    // readOnlyOutputColumns 가 true 이고 입력컬럼정보가 없는 경우 출력컬럼 리셋처리
                    if (nodeMeta.readOnlyOutputColumns === true && Ext.isEmpty(columnNames)) {
                        nodeProperties.columnNames = columnNames;
                        nodeProperties.columnKorNames = columnKorNames;
                        nodeProperties.columnTypes = columnTypes;
                        nodeProperties.columnDescriptions = columnDescriptions;
                    }
                    nodeProperties.delimiterType = delimiterType || nodeProperties.delimiterType;
                    nodeProperties.delimiterValue = delimiterValue || nodeProperties.delimiterValue;

                    nodeData.isValidated = false;
                    canvas.graph.setCustomData(element, nodeData);

                    // recursive 하게 다음 노드에도 적용
                    nextShapes = canvas.graph.getNextShapes(element);
                    for (i = 0; i < nextShapes.length; i++) {
                        // recursive call
                        this._applyPrevColumnInfo(nextShapes[i]);
                    }
                }
            }
        }
    },

    /**
     * 이전, 이후 노드의 입,출력 컬럼 정보 일치 여부를 체크한다.
     *
     * @param {Object} prevProperties 이전 노드 프라퍼티
     * @param {Object} nextProperties 이후 노드 프라퍼티
     * @return {Boolean} 일치여부(true:일치, false:불일치)
     * @private
     */
    _checkColumnInfo: function (prevProperties, nextProperties) {
        return !(prevProperties.columnNames !== nextProperties.prevColumnNames ||
        prevProperties.columnTypes !== nextProperties.prevColumnTypes);
    },

    /**
     * 주어진 두 노드의 연결을 해제한다.
     *
     * @param {Element} prevShape 이전 노드
     * @param {Element} nextShape 이후 노드
     * @return {Boolean} 연결해제여부
     * @private
     */
    _disconnect: function (prevShape, nextShape) {
        var canvas = Ext.ComponentQuery.query('canvas')[0],
            edges = canvas.graph.getNextEdges(prevShape),
            _fromedge = nextShape.getAttribute("_fromedge").split(",");

        for (var i = 0; i < edges.length; i++) {
            for (var j = 0; j < _fromedge.length; j++) {
                if (edges[i].id === _fromedge[j]) {
                    canvas.graph.removeShape(edges[i]);
                    return true;
                }
            }
        }
        return false;
    }
});