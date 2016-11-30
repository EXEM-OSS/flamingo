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
package org.exem.flamingo.agent.nn;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hdfs.server.namenode.Namenode2Agent;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AspectJ를 사용하여 NameNode의 초기화 메소드가 실행할 때 Namenode Agent를 시작하는 Aspect.
 *
 * @author Kyeong Sik, Kim
 * @since 0.1
 * @see org.apache.hadoop.hdfs.server.namenode.NameNode#initialize(Configuration)
 */
@Aspect
public class NameNodeAspectJ {

    private static final Logger LOG = LoggerFactory.getLogger(NameNodeAspectJ.class);

    /**
     * {@link org.apache.hadoop.hdfs.server.namenode.NameNode#initialize(Configuration)}에 대한 pointcut
     */
    @Pointcut("execution(* org.apache.hadoop.hdfs.server.namenode.NameNode.initialize(..))")
    public void aspectTargetMethod() {
    }

    /*
     * {@link NamenodeAspect#aspectTargetMethod()} 의 target이 완료 되었을때 method 실행
     * @param joinPoint jointpoint
     */
    @After("org.exem.flamingo.agent.nn.NameNodeAspectJ.aspectTargetMethod()")
    public void afterInit(JoinPoint joinPoint) {
        Namenode2Agent.start(joinPoint.getThis(), joinPoint.getArgs());
    }
}
