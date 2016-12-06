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
Ext.define('Flamingo.view.workflowdesigner.workflowTree.WorkflowTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.workflowTreeController',

    onWorkflowTreeExpand: function () {
        var panel = this.lookupReference('treepanel');
        panel.expandAll();
    },

    onWorkflowTreeCollapse: function () {
        var panel = this.lookupReference('treepanel');
        panel.collapseAll();
    },

    onWorkflowTreeRefresh: function () {
        alert("tree refresh");
        var panel = this.lookupReference('treepanel');
        var refreshButton = this.lookupReference('refreshButton');
        refreshButton.setDisabled(true);
        panel.getStore().load({
            callback: function () {
                refreshButton.setDisabled(false);
            }
        });
    },

    onWorkflowTreeLoad: function (node, records) {
        var refreshButton = this.lookupReference('refreshButton');
        if (records.length > 0) {
            refreshButton.setDisabled(false);
        }
    },

    onWorkflowTreeRender: function () {
        // 브라우저 자체 Right Button을 막고자 한다면 uncomment한다.
        Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
        // If the root node has any child nodes, enable the refresh button.
        var panel = this.lookupReference('treepanel');
        if (panel.getRootNode().childNodes.length > 0) {
            var refreshButton = this.lookupReference('refreshButton');
            refreshButton.setDisabled(false);
        }
    },

    onWorkflowTreeItemappend: function () {
        var refreshButton = this.lookupReference('refreshButton');
        refreshButton.setDisabled(false);
    },

    /**
     * 워크플로우 Tree 목록에 저장된 워크플로우 정보를 불러온다.
     * @param view
     * @param record
     * @param item
     * @param index
     * @param e
     */
    onWorkflowTreeItemdblclick: function (view, record, item, index, e) {
        var me = this;

        if (record.data.iconCls == 'designer_not_load') {
            Ext.MessageBox.show({
                title: 'Load workflow',
                message: 'The selected workflow does not contain drawing information.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        if (record.data.cls != 'folder' && record.data.id != '/') {
            var canvas = Ext.ComponentQuery.query('canvas')[0];
            Ext.MessageBox.show({
                title: 'Load workflow',
                message: Ext.String.format('Do you want to load "{0}"?', record.data.text),
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.INFO,
                fn: function handler(btn) {
                    if (btn == 'yes') {
                        var treePanel = me.lookupReference('treepanel');
                        var node = treePanel.getSelectionModel().getSelection()[0].raw;

                        // 폴더인 경우에는 경로 메시지를 띄우고 노드의 경우에는 정상 처리한다.
                        if (node.leaf) {
                            var mask = new Ext.LoadMask(
                                Ext.ComponentQuery.query('canvas')[0], {
                                msg: 'Please Wait.'
                            });
                            mask.show();

                            invokeGetWithHeader(CONSTANTS.DESIGNER.LOAD,
                                {
                                    'Accept': 'text/plain'
                                },
                                {
                                    treeId: node.id
                                },
                                function (response) {
                                    var res = Ext.decode(response.responseText);

                                    mask.hide();

                                    var canvas = Ext.ComponentQuery.query('canvas')[0];
                                    var variableGrid = Ext.ComponentQuery.query('variableGrid')[0];
                                    var graphXML, graphJSON, workflowData;
                                    var form = canvas.getForm();

                                    // graph xml example
                                    graphXML = res.object;

                                    // XML 스트링을 JSON Object 로 변환하여 정보 획득
                                    graphJSON = OG.Util.xmlToJson(OG.Util.parseXML(graphXML));

                                    workflowData = OG.JSON.decode(unescape(graphJSON.opengraph['@data']));

                                    // 워크플로우 정보 로딩(클러스터, 워크플로우명, 설명, 워크플로우 식별자, 트리 식별자)
                                    form.reset();
                                    form.setValues(workflowData.workflow);

                                    form.findField('name').setValue(node.text);

                                    // 워크플로우 변수 정보 로딩
                                    variableGrid.getStore().loadData(workflowData.globalVariables);

                                    // 워크플로우 그래프 Shape 로딩
                                    canvas.graph.loadJSON(graphJSON);
                                    canvas.setwireEventAll();

                                    query('canvas #wd_btn_run').setDisabled(false);
                                    query('canvas #wd_btn_copy').setDisabled(false);
                                    query('canvas #wd_btn_xml').setDisabled(false);
                                },
                                function (response) {
                                    mask.hide();

                                    Ext.MessageBox.show({
                                        title: 'Load workflow',
                                        message: 'We were unable to load the workflow. Cause\:' + response.responseText,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.WARNING
                                    });
                                }
                            );
                        } else {
                            mask.hide();

                            Ext.MessageBox.show({
                                title: 'Load workflow',
                                message: 'Please select a workflow.',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    }
                }
            });
        }
    },

    /**
     * 디렉토리에서 마우스 오른쪽 버튼을 누르는 경우 Context Menu를 표시한다.
     */
    onWorkflowTreeItemcontextmenu: function (view, record, item, index, e) {
        var contextMenu = new Ext.menu.Menu({
            items: [
                {
                    text: 'Create Folder',
                    iconCls: 'common-directory-add',
                    tooltip: 'Create folder',
                    itemId: 'createFolderMenu',
                    handler: this.onCreateFolderMenuClick
                }, '-',
                {
                    text: 'Delete a workflow and a folder',
                    iconCls: 'common-directory-remove',
                    tooltip: 'Delete folder',
                    itemId: 'deleteFolderMenu',
                    handler: this.onDeleteWorkflowMenuClick
                }, '-',
                {
                    text: 'Rename a workflow and a folder name',
                    iconCls: 'common-directory-rename',
                    itemId: 'renameMenu',
                    tooltip: 'Change name',
                    handler: this.onRenameFolderMenuClick
                }
            ]
        });

        if (record.data.id == '/' || record.data.id == CONSTANTS.ROOT) {
            contextMenu.query('#createFolderMenu')[0].disabled = false;
            contextMenu.query('#renameMenu')[0].disabled = true;
            contextMenu.query('#deleteFolderMenu')[0].disabled = true;
        } else {
            contextMenu.query('#createFolderMenu')[0].disabled = false;
            contextMenu.query('#renameMenu')[0].disabled = false;
            contextMenu.query('#deleteFolderMenu')[0].disabled = false;
        }
        e.stopEvent();
        contextMenu.showAt([e.pageX - 5, e.pageY - 5]);
    },

    /**
     * 워크플로우 트리에서 폴더를 생성한다.
     */
    onCreateFolderMenuClick: function (widget, event) {
        var treepanel = query('workflowTree #workflowTreePanel');
        var selected = treepanel.getSelectionModel().getLastSelected();
        var isLeaf = selected.isLeaf();

        if (isLeaf) {
            Ext.MessageBox.show({
                title: 'Create Folder',
                message: 'Please select a folder',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        Ext.MessageBox.show({
            title: 'Create Folder',
            message: 'Please enter a folder name to create.',
            width: 300,
            prompt: true,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.INFO,
            multiline: false,
            value: 'folder',
            fn: function (btn, text) {
                if (btn === 'yes') {
                    if (isBlank(text)) {
                        return;
                    }

                    var param = {
                        id: selected.data.id,
                        parent: selected.data.id,
                        name: text,
                        nodeType: 'folder',
                        treeType: 'WORKFLOW'
                    };

                    invokePostByMap(CONSTANTS.DESIGNER.NEW, param,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
//                                var controller = Flamingo2.app.getController('designer.DesignerController');
//                                controller._info(format(message.msg('designer.msg.created.folder'), text));
                                updateNode(query('#workflowTreePanel'));
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Create Folder',
                                    message: obj.error.cause,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        },
                        function (response) {
                            Ext.MessageBox.show({
                                title: 'Create Folder',
                                message: format('The folder couldn`t be created. Cause\: {0}({1})', response.statusText, response.status),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    },

    /**
     * 선택한 워크플로우를 삭제한다.
     */
    onDeleteWorkflowMenuClick: function (widget, event) {
        var treepanel = query('workflowTree #workflowTreePanel');
        var node = treepanel.getSelectionModel().getLastSelected();

        if (!node) {
            Ext.MessageBox.show({
                title: 'Delete a workflow and a folder',
                message: 'Select a folder or workflow to remove.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        if (node.get('id') == '/') {
            Ext.MessageBox.show({
                title: 'Delete a workflow and a folder',
                message: 'You cannot delete the ROOT directory.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });
            return false;
        }

        var selectedNode = node;
        Ext.MessageBox.show({
            title: 'Delete a workflow and a folder',
            message: Ext.String.format('Are you sure you want to delete "{0}"?', node.get('text')),
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function handler(btn) {
                if (btn == 'yes') {
                    var param = {
                        id: '' + selectedNode.data.id,
                        text: selectedNode.data.text,
                        nodeType: selectedNode.data.cls == 'file' ? 'ITEM' : 'FOLDER',
                        leaf: selectedNode.data.cls == 'file' ? 'true' : 'false',
                        treeType: 'WORKFLOW'
                    };

                    invokePostByMap(CONSTANTS.DESIGNER.DELETE, param,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
                                updateParentNode(treepanel);

                                /////////////////////////////////////////////////////////
                                // 현재 로딩한 화면과 삭제할 트리 노드가 동일하다면 캔버스도 초기화한다.
                                /////////////////////////////////////////////////////////

                                var canvas = Ext.ComponentQuery.query('canvas')[0];
                                var variableGrid = Ext.ComponentQuery.query('variableGrid')[0];
                                var form = canvas.getForm();
                                var treeId = form.getValues()['tree_id'];
                                var startNode, endNode;

                                if (param.id == treeId) {
                                    // 워크플로우 기본 정보 초기화
                                    form.reset();

                                    // 워크플로우 변수 정보 로딩
                                    variableGrid.getStore().removeAll();

                                    // 워크플로우 그래프 Clear
                                    canvas.graph.clear();

                                    if (canvas.graph) {
                                        startNode = canvas.graph.drawShape([100, 100], new OG.E_Start('Start'), [30, 30]);
                                        endNode = canvas.graph.drawShape([700, 100], new OG.E_End('End'), [30, 30]);

                                        canvas.graph.setCustomData(startNode, {
                                            metadata: {
                                                "type": "START",
                                                "identifier": "START",
                                                "name": 'Start',
                                                "minPrevNodeCounts": "0",
                                                "maxPrevNodeCounts": "0",
                                                "minNextNodeCounts": "1",
                                                "maxNextNodeCounts": "N",
                                                "notAllowedPrevTypes": "",
                                                "notAllowedNextTypes": "END,IN,OUT",
                                                "notAllowedPrevNodes": "",
                                                "notAllowedNextNodes": "END"
                                            }
                                        });
                                        canvas.graph.setCustomData(endNode, {
                                            metadata: {
                                                "type": "END",
                                                "identifier": "END",
                                                "name": 'End',
                                                "minPrevNodeCounts": "1",
                                                "maxPrevNodeCounts": "N",
                                                "minNextNodeCounts": "0",
                                                "maxNextNodeCounts": "0",
                                                "notAllowedPrevTypes": "START,IN,OUT",
                                                "notAllowedNextTypes": "",
                                                "notAllowedPrevNodes": "START",
                                                "notAllowedNextNodes": ""
                                            }
                                        });
                                    }
                                }
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Delete a workflow and a folder',
                                    message: 'You cannot delete the selected row.<br/><br/>Cause\:' + obj.error.message,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        },
                        function (response) {
                            Ext.MessageBox.show({
                                title: 'Delete a workflow and a folder',
                                message: 'You cannot delete the selected row.',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    },

    /**
     * 워크플로우 트리에서 지정한 폴더 및 워크플로우의 이름을 변경한다.
     */
    onRenameFolderMenuClick: function (widget, event) {
        var treepanel = query('workflowTree #workflowTreePanel');
        var selected = treepanel.getSelectionModel().getLastSelected();

        Ext.MessageBox.show({
            title: 'Change Folder or Workflow Name',
            message: 'Please enter a name of folder or workflow to change.',
            width: 300,
            prompt: true,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            multiline: false,
            value: selected.get('text'),
            fn: function (btn, text) {
                if (btn === 'yes') {
                    if (App.Util.String.isBlank(text)) {
                        return;
                    }

                    var param = {
                        id: selected.data.id,
                        name: text,
                        leaf: selected.data.leaf,
                        workflowId: selected.data.workflowId
                    };

                    invokePostByMap(CONSTANTS.DESIGNER.RENAME, param,
                        function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (obj.success) {
//                                var controller = Flamingo2.app.getController('designer.DesignerController');
//                                controller._info(format(message.msg('designer.msg.changed.name'), text));
                                updateParentNode(treepanel);
//                                query('#workflowTreePanel').getStore().load();
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Change Folder or Workflow Name',
                                    message: obj.error.cause,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        },
                        function (response) {
                            Ext.MessageBox.show({
                                title: 'Change Folder or Workflow Name',
                                message: format('The name couldn`t be changed. Cause\: {0}({1})', response.statusText, response.status),
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    );
                }
            }
        });
    }
});