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
package org.exem.flamingo.web.filesystem.s3.rest;

public class S3Grant {
    private String name;
    private boolean read = false;
    private boolean write = false;
    private boolean readAcp = false;
    private boolean writeAcp = false;

    public S3Grant() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isWrite() {
        return write;
    }

    public void setWrite(boolean write) {
        this.write = write;
    }

    public boolean isReadAcp() {
        return readAcp;
    }

    public void setReadAcp(boolean readAcp) {
        this.readAcp = readAcp;
    }

    public boolean isWriteAcp() {
        return writeAcp;
    }

    public void setWriteAcp(boolean writeAcp) {
        this.writeAcp = writeAcp;
    }

    public void setPermission(String permission) {
        switch (permission) {
            case "FULL_CONTROL":
            case "FullControl":
                this.read = this.write = this.readAcp = this.writeAcp = true;
                break;
            case "READ":
            case "Read":
                this.read = true;
                break;
            case "WRITE":
            case "Write":
                this.write = true;
                break;
            case "READ_ACP":
            case "ReadAcp":
                this.readAcp = true;
                break;
            case "WRITE_ACP":
            case "WriteAcp":
                this.writeAcp = true;
                break;
            default:
                break;
        }
    }
}