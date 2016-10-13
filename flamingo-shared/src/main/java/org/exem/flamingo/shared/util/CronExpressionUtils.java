/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.exem.flamingo.shared.util;

import org.exem.flamingo.shared.core.exception.ServiceException;
import org.quartz.CronExpression;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Cron Expression Utility.
 *
 * @author Byoung Gon, Kim
 * @since 0.2
 */
public class CronExpressionUtils {

    /**
     * 지정한 Cron Expression이 유효한 Cron Expression인지 확인한다.
     *
     * @param cronExpression 확인할 Cron Expression
     * @return 유효한 Cron Expression인지 여부. 유효하다면 <tt>true</tt>
     */
    public static boolean isValidExpression(String cronExpression) {
        return CronExpression.isValidExpression(cronExpression);
    }

    /**
     * 지정한 Cron Expression이 실행할 다음 예정 시간 목록을 반환한다.
     *
     * @param expression Cron Expression
     * @param dateFormat 시간 표기법법
     * @param count      다음 예정 시간 목록의 개수
     * @return 다음 예정 시간 목록
     */
    public static List<String> getNextValidTimeAfter(String expression, String dateFormat, int count) {
        try {
            CronExpression cronExpression = new CronExpression(expression);
            Date current = cronExpression.getNextValidTimeAfter(new Date());
            List<String> dates = new ArrayList<String>();
            dates.add(DateUtils.parseDate(current, dateFormat));
            count--;
            for (int i = 0; i < count; i++) {
                current = cronExpression.getNextValidTimeAfter(current);
                dates.add(DateUtils.parseDate(current, dateFormat));
            }
            return dates;
        } catch (Exception ex) {
            throw new ServiceException("Cannot parse cron expression : " + expression, ex);
        }
    }

}
