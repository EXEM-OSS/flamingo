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
var CONSTANTS                           = {};
CONSTANTS.CONTEXT_PATH                  = '';
CONSTANTS.FS                            = {};
CONSTANTS.DESIGNER                      = {};
CONSTANTS.DESIGNER.TREE                 = {};

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