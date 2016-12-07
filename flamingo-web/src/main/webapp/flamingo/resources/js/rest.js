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
var CONSTANTS                                   = {};
CONSTANTS.CONTEXT_PATH                          = '';
CONSTANTS.FS                                    = {};
CONSTANTS.DESIGNER                              = {};
CONSTANTS.DESIGNER.TREE                         = {};
CONSTANTS.OOZIE                                 = {};
CONSTANTS.OOZIE.DASHBOARD                       = {};
CONSTANTS.OOZIE.DASHBOARD.MONITORING            = {};
CONSTANTS.OOZIE.WORKFLOW                        = {};
CONSTANTS.OOZIE.WORKFLOW.JOB                    = {};
CONSTANTS.OOZIE.WORKFLOW.ACTION                 = {};
CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION         = {};
CONSTANTS.OOZIE.WORKFLOW.JOB.CONFIGURATION      = {};
CONSTANTS.OOZIE.WORKFLOW.JOB.LOG                = {};
CONSTANTS.OOZIE.COORDINATOR                     = {};
CONSTANTS.OOZIE.COORDINATOR.ACTION              = {};
CONSTANTS.OOZIE.COORDINATOR.JOB                 = {};
CONSTANTS.OOZIE.COORDINATOR.JOB.DEFINITION      = {};
CONSTANTS.OOZIE.COORDINATOR.JOB.CONFIGURATION   = {};
CONSTANTS.OOZIE.COORDINATOR.JOB.LOG             = {};
CONSTANTS.OOZIE.COORDINATOR.WORKFLOW            = {};
CONSTANTS.OOZIE.BUNDLE                          = {};
CONSTANTS.OOZIE.BUNDLE.JOB                      = {};
CONSTANTS.OOZIE.BUNDLE.ACTION                   = {};
CONSTANTS.OOZIE.BUNDLE.JOB.DEFINITION           = {};
CONSTANTS.OOZIE.BUNDLE.JOB.CONFIGURATION        = {};
CONSTANTS.OOZIE.BUNDLE.JOB.LOG                  = {};
CONSTANTS.OOZIE.SYSTEMINFO                      = {};

CONSTANTS.DESIGNER.TREE.GET             = '/tree/get.json';



///////////////////////////////////////
// File System > HDFS
///////////////////////////////////////

CONSTANTS.FS.HDFS_GET_DIRECTORY                 = '/fs/hdfs/directory.json';
CONSTANTS.FS.HDFS_GET_FILE                      = '/fs/hdfs/file.json';
CONSTANTS.FS.HDFS_GET_LIST                      = '/fs/hdfs/list.json';
CONSTANTS.FS.HDFS_GET_TOPN                      = '/fs/hdfs/topN.json';
CONSTANTS.FS.HDFS_CREATE_DIRECTORY              = '/fs/hdfs/createDirectory.json';
CONSTANTS.FS.HDFS_DELETE_DIRECTORY              = '/fs/hdfs/deleteDirectory.json';
CONSTANTS.FS.HDFS_RENAME_DIRECTORY              = '/fs/hdfs/renameDirectory.json';
CONSTANTS.FS.HDFS_MOVE_DIRECTORY                = '/fs/hdfs/moveDirectory.json';
CONSTANTS.FS.HDFS_COPY_DIRECTORY                = '/fs/hdfs/copyDirectory.json';
CONSTANTS.FS.HDFS_GET_DIRECTORY_INFO            = '/fs/hdfs/getDirectoryInfo.json';
CONSTANTS.FS.HDFS_UPLOAD_FILE                   = '/fs/hdfs/upload.json';
CONSTANTS.FS.HDFS_DOWNLOAD_FILE                 = '/fs/hdfs/download.json';
CONSTANTS.FS.HDFS_GET_FILE_INFO                 = '/fs/hdfs/getFileInfo.json';
CONSTANTS.FS.HDFS_COPY_FILE                     = '/fs/hdfs/copyFiles.json';
CONSTANTS.FS.HDFS_MOVE_FILE                     = '/fs/hdfs/moveFiles.json';
CONSTANTS.FS.HDFS_RENAME_FILE                   = '/fs/hdfs/renameFile.json';
CONSTANTS.FS.HDFS_DELETE_FILE                   = '/fs/hdfs/deleteFiles.json';
CONSTANTS.FS.HDFS_GET_DEFAULT_FILE_CONTENTS     = '/fs/hdfs/initViewFileContents.json';
CONSTANTS.FS.HDFS_GET_FILE_CONTENTS             = '/fs/hdfs/viewFileContents.json';
CONSTANTS.FS.HDFS_GET_MERGE_FILE                = '/fs/hdfs/mergeFiles';
CONSTANTS.FS.HDFS_SET_PERMISSION                = '/fs/hdfs/setPermission';
CONSTANTS.FS.HDFS_COPY_TO_LOCAL                 = '/fs/hdfs/copyToLocal';
CONSTANTS.FS.HDFS_SAVE_MAX                      = '/fs/hdfs/saveMax';
CONSTANTS.FS.GET_HDFS_TOP5                      = '/fs/top5.json';
CONSTANTS.FS.CHECK_FILEINFO                     = '/fs/hdfs/checkFileInfo';


