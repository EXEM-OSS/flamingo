/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.exem.flamingo.shared.util;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class TimeSeriesUtils {

    public static void sum(Map<String, AtomicInteger> timeSeries, Date mid) {
        String key = DateUtils.parseDate(mid, "yyyy-MM-dd");
        timeSeries.get(key).incrementAndGet();
    }

    public static Map<String, AtomicInteger> getTimeSeries(Date start, Date end) {
        long diff = DateUtils.getDiffDays(end, start);
        LinkedHashMap<String, AtomicInteger> timeseries = new LinkedHashMap();
        for (int i = 0; i <= diff; i++) {
            Date date = DateUtils.addDays(start, i);
            timeseries.put(DateUtils.parseDate(date, "yyyy-MM-dd"), new AtomicInteger(0));
        }
        return timeseries;
    }
}