/*
 * Copyright (C) 2011 Flamingo Project (https://github.com/OpenCloudEngine/flamingo2).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.exem.flamingo.shared.core.rest;

import com.fasterxml.jackson.annotation.JsonInclude;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import java.io.Serializable;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
        "id",
        "code",
        "message",
        "cause",
        "exception"
})
@XmlRootElement(name = "error")
public class Error implements Serializable {

    /**
     * Serialization UID
     */
    private static final long serialVersionUID = 1;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    String id;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    String code;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    String message;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    String cause;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    String exception;

    public Error(String code) {
        this.code = code;
    }

    public Error() {
    }

    public Error(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public Error(String code, String message, String cause) {
        this.code = code;
        this.message = message;
        this.cause = cause;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public String getException() {
        return exception;
    }

    public void setException(String exception) {
        this.exception = exception;
    }
}
