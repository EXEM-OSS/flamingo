define("ace/mode/sql_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var HiveSqlHighlightRules = function() {

    var keywords = (
        "select|insert|update|delete|create|table|from|where|and|or|group|by|order|limit|offset|having|as|case|" +
        "when|else|end|type|left|right|join|on|outer|desc|asc|union|lines|terminated|row|delimited|fields|format|int|string|array|map|struct|partitioned|overwrite|partition|LOAD|DATA|LOCAL|INPATH|external|comment|stored|textfile|sequencefile|location|bigint|serde|RCFile|sort|CLUSTERED|KEYS|COLLECTION|ITEMS|SORTED|SKEWED|TRUNCATE|set"
    );

    var builtinConstants = (
        "true|false|null"
    );

    var builtinFunctions = (
        "count|min|max|avg|sum|variance|var_pop|var_samp|stddev_pop|stddev_samp|covar_pop|covar_samp|corr|percentile|percentile_approx|histogram_numeric|collect_set|collect_list|ntile|explode|inline|json_tuple|parse_url_tuple|posexplode|stack|round|floor|ceil|ceiling|rand|exp|ln|log10|log2|log|pow|sqrt|bin|hex|unhex|conv|abs|pmod|sin|asin|cos|acos|tan|atan|degrees|radians|positive|negative|sign|e|pi|size|map_keys|map_values|array_contains|sort_array|binary|cast|from_unixtime|unix_timestamp|to_date|year|month|day|dayofmonth|hour|minute|second|weekofyear|datediff|date_add|date_sub|from_utc_timestamp|to_utc_timestamp|current_date|current_timestamp|add_months|last_day|next_day|if|COALESCE|greatest|least|ascii|base64|concat|context_ngrams|concat_ws|decode|encode|find_in_set|format_number|get_json_object|in_file|instr|length|locate|lower|lpad|ltrim||ngrams|parse_url|printf|regexp_extract|regexp_replace|repeat|reverse|rpad|rtrim|sentences|space|split|str_to_map|substr|substring|translate|trim|unbase64|upper|initcap|java_method|reflect|hash|current_user"
    );

    var keywordMapper = this.createKeywordMapper({
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants
    }, "identifier", true);

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "--.*$"
        },  {
            token : "comment",
            start : "/\\*",
            end : "\\*/"
        }, {
            token : "string",           // " string
            regex : '".*?"'
        }, {
            token : "string",           // ' string
            regex : "'.*?'"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        }, {
            token : "text",
            regex : "\\s+"
        } ]
    };
    this.normalizeRules();
};

oop.inherits(HiveSqlHighlightRules, TextHighlightRules);

exports.HiveSqlHighlightRules = HiveSqlHighlightRules;
});

define("ace/mode/hive",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sql_highlight_rules","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HiveSqlHighlightRules = require("./sql_highlight_rules").HiveSqlHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = HiveSqlHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";

    this.$id = "ace/mode/hive";
}).call(Mode.prototype);

exports.Mode = Mode;

});
