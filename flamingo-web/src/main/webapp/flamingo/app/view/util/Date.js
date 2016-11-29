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
Ext.define('Flamingo.view.util.Date', {
    singleton: true,

    daysInWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysInWeekKor: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],

    shortMonthsInYear: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    shortMonthsInYearKor: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],

    longMonthsInYear: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    longMonthsInYearKor: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    
    /**
     * 날짜를 포맷팅한다.
     */
    format: function (time, type) {
        if (typeof time === 'string' && App.Util.String.isBlank(time)) {
            return '';
        }
        var date = new Date();
        date.setTime(time);
        return type.replace(/(yyyy|yy|MM|dd|E|HH|mm|ss|a\/p)/gi, function (arg) {
            switch (arg) {
                case 'yyyy':
                    return date.getFullYear();
                case 'MM':
                    return util.String.leftPad(date.getMonth() + 1, 2, '0');
                case 'dd':
                    return util.String.leftPad(date.getDate(), 2, '0');
                case 'HH':
                    return util.String.leftPad(date.getHours(), 2, '0');
                case 'mm':
                    return util.String.leftPad(date.getMinutes(), 2, '0');
                case 'ss':
                    return util.String.leftPad(date.getSeconds(), 2, '0');
                default:
                    return arg;
            }
        });
    },

    /**
     * ExtJS 날짜를 포맷팅한다.
     *
     * @param time 문자열 날짜(예; 2012-01-01)
     * @param pattern ExtJS 날짜 패턴(예; Y-m-d)
     */
    formatExtJS: function (time, pattern) {
        return Ext.Date.format(time, pattern)
    },

    dateFormat: function (time) {
        var date = new Date(Number(time));
        return Ext.Date.format(date, 'Y-m-d H:i:s')
    },

    toHumanReadableTime: function (time) {
        // Minutes and seconds
        var mins = ~~(time / 60);
        var secs = time % 60;

        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0)
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }    
});

var dateFormat = Flamingo.view.util.Date.format;
var dateFormat2 = Flamingo.view.util.Date.dateFormat;
var toHumanReadableTime = Flamingo.view.util.Date.toHumanReadableTime;