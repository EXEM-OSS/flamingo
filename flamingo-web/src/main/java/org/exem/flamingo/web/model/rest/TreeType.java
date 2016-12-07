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
package org.exem.flamingo.web.model.rest;

import java.io.Serializable;

/**
 * Created by sanghyunbak on 2016. 12. 6..
 */
public enum TreeType implements Serializable {

  JOB("job"), WORKFLOW("workflow");

  public final String value;

  TreeType(String value) {
    this.value = value;
  }
}
