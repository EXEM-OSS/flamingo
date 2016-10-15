# Flamingo

## Introduction

Flamingo is a web application for managing Apache Oozie.
Flamingo drastically simplifies management of Apache Oozie through the following features.

## Feature

* Oozie Workflow Designer
* Oozie Workflow Management
* Oozie Coordinator Management
* Oozie Bundle Management
* Oozie Resource Monitoring
* HDFS Browser

## Build Status

[![Build Status](https://api.travis-ci.org/EXEM-OSS/flamingo.svg?branch=master)](https://travis-ci.org/EXEM-OSS/flamingo)

## License

[![Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-brightgreen.svg)](LICENSE)

## License Headers

### Java Header

```java
/*
 * Copyright (C) 2012-2016 the Flamingo Community.
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
```

### JavaScript Header

```javascript
/*
 * Copyright (C) 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
```


### XML Header

```xml
<!--
    Copyright (C) 2012-2016 the Flamingo Community.

    Licensed to the Apache Software Foundation (ASF) under one or more
    contributor license agreements.  See the NOTICE file distributed with
    this work for additional information regarding copyright ownership.
    The ASF licenses this file to You under the Apache License, Version 2.0
    (the "License"); you may not use this file except in compliance with
    the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
-->
```

## For Developer

### Spring Framework Profiles

* Development Mode : -Dspring.profiles.active=development
  Property Place Holder : /WEB-INF/config-dev.properties
* Production Mode : -Dspring.profiles.active=production
  Property Place Holder : /WEB-INF/config.properties

### Site Deployment

Open your Maven settings (~/.m2/settings.xml) and add the following server configuration:

```xml
<settings>
    <servers>
        <server>
            <id>github</id>
            <username>YOUR_GITHUB_USERNAME</username>
            <password>YOUR_PASSWORD</password>
        </server>
    </servers>
</settings>
```

Use following command for deploying site :

```
# mvn site:site
# mvn site:stage
# mvn site:deploy
```

## Community

* Facebook : https://www.facebook.com/groups/flamingo.workflow
* Slack : flamingo-dev-team.slack.com
* Issue Tracker : http://jira.exem-oss.org/projects/FL
* WIKI : http://confluence.exem-oss.org/display/FL/Flamingo

## References

* Original Source : https://github.com/EXEM-OSS/Flamingo2
