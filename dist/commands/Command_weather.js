"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var W = __importStar(require("./weather/weather"));
var zh_CN_1 = __importDefault(require("./weather/zh_CN"));
var moment_1 = __importDefault(require("moment"));
var CQReply_1 = require("./CQReply");
exports.Weather_Private = function (ws, user_id, location) {
    console.log('[Debug]', 'Receive command: Weather, User_ID:', user_id, ': Location:', location);
    weather(location, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Weather_Group = function (ws, group_id, location) {
    console.log('[Debug]', 'Receive command: Weather, Group_ID:', group_id, ': Location:', location);
    weather(location, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function weather(location, callback) {
    if (!location) {
        callback('查询天气：!weather <地图名|中文>');
    }
    else {
        // W.init()
        var found = false;
        var lang_arr = Object.keys(zh_CN_1.default);
        for (var i = 0; i < lang_arr.length; i++) {
            if (location === zh_CN_1.default[lang_arr[i]]) {
                found = true;
                var matches = W.find({
                    zone: lang_arr[i],
                    desiredWeathers: [],
                    previousWeathers: [],
                    beginHour: 0,
                    endHour: 23
                });
                matches.map(function (x) { return x(); }).map(function (x, i) {
                    var reply = location + '地图天气如下：';
                    for (var i_1 = 1; i_1 < 9; i_1++) {
                        var EUnix = getEorzeaUnix(x.begin.getTime()) + i_1 * 3600000 * 8;
                        reply += ('\n' + zh_CN_1.default[x.weathers[i_1]] + ' -> ' + zh_CN_1.default[x.weathers[i_1 + 1]] + '   ET ' + getET(EUnix));
                        if (Math.floor((getUniversalUnix(EUnix) - new Date().getTime()) / 60 / 1000) >= 0) {
                            reply += (' 距离约：' + Math.floor((getUniversalUnix(EUnix) - new Date().getTime()) / 60 / 1000) + '分钟');
                        }
                    }
                    reply += ('\n----------------');
                    reply += ('\n当前天气： ' + zh_CN_1.default[x.weathers[1]]);
                    reply += ('\n当前时间： ET ' + getET(getEorzeaUnix(new Date().getTime())));
                    callback(reply);
                });
            }
        }
        if (!found) {
            callback('没有找到指定地图的天气信息。');
        }
    }
}
var getEorzeaUnix = function (universalTime) {
    var eorzeaMultipler = (3600 / 175);
    return universalTime * eorzeaMultipler;
};
var getUniversalUnix = function (eorzeaTime) {
    var eorzeaMultipler = (3600 / 175);
    return eorzeaTime / eorzeaMultipler;
};
var getEorzeaUTC = function (eorzeaUnix) {
    var result = moment_1.default.utc(eorzeaUnix);
    return result.format('HH:mm');
};
var getCalender = function (fmt, eorzeaUnix) {
    var days = Math.floor(eorzeaUnix / 1000 / 86400);
    var ret;
    var opt = {
        'Y+': Math.floor(days / 32 / 12).toString(),
        'm+': Math.floor(days / 32 % 12).toString(),
        'd+': Math.floor(days % 32 + 1).toString()
    };
    for (var k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')));
        }
    }
    return fmt;
};
var getET = function (x) {
    return getCalender('mm-dd', x) + ' ' + getEorzeaUTC(x);
};