///////////////////////////////////////
// File System > S3
///////////////////////////////////////
CONSTANTS.FS.S3_LIST_OBJECT                     = '/fs/s3/listObjects.json';
CONSTANTS.FS.S3_LIST_FOLDER                     = '/fs/s3/listFolders.json';
CONSTANTS.FS.S3_CREATE_BUCKET                   = '/fs/s3/createBucket.json';
CONSTANTS.FS.S3_DELETE_BUCKET                   = '/fs/s3/deleteBucket.json';
CONSTANTS.FS.S3_GET_BUCKET_ACL                  = '/fs/s3/getBucketAcl.json';
CONSTANTS.FS.S3_GET_BUCKET_LOCATION             = '/fs/s3/getBucketLocation.json';
CONSTANTS.FS.S3_CREATE_FOLDER                   = '/fs/s3/createFolder.json';
CONSTANTS.FS.S3_COPY_OBJECT                     = '/fs/s3/copyObject.json';
CONSTANTS.FS.S3_MOVE_OBJECT                     = '/fs/s3/moveObject.json';
CONSTANTS.FS.S3_RENAME_OBJECT                   = '/fs/s3/renameObject.json';
CONSTANTS.FS.S3_DELETE_OBJECT                   = '/fs/s3/deleteObject.json';
CONSTANTS.FS.S3_UPLOAD_OBJECT                   = '/fs/s3/upload.json';
CONSTANTS.FS.S3_DOWNLOAD_OBJECT                 = '/fs/s3/download.json';
CONSTANTS.FS.S3_GET_OBJECT_PROPERTY             = '/fs/s3/getObjectProperty.json';
CONSTANTS.FS.S3_GET_OBJECT_ACL                  = '/fs/s3/getObjectAcl.json';
CONSTANTS.FS.S3_PREVIEW_OBJECT                  = '/fs/s3/getObjectAsString.json';

///////////////////////////////////////
// Workflow Designer
///////////////////////////////////////
CONSTANTS.OOZIE.WORKFLOW_ACTION                 = '/oozie/workflowdesigner/action.json';


///////////////////////////////////////
// Oozie
///////////////////////////////////////
// dashboard
CONSTANTS.OOZIE.DASHBOARD.MONITORING.INFO                        = '/oozie/dashboard/monitoring/info';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WORKFLOW                = '/oozie/dashboard/monitoring/workflow';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_COORDINATOR             = '/oozie/dashboard/monitoring/coordinator';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_BUNDLE                  = '/oozie/dashboard/monitoring/bundle';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_GANTTGRID               = '/oozie/dashboard/monitoring/ganttGrid';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_GANTTGRIDDETAIL         = '/oozie/dashboard/monitoring/ganttGridDetail';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WFCOUNT                 = '/oozie/dashboard/monitoring/wfCount';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_COORDCOUNT              = '/oozie/dashboard/monitoring/coordCount';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_BUNDLECOUNT             = '/oozie/dashboard/monitoring/bundleCount';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_TOTALCOUNT              = '/oozie/dashboard/monitoring/totalCount';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WORKFLOW_ACTION         = '/oozie/dashboard/monitoring/workflowAction';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_TIMEZONE                = '/oozie/dashboard/monitoring/getTimezone';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.GET_WORKFLOW_TIMELINE       = '/oozie/dashboard/monitoring/workflowTimeline';
CONSTANTS.OOZIE.DASHBOARD.MONITORING.WORKFLOW_STATUS_COUNT       = '/oozie/dashboard/monitoring/workflowStatusCount';
// workflow
CONSTANTS.OOZIE.WORKFLOW.SELECT                                  = '/oozie/workflow/select';
CONSTANTS.OOZIE.WORKFLOW.JOB.RESUME                              = '/oozie/workflow/job/resume';
CONSTANTS.OOZIE.WORKFLOW.JOB.SUSPEND                             = '/oozie/workflow/job/suspend';
CONSTANTS.OOZIE.WORKFLOW.JOB.KILL                                = '/oozie/workflow/job/kill';
CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SELECT                   = '/oozie/workflow/job/definition/select';
CONSTANTS.OOZIE.WORKFLOW.JOB.DEFINITION.SAVE                     = '/oozie/workflow/job/definition/save';
CONSTANTS.OOZIE.WORKFLOW.JOB.CONFIGURATION.SELECT                = '/oozie/workflow/job/configuration/select';
CONSTANTS.OOZIE.WORKFLOW.JOB.LOG.SELECT                          = '/oozie/workflow/job/log/select';
// workflow action
CONSTANTS.OOZIE.WORKFLOW.ACTION.SELECT                           = '/oozie/workflow/action/select';
CONSTANTS.OOZIE.WORKFLOW.ACTION.CHILD_URL                        = '/oozie/workflow/action/childUrl';
//Coordinator
CONSTANTS.OOZIE.COORDINATOR.RUN                                  = '/oozie/coordinator/run';

