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
Ext.define('Flamingo.view.util.String', {
    singleton: true,
    fileSize: function (size) {
        var byteLimit = 1024,
            kbLimit = 1048576,
            mbLimit = 1073741824,
            gbLimit = 1073741824 * 1024;

        var out;
        if (size < byteLimit) {
            if (size === 1) {
                out = '1 byte';
            } else {
                out = size + ' bytes';
            }
        } else if (size < kbLimit) {
            out = (Math.round(((size * 10) / byteLimit)) / 10) + ' KB';
        } else if (size < mbLimit) {
            out = (Math.round(((size * 10) / kbLimit)) / 10) + ' MB';
        } else if (size < gbLimit) {
            out = (Math.round(((size * 10) / mbLimit)) / 10) + ' GB';
        } else {
            out = (Math.round(((size * 10) / gbLimit)) / 10) + ' TB';
        }
        return out;
    },

    /**
     * 왼쪽에 문자을 채운다. 최종적으로 구성할 문자열은 지정한 길이가 된다.
     * 입력값의 문자열의 길이가 지정한 길이보다 작다면 문자를 왼쪽에 추가한다.
     */
    leftPad: function (value, length, character) {
        value = '' + value; // Stringfy
        while (value.length < length) {
            value = character + value;
        }
        return value;
    },

    /**
     * 3자리 마다 comma를 추가한다.
     */
    toCommaNumber: function (num) {
        var len, point, str;

        num = num + "";
        point = num.length % 3
        len = num.length;

        str = num.substring(0, point);
        while (point < len) {
            if (str != "") str += ",";
            str += num.substring(point, point + 3);
            point += 3;
        }
        return str;
    },

    /**
     * 오른쪽에 문자을 채운다. 최종적으로 구성할 문자열은 지정한 길이가 된다.
     * 입력값의 문자열의 길이가 지정한 길이보다 작다면 문자를 오른쪽에 추가한다.
     */
    rightPad: function (value, length, character) {
        value = '' + value; // Stringfy
        while (value.length < length) {
            value = value + character;
        }
        return value;
    },

    /**
     * 지정한 문자열을 trim 처리한다.
     */
    trim: function (string) {
        if (string == null)
            return null;

        var startingIndex = 0;
        var endingIndex = string.length - 1;

        var singleWhitespaceRegex = /\s/;
        while (string.substring(startingIndex, startingIndex + 1).match(singleWhitespaceRegex))
            startingIndex++;

        while (string.substring(endingIndex, endingIndex + 1).match(singleWhitespaceRegex))
            endingIndex--;

        if (endingIndex < startingIndex)
            return '';

        return string.substring(startingIndex, endingIndex + 1);
    },

    stripTags: function (str) {
        if (str == null) return '';
        return String(str).replace(/<\/?[^>]+>/g, '');
    },

    surround: function (str, wrapper) {
        return [wrapper, str, wrapper].join('');
    },

    quote: function (str) {
        return this.surround(str, '"');
    },

    strRepeat: function (str, qty) {
        if (qty < 1) return '';
        var result = '';
        while (qty > 0) {
            if (qty & 1) result += str;
            qty >>= 1, str += str;
        }
        return result;
    },

    /**
     * 문자열이 비어있는지 확인한다.
     */
    isBlank: function (string) {
        if (string == undefined || string == null) {
            return true;
        }
        return this.trim(string) == '';
    },

    /**
     * 문자열에서 나타난 문구를 모두 일괄 변환한다.
     */
    replaceAll: function (string, from, to) {
        var value = "";

        if (from == null) {
            return string;
        }

        if (string != "" && from != to) {
            value = string;

            while (value.indexOf(from) > -1) {
                value = value.replace(from, to);
            }
        }
        return value;
    },

    /**
     * HTML 태그를 escape 처리한다.
     */
    escapeHTML: function (self) {
        return self
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, "&apos;");
    },

    /**
     * Escape 처리한 HTML 태그를 복원한다.
     */
    unescapeHTML: function (self) {
        return self
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
    },

    /**
     * 문자열이 지정한 문자열로 시작하는지 확인한다.
     */
    startsWith: function (self, start) {
        return self.length >= start.length && self.substring(0, start.length) === start;
    },

    /**
     * 문자열이 지정한 문자열로 끝나는지 확인한다.
     */
    endsWith: function (self, ends) {
        return self.length >= ends.length && self.substring(self.length - ends.length) === ends;
    },

    /**
     * 문자열 내에 지정한 문자열이 포함되는지 여부를 확인한다.
     */
    occurrence: function (self, substr) {
        return self.indexOf(substr) !== -1;
    },

    /**
     *
     */
    chop: function (self, step) {
        var result = [], len = self.length, i;

        step || (step = len);

        for (i = 0; i < len; i += step) {
            result.push(self.slice(i, i + step));
        }

        return result;
    },

    /**
     * @see http://jsfromhell.com/string/wordwrap
     */
    wrap: function (msg, m, b, c) {
        var i, j, l, s, r;
        if (m < 1)
            return msg;
        for (i = -1, l = (r = msg.split("\n")).length; ++i < l; r[i] += s)
            for (s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
                j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
                || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
        return r.join("\n");
    },

    /**
     *
     */
    capitalize: function (self) {
        return self.charAt(0).toUpperCase() + self.substring(1).toLowerCase();
    },

    /**
     *
     */
    chars: function (self) {
        return self.split('');
    },

    /**
     *
     */
    count: function (self, substr) {
        var result = 0, len = self.length, step = substr.length, index = 0, i;

        for (i = 0; i < len; i += index + step) {
            index = self.indexOf(substr, i);
            if (index < 0) {
                return result;
            }
            result += 1;
        }

        return result;
    }
});

var wrap = Flamingo.view.util.String.wrap;
var trim = Flamingo.view.util.String.trim;
var escapeHTML = Flamingo.view.util.String.escapeHTML;
var isBlank = Flamingo.view.util.String.isBlank;
var replaceAll = Flamingo.view.util.String.replaceAll;
var startsWith = Flamingo.view.util.String.startsWith;
var endsWith = Flamingo.view.util.String.endsWith;
var occurrence = Flamingo.view.util.String.occurrence;
var toCommaNumber = Flamingo.view.util.String.toCommaNumber;
var fileSize = Flamingo.view.util.String.fileSize;