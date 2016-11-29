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
Ext.define('Flamingo.view.workflowdesigner.nodeList.NodeListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.nodeListModel',

    stores: {
        nodemeta: {
            model: 'Flamingo.model.workflowdesigner.NodeMeta',

            data: [ // TODO description 다국어 처리
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/decision.png",
                    "identifier": "OOZIE_DECISION",
                    "name": 'Decision',
                    "qualifierLabel": "decision",
                    "description": 'Decision',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/fork.png",
                    "identifier": "OOZIE_FORK",
                    "name": 'Fork',
                    "qualifierLabel": "fork",
                    "description": 'Fork',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/join.png",
                    "identifier": "OOZIE_JOIN",
                    "name": 'Join',
                    "qualifierLabel": "join",
                    "description": 'Join',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/kill.png",
                    "identifier": "OOZIE_KILL",
                    "name": 'Kill',
                    "qualifierLabel": "kill",
                    "description": 'Kill',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/mapreduce.png",
                    "identifier": "OOZIE_MAPREDUCE",
                    "name": 'MapReduce',
                    "qualifierLabel": "mapreduce",
                    "description": 'MapReduce',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/dist_cp.png",
                    "identifier": "OOZIE_DISTCP",
                    "name": 'Dist CP',
                    "qualifierLabel": "distcp",
                    "description": 'Dist CP',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/shell.png",
                    "identifier": "OOZIE_SHELL",
                    "name": 'Shell',
                    "qualifierLabel": "shell",
                    "description": 'Shell',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                },
                {
                    "type": "OOZIE",
                    "icon": CONSTANTS.CONTEXT_PATH + "/resources/images/workflow/ssh.png",
                    "identifier": "OOZIE_SSH",
                    "name": 'SSH',
                    "qualifierLabel": "ssh",
                    "description": 'SSH',
                    "isCheckColumns": false,
                    "fixedInputColumns": false,
                    "fixedOutputColumns": false,
                    "readOnlyOutputColumns": false,
                    "ignoreInput": true,
                    "ignoreOutput": true,
                    "minPrevNodeCounts": 1,
                    "maxPrevNodeCounts": -1,
                    "minNextNodeCounts": 1,
                    "maxNextNodeCounts": -1,
                    "notAllowedPrevTypes": "",
                    "notAllowedNextTypes": "",
                    "notAllowedPrevNodes": "END",
                    "notAllowedNextNodes": ""
                }
            ]
        }
    }
});