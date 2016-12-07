var format = {};

var TREEMAP_COLORS = [
    '#E50002',
    '#E75A05',
    '#EAB60A',
    '#C8EC0F',
    '#76FE15',
    '#26F21A',
    '#20F467',
    '#26F7BE',
    '#2BE0F9',
    '#3194FC'
];

function generateChartID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return 'c' + uuid;
};

function convertValue (value, record, hour) {
    value = '';
    var succeededData = record.getData()['getS'+hour];
    var failedData = record.getData()['getF'+hour];
    var killedData = record.getData()['getK'+hour];

    if (succeededData != undefined && failedData == undefined && killedData == undefined) {
        value = succeededData.count + ' / ' + 0;
    } else if (succeededData == undefined && failedData != undefined && killedData == undefined) {
        value = 0 + ' / ' + failedData.count;
    } else if (succeededData == undefined && failedData == undefined && killedData != undefined) {
        value = 0 + ' / ' + killedData.count;
    } else if (succeededData != undefined && failedData != undefined && killedData == undefined) {
        value = succeededData.count + ' / ' + failedData.count;
    } else if (succeededData != undefined && failedData == undefined && killedData != undefined) {
        value = succeededData.count + ' / ' + killedData.count;
    } else if (succeededData == undefined && failedData != undefined && killedData != undefined) {
        value = 0 + ' / ' + (failedData.count + killedData.count);
    } else if (succeededData != undefined && failedData != undefined && killedData != undefined) {
        value = succeededData.count + ' / ' + (failedData.count + killedData.count);
    }

    return value;
};

var convertTime = function (value) {
    var millis = value % 1000;
    value = parseInt(value / 1000);
    var seconds = value % 60;
    value = parseInt(value / 60);
    var minutes = value % 60;
    value = parseInt(value / 60);
    var hours = value % 24;
    var out = "";
    if (hours && hours > 0) out += hours + "" + ((hours == 1) ? "h" : "h") + " ";
    if (minutes && minutes > 0) out += minutes + "" + ((minutes == 1) ? "m" : "m") + " ";
    if (seconds && seconds > 0) out += seconds + "" + ((seconds == 1) ? "s" : "s") + " ";
    return out.trim();
};

var convertDateTime = function (value) {
    var date = new Date(value);
    return Ext.Date.format(date, 'Y-m-d H:i:s');
};

var convertComma = function (value) {
    return Ext.util.Format.number(value, '0,000')
};

function bundle(message) {

    this.message = message;

    this.msg = function (key, args) {
        if (arguments.length > 1) {
            var value = message[key];
            return value.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        } else {
            return message[key];
        }
    };
}

function setTableLayoutFixed(view) {
    var i;
    var columns = view.layout.columns;
    var width = 100 / columns;

    for (i=0; i<columns; i++) {
        $('#'+view.id + ' .x-table-layout tbody:first').before('<col width="'+width+'%">');
    }
}

function records2Json(records) {
    var result = [];

    for (var j = 0; j < records.length; j++) {
        var models = {};
        var items = records[j].fields.items;
        for (var i = 0; i < items.length; i++) {
            var name = items[i].name;
            models[name] = records[j].get(name);
        }
        result.push(models);
    }

    return result;
}

function getTimeZone() {
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    return Ext.state.Manager.get("TimezoneId","GMT");
};

var byteConverter = function(value) {

    var byteLimit = 1024,
        kbLimit = 1048576,
        mbLimit = 1073741824;
    gbLimit = 1099511627776;

    var out;
    if (value < byteLimit) {
        if (value < 1) {
            out = '0 Byte';
        }else if (value === 1) {
            out = '1 Byte';
        } else {
            out = value + ' Bytes';
        }
    } else if (value < kbLimit) {
        out = (Math.round(((value*10) / byteLimit))/10) + ' KB';
    } else if (value < mbLimit) {
        out = (Math.round(((value*10) / kbLimit))/10) + ' MB';
    } else if (Number(value) / 1024 < mbLimit) {
        out = (Math.round(((value*10) / mbLimit))/10) + ' GB';
    } else {
        out = (Math.round(((value*10) / gbLimit))/10) + ' TB';
    }
    return out;
};

var megaByteConverter = function(value) {
    var mbLimit = 1024,
        gbLimit = 1048576;

    var out;
    if (value < mbLimit) {
        if (value < 1) {
            out = '0 MB';
        }else if (value === 1) {
            out = '1 MB';
        } else {
            out = value.toFixed(1) + ' MB';
        }
    } else if (Number(value) / 1024 < mbLimit) {
        out = (Math.round(((value*10) / mbLimit))/10) + ' GB';
    }

    return out;
};

var siPrefixConverter = function(value) {
    var kiloLimit = 1000;
    var megaLimit = kiloLimit * 1000;
    var gigaLimit = megaLimit * 1000;
    var num;

    if (value < kiloLimit) {
        return value;
    }
    else if (value < megaLimit) {
        num = value / kiloLimit;
        return num.toFixed(1) + 'K';
    }
    else if (value < gigaLimit) {
        num = value / megaLimit;
        return num.toFixed(1) + 'M';
    }
    else {
        num = value / gigaLimit;
        return num.toFixed(1) + 'G';
    }

}

var statusConverter = function (value) {
    var color, cls;
    cls = 'fa fa-circle';
    switch (value) {
        case 'SUCCEEDED':
        case 'OK':
            color = '#0080D7';
            break;
        case 'FAILED':
        case 'ERROR':
        case 'DONEWITHERROR':
            color = '#D84C71';
            break;
        case 'KILLED':
            color = '#878787';
            break;
        case 'RUNNING':
            color = '#9CC101';
            break;
        case 'SUSPENDED':
        case 'WAITING':
            color = '#FF9D44';
            break;
        case 'PREP':
            color = '#FFC501'
            break;
        default:
            color = '#878787';
            cls = 'fa fa-circle-o'
            break;
    }
    return '<i style="color: ' + color + ';" class="' + cls + '" aria-hidden="true"></i><span>&nbsp;&nbsp;' + value + '</span>';
};