// coordinator
CONSTANTS.OOZIE.COORDINATOR.SELECT                                  = '/oozie/coordinator/select';
CONSTANTS.OOZIE.COORDINATOR.JOB.RESUME                              = '/oozie/coordinator/job/resume';
CONSTANTS.OOZIE.COORDINATOR.JOB.SUSPEND                             = '/oozie/coordinator/job/suspend';
CONSTANTS.OOZIE.COORDINATOR.JOB.KILL                                = '/oozie/coordinator/job/kill';
CONSTANTS.OOZIE.COORDINATOR.JOB.DEFINITION.SELECT                   = '/oozie/coordinator/job/definition/select';
CONSTANTS.OOZIE.COORDINATOR.JOB.CONFIGURATION.SELECT                = '/oozie/coordinator/job/configuration/select';
CONSTANTS.OOZIE.COORDINATOR.JOB.LOG.SELECT                          = '/oozie/coordinator/job/log/select';

// coordinator action
CONSTANTS.OOZIE.COORDINATOR.ACTION.SELECT                           = '/oozie/coordinator/action/select';
CONSTANTS.OOZIE.COORDINATOR.WORKFLOW.SELECT                         = '/oozie/coordinator/action/workflow';
CONSTANTS.OOZIE.COORDINATOR.JOB.LOG.COORDACTIONSELECT               = '/oozie/coordinator/job/log/coordActionSelect';

// bundle
CONSTANTS.OOZIE.BUNDLE.SELECT                                       = '/oozie/bundle/select';
CONSTANTS.OOZIE.BUNDLE.JOB.RESUME                                   = '/oozie/bundle/job/resume';
CONSTANTS.OOZIE.BUNDLE.JOB.SUSPEND                                  = '/oozie/bundle/job/suspend';
CONSTANTS.OOZIE.BUNDLE.JOB.KILL                                     = '/oozie/bundle/job/kill';
CONSTANTS.OOZIE.BUNDLE.ACTION.SELECT                                = '/oozie/bundle/action/select';
CONSTANTS.OOZIE.BUNDLE.JOB.DEFINITION.SELECT                        = '/oozie/bundle/job/definition/select';
CONSTANTS.OOZIE.BUNDLE.JOB.CONFIGURATION.SELECT                     = '/oozie/bundle/job/configuration/select';
CONSTANTS.OOZIE.BUNDLE.JOB.LOG.SELECT                               = '/oozie/bundle/job/log/select';
CONSTANTS.OOZIE.BUNDLE.ACTION.WORKFLOWACTION                        = '/oozie/bundle/action/workflowaction';

// system info
CONSTANTS.OOZIE.SYSTEMINFO.CONFIGURATION_SELECT                     = '/oozie/systeminfo/configuration';
CONSTANTS.OOZIE.SYSTEMINFO.JAVA_SYSTEM_PROPS_SELECT                 = '/oozie/systeminfo/javaSystemProp';
CONSTANTS.OOZIE.SYSTEMINFO.OS_ENV_SELECT                            = '/oozie/systeminfo/osEnv';
CONSTANTS.OOZIE.SYSTEMINFO.CONFIGURATION_DOWNLOAD                   = '/oozie/systeminfo/configuration/download';
CONSTANTS.OOZIE.SYSTEMINFO.PROPERTIES_DOWNLOAD                      = '/oozie/systeminfo/properties/download';
CONSTANTS.OOZIE.SYSTEMINFO.SHELLSCRIPT_DOWNLOAD                     = '/oozie/systeminfo/shellscript/download';
