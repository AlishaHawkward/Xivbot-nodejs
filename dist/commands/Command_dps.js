"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var CQReply_1 = require("./CQReply");
var boss_1 = __importDefault(require("./dps/boss"));
var job_1 = __importDefault(require("./dps/job"));
var screen_1 = __importDefault(require("./dps/screen"));
var boss_lst = boss_1.default();
var job_lst = job_1.default();
var screen_lst = screen_1.default();
exports.Dps_Private = function (ws, user_id, args) {
    console.log('[Debug]', 'Receive command: Dps, User_ID:', user_id, 'Args:', args);
    dps(args, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Dps_Group = function (ws, group_id, args) {
    console.log('[Debug]', 'Receive command: Dps, Group_ID:', group_id, 'Args:', args);
    dps(args, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function dps(args, callback) {
    if (args.length === 1) {
        callback('DPS统计：!dps [BOSS名称|昵称] [职业|昵称] [ADPS|RDPS] [国服|国际服] [第几天]， 顺序可打乱。例如：!dps o8s whm adps all 100');
        return;
    }
    var is_global_server = true;
    var sub_info = {
        cst_boss: null,
        cst_quest: null,
        cst_job: null,
        cst_savage: null,
        cst_patch: null,
        cst_server: null,
        cst_dps_type: 'adps',
        cst_cn_offset: 0,
        cst_day: 0,
        cst_boss_cn_name: null,
        cst_job_cn_name: null
    };
    // 判断服务器
    for (var i = 0; i < args.length; i++) {
        if (args[i].toLowerCase() === 'cn' || args[i] === '国服') {
            args.splice(i, 1);
            is_global_server = false;
            break;
        }
        else if (args[i].toLowerCase() === 'all' || args[i] === '国际服') {
            args.splice(i, 1);
            is_global_server = true;
            break;
        }
    }
    // 判断输出类型
    for (var i = 0; i < args.length; i++) {
        if (args[i].toLowerCase() === 'adps' || args[i].toLowerCase() === 'rdps') {
            sub_info.cst_dps_type = args[i];
            args.splice(i, 1);
            break;
        }
    }
    // 判断BOSS
    for (var i = 0; i < args.length; i++) {
        var temp_boss_name = args[i].replace(/_/g, ' ');
        for (var j = 0; j < boss_lst.length; j++) {
            var boss_name = [];
            var nickname = JSON.parse(boss_lst[j].fields.nickname);
            if (nickname.nickname)
                boss_name = nickname.nickname;
            boss_name.push(boss_lst[j].fields.name);
            boss_name.push(boss_lst[j].fields.cn_name);
            if (boss_name.includes(temp_boss_name)) {
                sub_info.cst_boss = boss_lst[j].pk;
                sub_info.cst_quest = boss_lst[j].fields.quest;
                sub_info.cst_savage = boss_lst[j].fields.savage;
                sub_info.cst_patch = boss_lst[j].fields.patch;
                if (is_global_server) {
                    sub_info.cst_server = boss_lst[j].fields.global_server;
                }
                else {
                    sub_info.cst_server = boss_lst[j].fields.cn_server;
                    sub_info.cst_cn_offset = boss_lst[j].fields.cn_offset;
                }
                sub_info.cst_boss_cn_name = boss_lst[j].fields.cn_name;
                args.splice(i, 1);
                break;
            }
        }
    }
    if (!sub_info.cst_boss) {
        callback('未能定位BOSS。');
        return;
    }
    // 判断职业
    for (var i = 0; i < args.length; i++) {
        var temp_job_name = args[i];
        for (var j = 0; j < screen_lst.length; j++) {
            var nickname = JSON.parse(screen_lst[j].fields.nickname);
            if (nickname.nickname) {
                if (nickname.nickname.includes(temp_job_name)) {
                    temp_job_name = screen_lst[j].fields.name;
                }
            }
        }
        for (var j = 0; j < job_lst.length; j++) {
            var job_name = [];
            var nickname = JSON.parse(job_lst[j].fields.nickname);
            if (nickname.nickname)
                job_name = nickname.nickname;
            job_name.push(job_lst[j].fields.name);
            job_name.push(job_lst[j].fields.cn_name);
            if (job_name.includes(temp_job_name)) {
                sub_info.cst_job = job_lst[j].fields.name;
                sub_info.cst_job_cn_name = job_lst[j].fields.cn_name;
                args.splice(i, 1);
                break;
            }
        }
    }
    if (!sub_info.cst_job) {
        callback('未能定位职业。');
        return;
    }
    // 判断第几天
    for (var i = 0; i < args.length; i++) {
        var day = parseInt(args[i]);
        if (!isNaN(day) && day > 0) {
            sub_info.cst_day = day;
        }
    }
    // 返回数据
    dps_req(sub_info, is_global_server, callback);
}
function dps_req(cst, global, callback) {
    var url = 'https://www.fflogs.com/zone/statistics/table/{quest_id}/dps/{boss_id}/{savage}/8/{server}/100/1000/7/{patch}/Global/{job}/All/0/normalized/single/0/-1/?keystone=15&dpstype={dps_type}';
    url = url.replace('{quest_id}', cst.cst_quest);
    url = url.replace('{boss_id}', cst.cst_boss);
    url = url.replace('{savage}', cst.cst_savage);
    url = url.replace('{server}', cst.cst_server);
    url = url.replace('{patch}', cst.cst_patch);
    url = url.replace('{job}', cst.cst_job);
    url = url.replace('{dps_type}', cst.cst_dps_type);
    // console.log(url)
    request_1.default({
        url: url,
        method: 'get',
        json: true,
        headers: {
            Referer: 'https://www.fflogs.com'
        }
    }, function (err, res, body) {
        console.log('[Debug]', 'FFlogs Fetched.');
        if (!err && res.statusCode == 200) {
            var percentage_list = [10, 25, 50, 75, 95, 99, 100];
            var dps_list = {};
            for (var i = 0; i < percentage_list.length; i++) {
                var reg = void 0;
                if (percentage_list[i] === 100) {
                    reg = /series.data.push\([+-]?(0|([1-9]\d*))(\.\d+)?\)/g;
                }
                else {
                    reg = eval('/series' + percentage_list[i] + '.data.push\\([+-]?(0|([1-9]\\d*))(\\.\\d+)?\\)/g');
                }
                dps_list[percentage_list[i]] = body.match(reg);
            }
            var tmp_day = 9999;
            var msg = cst.cst_boss_cn_name + ' ' + cst.cst_job_cn_name + ' ' + (global ? '国际服' : '国服') + '(' + cst.cst_dps_type + ')' + ' day#' + (cst.cst_day > 0 ? cst.cst_day : '-1') + ':';
            for (var i = 0; i < percentage_list.length; i++) {
                if (dps_list[percentage_list[i]]) {
                    var dps_lst = dps_list[percentage_list[i]];
                    var day_max = dps_lst.length - 1;
                    if (day_max < tmp_day) {
                        tmp_day = day_max;
                    }
                }
            }
            for (var i = 0; i < percentage_list.length; i++) {
                if (dps_list[percentage_list[i]]) {
                    var dps_lst = dps_list[percentage_list[i]];
                    var dps_1 = dps_lst[(cst.cst_day > 0 ? cst.cst_day : tmp_day)] || '获取失败';
                    dps_1 = dps_1.replace('series.data.push(', '').replace('series' + percentage_list[i] + '.data.push(', '').replace(')', '');
                    msg += ('\n' + percentage_list[i] + '%: ' + dps_1);
                }
            }
            // BUG
            msg += '\n【BUG】当前功能可能会出现问题，请等待完善！';
            callback(msg);
        }
        else {
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
    });
}
