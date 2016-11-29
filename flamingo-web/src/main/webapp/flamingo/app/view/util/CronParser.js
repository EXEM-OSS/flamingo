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
Ext.define('Flamingo.view.util.CronParser', {
    singleton: true,
    
    /*
     Quartz Job Scheduler에서 제공하는 Cron Trigger는 cron expression을 충실하게 지원합니다. Cron Expression은 0 0 12 * * ? 와 같이 사용할 수 있으며 각 위치는 다음의 의미를 가집니다.

     필드명	필수여부	허용하는 값	허용하는 특수 문자
     초	예	0-59	, - * /
     분	예	0-59	, - * /
     시	예	0-23	, - * /
     일	예	1-31	, - * ? / L W
     월	예	1-12 또는 JAN-DEC	, - * /
     주	예	1-7 또는 SUN-SAT	, - * ? / L #
     년	아니오	빈값, 1970-2099	, - * /

     사용할 수 있는 특수문자는 다음의 의미를 가진다.

     특수기호	의미	기타	기본 지원
     *	모든 값을 선택	분 필드에 *을 사용하면 "매 분마다"의 의미를 가진다.	O
     ?	특정한 값 없음
     -	범위를 지정	시간 필드에 "10-12"를 입력하면 10,11,12를 의미	O
     ,	값 추가	"MON,WED,FRI"로 입력하면 월, 수 금을 의미	O
     /	증분값을 지정	"0/15"을 입력하면 0,15,30,45를 의미하며 "5/15"를 입력하면 5,20,35,50을 의미
     L	마지막	일에 "L"을 입력하면 매월 마지막날을 의미, 주에 입력하면 7 또는 SAT를 의미
     W	주말
     #
     */

    /**
     * Quartz 의 Cron Expression 을 파싱한다.
     *
     * @param {String} cronExpression
     * @returns {Object} 유효한 Cron Expression 이면 파싱된 Object 를 리턴하고 유효하지 않은 경우 false 를 리턴한다.
     */
    parse: function (cronExpression) {
        var secExp = '(0)',
            minExp = '(\\*|([0-5]?[0-9])|([0-5]?[0-9]\\-[0-5]?[0-9])|([0-5]?[0-9]\\/[1-9]+[0-9]*)|(([0-5]?[0-9],)([0-5]?[0-9])(,[0-5]?[0-9])*))',
            hourExp = '(\\*|([0-9]|1[0-9]|2[0-3])|(([0-9]|1[0-9]|2[0-3])\\-([0-9]|1[0-9]|2[0-3]))|(([0-9]|1[0-9]|2[0-3])\\/[1-9]+[0-9]*)|((([0-9]|1[0-9]|2[0-3]),)([0-9]|1[0-9]|2[0-3])(,([0-9]|1[0-9]|2[0-3]))*))',
            dayExp = '(\\*|\\?|L|LW|([1-9]|1[0-9]|2[0-9]|3[0-1])W?|(([1-9]|1[0-9]|2[0-9]|3[0-1])\\-([1-9]|1[0-9]|2[0-9]|3[0-1]))|(([1-9]|1[0-9]|2[0-9]|3[0-1])\\/[1-9]+[0-9]*)|((([1-9]|1[0-9]|2[0-9]|3[0-1]),)([1-9]|1[0-9]|2[0-9]|3[0-1])(,([1-9]|1[0-9]|2[0-9]|3[0-1]))*))',
            monthExp = '(\\*|([1-9]|1[0-2])|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|(([1-9]|1[0-2])\\-([1-9]|1[0-2]))|((JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\\-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))|(([1-9]|1[0-2])\\/[1-9]+[0-9]*)|((JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\\/[1-9]+[0-9]*)|((([1-9]|1[0-2]),)([1-9]|1[0-2])(,([1-9]|1[0-2]))*)|(((JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC),)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(,(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))*))',
            weekExp = '(\\*|\\?|L|([1-7]L?)|(SUN|MON|TUE|WED|THU|FRI|SAT)|([1-7]-[1-7])|((SUN|MON|TUE|WED|THU|FRI|SAT)-(SUN|MON|TUE|WED|THU|FRI|SAT))|([1-7]\\/[1-9]+[0-9]*)|((SUN|MON|TUE|WED|THU|FRI|SAT)\\/[1-9]+[0-9]*)|([1-7],[1-7](,[1-7])*)|((SUN|MON|TUE|WED|THU|FRI|SAT),(SUN|MON|TUE|WED|THU|FRI|SAT)(,(SUN|MON|TUE|WED|THU|FRI|SAT))*)|([1-7]#[1-5])|((SUN|MON|TUE|WED|THU|FRI|SAT)#[1-5]))',
            yearExp = '(\\*|(19[7-9][0-9]|20[0-9][0-9])|(19[7-9][0-9]|20[0-9][0-9])\\-(19[7-9][0-9]|20[0-9][0-9])|((19[7-9][0-9]|20[0-9][0-9])\\/[1-9]+[0-9]*)|((19[7-9][0-9]|20[0-9][0-9]),)(19[7-9][0-9]|20[0-9][0-9])(,(19[7-9][0-9]|20[0-9][0-9]))*)',
            cronRegExp = new RegExp('^' + secExp + ' ' + minExp + ' ' + hourExp + ' ' + dayExp + ' ' + monthExp + ' ' + weekExp + '( ' + yearExp + ')?$'),
            tokens = cronExpression.split(' '),

            MONTH_CONST = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            WEEK_CONST = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            TYPE_CONST = ['ALL', 'NO_SPECIFIC', 'RANGE', 'SPECIFIC', 'INCREMENT', 'NTH', 'LAST', 'LAST_WEEK', 'NEAREST_WEEK'],
            convertMonth = function (value) {
                if (Ext.isArray(value)) {
                    var values = [];
                    for (var i = 0; i < value.length; i++) {
                        if (/^([1-9]|1[0-2])$/.test(value[i])) {
                            values.push(MONTH_CONST[parseInt(value[i]) - 1]);
                        } else {
                            values.push(value[i]);
                        }
                    }
                    return values;
                } else {
                    if (/^([1-9]|1[0-2])$/.test(value)) {
                        return MONTH_CONST[parseInt(value) - 1];
                    } else {
                        return value;
                    }
                }
            },
            convertWeek = function (value) {
                if (Ext.isArray(value)) {
                    var values = [];
                    for (var i = 0; i < value.length; i++) {
                        if (/^[1-7]$/.test(value[i])) {
                            values.push(WEEK_CONST[parseInt(value[i]) - 1]);
                        } else if (/^(SUN|MON|TUE|WED|THU|FRI|SAT)$/.test(value[i])) {
                            values.push(value[i]);
                        } else {
                            values.push(value[i]);
                        }
                    }
                    return values;
                } else {
                    if (/^[1-7]$/.test(value)) {
                        return WEEK_CONST[parseInt(value) - 1];
                    } else if (/^(SUN|MON|TUE|WED|THU|FRI|SAT)$/.test(value)) {
                        return value;
                    } else {
                        return value;
                    }
                }
            };

        if (cronRegExp.test(cronExpression)) {
            var sec = tokens[0],
                min = tokens[1],
                hour = tokens[2],
                day = tokens[3],
                month = tokens[4],
                week = tokens[5],
                year = tokens[6],
                cronObj = {};

            if ((day == '?' && week == '?') || (day != '?' && week != '?')) {
                return false;
            }

            // second
            cronObj.sec = {
                type: 'SPECIFIC',
                value: [sec],
                orgValue: sec
            };

            // minute
            if (/^[0-5]?[0-9]$/.test(min)) {
                cronObj.min = {
                    type: 'SPECIFIC',
                    value: [min]
                };
            } else if (min == '*') {
                cronObj.min = {
                    type: 'ALL',
                    value: [min]
                };
            } else if (min.indexOf('-') > 0) {
                cronObj.min = {
                    type: 'RANGE',
                    value: min.split('-')
                };
            } else if (min.indexOf(',') > 0) {
                cronObj.min = {
                    type: 'SPECIFIC',
                    value: min.split(',')
                };
            } else if (min.indexOf('/') > 0) {
                cronObj.min = {
                    type: 'INCREMENT',
                    value: min.split('/')
                };
            }
            cronObj.min.orgValue = min;

            // hour
            if (/^([0-9]|1[0-9]|2[0-3])$/.test(hour)) {
                cronObj.hour = {
                    type: 'SPECIFIC',
                    value: [hour]
                };
            } else if (hour == '*') {
                cronObj.hour = {
                    type: 'ALL',
                    value: [hour]
                };
            } else if (hour.indexOf('-') > 0) {
                cronObj.hour = {
                    type: 'RANGE',
                    value: hour.split('-')
                };
            } else if (hour.indexOf(',') > 0) {
                cronObj.hour = {
                    type: 'SPECIFIC',
                    value: hour.split(',')
                };
            } else if (hour.indexOf('/') > 0) {
                cronObj.hour = {
                    type: 'INCREMENT',
                    value: hour.split('/')
                };
            }
            cronObj.hour.orgValue = hour;

            // day
            if (/^([1-9]|1[0-9]|2[0-9]|3[0-1])$/.test(day)) {
                cronObj.day = {
                    type: 'SPECIFIC',
                    value: [day]
                };
            } else if (/^([1-9]|1[0-9]|2[0-9]|3[0-1])W$/.test(day)) {
                cronObj.day = {
                    type: 'NEAREST_WEEK',
                    value: [day.replace('W', '')],
                    '@isNearest': true
                };
            } else if (day == '?') {
                cronObj.day = {
                    type: 'NO_SPECIFIC',
                    value: [day]
                };
            } else if (day == '*') {
                cronObj.day = {
                    type: 'ALL',
                    value: [day]
                };
            } else if (day.indexOf('-') > 0) {
                cronObj.day = {
                    type: 'RANGE',
                    value: day.split('-')
                };
            } else if (day.indexOf(',') > 0) {
                cronObj.day = {
                    type: 'SPECIFIC',
                    value: day.split(',')
                };
            } else if (day.indexOf('/') > 0) {
                cronObj.day = {
                    type: 'INCREMENT',
                    value: day.split('/')
                };
            } else if (day == 'L') {
                cronObj.day = {
                    type: 'LAST',
                    value: [day],
                    '@isLast': true
                };
            } else if (day == 'LW') {
                cronObj.day = {
                    type: 'LAST_WEEK',
                    value: [day.replace('W', '')],
                    '@isLast': true,
                    '@isNearest': true
                };
            }
            cronObj.day.orgValue = day;

            // month
            if (/^([1-9]|1[0-2])$/.test(month)) {
                cronObj.month = {
                    type: 'SPECIFIC',
                    value: [convertMonth(month)]
                };
            } else if (/^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/.test(month)) {
                cronObj.month = {
                    type: 'SPECIFIC',
                    value: [month]
                };
            } else if (month == '*') {
                cronObj.month = {
                    type: 'ALL',
                    value: [month]
                };
            } else if (month.indexOf('-') > 0) {
                cronObj.month = {
                    type: 'RANGE',
                    value: convertMonth(month.split('-'))
                };
            } else if (month.indexOf(',') > 0) {
                cronObj.month = {
                    type: 'SPECIFIC',
                    value: convertMonth(month.split(','))
                };
            } else if (month.indexOf('/') > 0) {
                cronObj.month = {
                    type: 'INCREMENT',
                    value: [convertMonth(month.split('/')[0]), month.split('/')[1]]
                };
            }
            cronObj.month.orgValue = month;

            // week
            if (/^[1-7]$/.test(week)) {
                cronObj.week = {
                    type: 'SPECIFIC',
                    value: [week]
                };
            } else if (/^[1-7]L$/.test(week)) {
                cronObj.week = {
                    type: 'LAST_WEEK',
                    value: [convertWeek(week.replace('L', ''))],
                    '@isLast': true
                };
            } else if (/^(SUN|MON|TUE|WED|THU|FRI|SAT)$/.test(week)) {
                cronObj.week = {
                    type: 'SPECIFIC',
                    value: [week]
                };
            } else if (week == '?') {
                cronObj.week = {
                    type: 'NO_SPECIFIC',
                    value: [week]
                };
            } else if (week == '*') {
                cronObj.week = {
                    type: 'ALL',
                    value: [week]
                };
            } else if (week.indexOf('-') > 0) {
                cronObj.week = {
                    type: 'RANGE',
                    value: convertWeek(week.split('-'))
                };
            } else if (week.indexOf(',') > 0) {
                cronObj.week = {
                    type: 'SPECIFIC',
                    value: convertWeek(week.split(','))
                };
            } else if (week.indexOf('/') > 0) {
                cronObj.week = {
                    type: 'INCREMENT',
                    value: [convertWeek(week.split('/')[0]), week.split('/')[1]]
                };
            } else if (week.indexOf('#') > 0) {
                cronObj.week = {
                    type: 'NTH',
                    value: [convertWeek(week.split('#')[0]), week.split('#')[1]]
                };
            } else if (week == 'L') {
                cronObj.week = {
                    type: 'LAST',
                    value: ['SAT']
                };
            }
            cronObj.week.orgValue = week;

            // year
            if (year !== undefined) {
                if (/^(19[7-9][0-9]|20[0-9][0-9])$/.test(year)) {
                    cronObj.year = {
                        type: 'SPECIFIC',
                        value: [year]
                    };
                } else if (year == '*') {
                    cronObj.year = {
                        type: 'ALL',
                        value: [year]
                    };
                } else if (year.indexOf('-') > 0) {
                    cronObj.year = {
                        type: 'RANGE',
                        value: year.split('-')
                    };
                    if (cronObj.year.value[0] > cronObj.year.value[1]) {
                        return false;
                    }
                } else if (year.indexOf(',') > 0) {
                    cronObj.year = {
                        type: 'SPECIFIC',
                        value: year.split(',')
                    };
                } else if (year.indexOf('/') > 0) {
                    cronObj.year = {
                        type: 'INCREMENT',
                        value: year.split('/')
                    };
                }
                cronObj.year.orgValue = year;
            }

            return cronObj;
        } else {
            return false;
        }
    }
});