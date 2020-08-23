"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = __importDefault(require("../models/bot"));
var CQReply_1 = require("../commands/CQReply");
var Command_help_1 = require("../commands/Command_help");
var Command_ping_1 = require("../commands/Command_ping");
var Command_search_1 = require("../commands/Command_search");
var Command_gate_1 = require("../commands/Command_gate");
var Command_trap_1 = require("../commands/Command_trap");
var Command_nuannuan_new_1 = require("../commands/Command_nuannuan_new");
var Command_treasure_1 = require("../commands/Command_treasure");
var Command_hso_1 = require("../commands/Command_hso");
var Command_weather_1 = require("../commands/Command_weather");
var Command_dps_1 = require("../commands/Command_dps");
var Command_fsx_1 = require("../commands/Command_fsx");
var Command_dice_1 = require("../commands/Command_dice");
var Command_macro_1 = require("../commands/Command_macro");
var Command_blue_1 = require("../commands/Command_blue");
var Command_luck_1 = require("../commands/Command_luck");
var Command_image_1 = require("../commands/Command_image");
var Command_nyaa_1 = require("../commands/Command_nyaa");
var Command_yuer_1 = require("../commands/Command_yuer");
var TTHandle_1 = require("./TTHandle");
var alias_1 = __importDefault(require("../configs/alias"));
var CQHandle = function (wss) {
    if (!this.wss)
        this.wss = wss;
    wss.on('connection', function (ws, req) {
        // 收到连接请求
        var remote_address = req.connection.remoteAddress;
        console.log('[Debug]', 'Connection established: ', remote_address);
        // 初始化BOT信息
        var cq_info = {
            user_id: null,
            nickname: null,
            version: null
        };
        ws.send(JSON.stringify({
            action: 'get_version_info'
        }));
        ws.send(JSON.stringify({
            action: 'get_login_info'
        }));
        ws.on('message', function (msg) {
            msg = JSON.parse(msg);
            if (msg.data) {
                if (msg.data.coolq_edition) {
                    cq_info.version = msg.data.coolq_edition;
                    if (cq_info.nickname && cq_info.version) {
                        console.log('[Debug]', 'CQInfo fetched: ', cq_info);
                        TTHandle_1.TTAdd(msg.data.user_id, ws);
                    }
                }
                else if (msg.data.nickname) {
                    cq_info.user_id = msg.data.user_id;
                    cq_info.nickname = msg.data.nickname;
                    if (cq_info.nickname && cq_info.version) {
                        console.log('[Debug]', 'CQInfo fetched: ', cq_info);
                        TTHandle_1.TTAdd(msg.data.user_id, ws);
                    }
                }
                else if (msg.data.message_id) {
                    CQReply_1.onMsg(ws, msg);
                }
            }
            else {
                // 判断BOT是否注册
                bot_1.default.findOne({ user_id: cq_info.user_id }, function (err, res) {
                    if (err)
                        console.log('[Error]', err);
                    else {
                        if (res) {
                            // BOT已注册，开始处理消息
                            HandleMsg(ws, msg, cq_info, res);
                            // 更新BOT在数据库内的昵称和版本
                            bot_1.default.updateOne({ user_id: cq_info.user_id }, {
                                nickname: cq_info.nickname,
                                version: cq_info.version
                            }, function (err, res) {
                                if (err) {
                                    console.log('[Error]', err);
                                }
                            });
                        }
                    }
                });
            }
        });
        ws.on('close', function () {
            console.log('[Debug]', 'Connection closed: ', remote_address);
            TTHandle_1.TTAdd(cq_info.user_id, null);
            // Bot.findOne({ user_id: cq_info.user_id }, (err, res) => {
            //   if (err)
            //     console.log('[Error]', err)
            //   else {
            //     if (res) {
            //       Bot.updateOne({ user_id: cq_info.user_id }, { online: false }, (err, res) => {
            //         if (err) {
            //           console.log('[Error]', err)
            //         } else if (res.online === true) {
            //           console.log('[Debug] Bot %s online mode has been set to: false', cq_info.user_id)
            //         }
            //       })
            //     }
            //   }
            // })
        });
    });
};
var HandleMsg = function (ws, msg, cq_info, res) {
    // 处理用户消息
    if (msg.post_type === 'meta_event') {
        if (msg.meta_event_type === 'heartbeat') {
            // 心跳包处理 // 设置bot在线状态
            bot_1.default.findOne({ user_id: cq_info.user_id }, function (err, res) {
                if (err)
                    console.log('[Error]', err);
                else {
                    if (res) {
                        var time = new Date().getTime();
                        bot_1.default.updateOne({ user_id: cq_info.user_id }, { online: time }, function (err, res) {
                            if (err) {
                                console.log('[Error]', err);
                            }
                            else {
                                // console.log('[Debug] Bot %s online time has been set to: %s', cq_info.user_id, time)
                            }
                        });
                    }
                }
            });
        }
    }
    else if (msg.post_type === 'message') {
        // 判断是否处理消息
        msg.message = msg.message.replace(/(^\s*)|(\s*$)/g, '');
        if (msg.message.substr(0, 1) === '!' || alias_1.default.symble.includes(msg.message.substr(0, 1))) {
            if (res.use_private && msg.message_type === 'private') {
                // 处理私聊消息
                console.log('[Debug] User %s triggered a command: %s', msg.user_id, msg.message);
                HandlePrivateMsg(ws, msg, cq_info);
            }
            else if (res.use_group && msg.message_type === 'group' && (res.allow_groups.includes(msg.group_id) || res.allow_groups.includes('*')) && !res.ban_groups.includes(msg.group_id)) {
                // 处理群消息
                console.log('[Debug] User %s in Group %s triggered a command: %s', msg.user_id, msg.group_id, msg.message);
                HandleGroupMsg(ws, msg, cq_info);
            }
        }
        else if (msg.message.substr(0, 1) === '/' || alias_1.default.symble_tata.includes(msg.message.substr(0, 1))) {
            // 处理獭獭消息
            bot_1.default.findOne({ user_id: cq_info.user_id }, function (err, res) {
                if (err)
                    console.log('[Error]', err);
                else {
                    if (res && res.use_tata === true && res.tata_url && res.tata_access) {
                        TTHandle_1.TTHandle(msg, res.tata_url, res.tata_access, cq_info.user_id);
                    }
                }
            });
        }
    }
};
var HandlePrivateMsg = function (ws, msg, cq_info) {
    var msg_wo_symble = msg.message.substr(1).replace(/\[CQ/g, ' [CQ').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    var msg_array_raw = msg_wo_symble.split(' ');
    var msg_array = [];
    for (var i = 0; i < msg_array_raw.length; i++) {
        if (msg_array_raw[i] !== '') {
            msg_array.push(msg_array_raw[i]);
        }
    }
    if (msg_array[0])
        msg_array[0] = msg_array[0].toLowerCase();
    if (msg_array[0] === 'help' || alias_1.default.help.includes(msg_array[0])) {
        Command_help_1.Help_Private(ws, msg.user_id);
    }
    else if (msg_array[0] === 'ping' || alias_1.default.ping.includes(msg_array[0])) {
        Command_ping_1.Ping_Private(ws, msg.user_id, new Date().getTime());
    }
    else if (msg_array[0] === 'search' || alias_1.default.search.includes(msg_array[0])) {
        Command_search_1.Search_Private(ws, msg.user_id, msg_array[1]);
    }
    else if (msg_array[0] === 'gate' || alias_1.default.gate.includes(msg_array[0])) {
        Command_gate_1.Gate_Private(ws, msg.user_id, cq_info, msg_array[1]);
    }
    else if (msg_array[0] === 'gate3') {
        Command_gate_1.Gate_Private(ws, msg.user_id, cq_info, '3');
    }
    else if (msg_array[0] === 'trap' || alias_1.default.trap.includes(msg_array[0])) {
        Command_trap_1.Trap_Private(ws, msg.user_id, cq_info, msg_array[1]);
    }
    else if (msg_array[0] === 'dice' || alias_1.default.dice.includes(msg_array[0])) {
        Command_dice_1.Dice_Private(ws, msg.user_id, msg_array[1]);
    }
    else if (msg_array[0] === 'nuannuan' || alias_1.default.nuannuan.includes(msg_array[0])) {
        Command_nuannuan_new_1.Nuannuan_Private(ws, msg.user_id, cq_info);
    }
    else if (msg_array[0] === 'treasure' || alias_1.default.treasure.includes(msg_array[0])) {
        Command_treasure_1.Treasure_Private(ws, msg.user_id, cq_info, msg_array[1]);
    }
    else if (msg_array[0] === 'hso' || alias_1.default.hso.includes(msg_array[0])) {
        Command_hso_1.Hso_Private(ws, msg.user_id, cq_info, msg_array[1], msg_array[2]);
    }
    else if (msg_array[0] === 'weather' || alias_1.default.weather.includes(msg_array[0])) {
        Command_weather_1.Weather_Private(ws, msg.user_id, msg_array[1]);
    }
    else if (msg_array[0] === 'dps' || alias_1.default.dps.includes(msg_array[0])) {
        Command_dps_1.Dps_Private(ws, msg.user_id, msg_array);
    }
    else if (msg_array[0] === 'fsx' || alias_1.default.fsx.includes(msg_array[0])) {
        Command_fsx_1.Fsx_Private(ws, msg.user_id, msg_array[1], msg_array[2]);
    }
    else if (alias_1.default.fsx_child.includes(msg_array[0])) {
        Command_fsx_1.Fsx_Private(ws, msg.user_id, msg_array[0], msg_array[1]);
    }
    else if (msg_array[0] === 'macro' || alias_1.default.macro.includes(msg_array[0])) {
        Command_macro_1.Macro_Private(ws, msg.user_id, msg_array[1], msg_array[2]);
    }
    else if (msg_array[0] === 'blue' || alias_1.default.blue.includes(msg_array[0])) {
        Command_blue_1.Blue_Private(ws, msg.user_id, msg_array[1]);
    }
    else if (msg_array[0] === 'luck' || alias_1.default.luck.includes(msg_array[0])) {
        Command_luck_1.Luck_Private(ws, msg.user_id, cq_info);
    }
    else if (msg_array[0] === 'image' || alias_1.default.image.includes(msg_array[0])) {
        Command_image_1.Image_Private(ws, msg.user_id, msg_array[1], msg_array[2], msg_array[3]);
    }
    else if (msg_array[0] === 'nyaa' || alias_1.default.nyaa.includes(msg_array[0])) {
        Command_nyaa_1.Nyaa_Private(ws, msg.user_id);
    }
    else if (msg_array[0] === 'yuer' || alias_1.default.yuer.includes(msg_array[0])) {
        Command_yuer_1.Yuer_Private(ws, msg.user_id);
    }
};
var HandleGroupMsg = function (ws, msg, cq_info) {
    var msg_wo_symble = msg.message.substr(1).replace(/\[CQ/g, ' [CQ').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    var msg_array_raw = msg_wo_symble.split(' ');
    var msg_array = [];
    for (var i = 0; i < msg_array_raw.length; i++) {
        if (msg_array_raw[i] !== '') {
            msg_array.push(msg_array_raw[i]);
        }
    }
    if (msg_array[0])
        msg_array[0] = msg_array[0].toLowerCase();
    if (msg_array[0] === 'help' || alias_1.default.help.includes(msg_array[0])) {
        Command_help_1.Help_Group(ws, msg.group_id);
    }
    else if (msg_array[0] === 'ping' || alias_1.default.ping.includes(msg_array[0])) {
        Command_ping_1.Ping_Group(ws, msg.group_id, new Date().getTime());
    }
    else if (msg_array[0] === 'search' || alias_1.default.search.includes(msg_array[0])) {
        Command_search_1.Search_Group(ws, msg.group_id, msg_array[1]);
    }
    else if (msg_array[0] === 'gate' || alias_1.default.gate.includes(msg_array[0])) {
        Command_gate_1.Gate_Group(ws, msg.group_id, cq_info, msg_array[1]);
    }
    else if (msg_array[0] === 'gate3') {
        Command_gate_1.Gate_Group(ws, msg.group_id, cq_info, '3');
    }
    else if (msg_array[0] === 'trap' || alias_1.default.trap.includes(msg_array[0])) {
        Command_trap_1.Trap_Group(ws, msg.group_id, cq_info, msg_array[1]);
    }
    else if (msg_array[0] === 'dice' || alias_1.default.dice.includes(msg_array[0])) {
        Command_dice_1.Dice_Group(ws, msg.group_id, msg.user_id, msg_array[1]);
    }
    else if (msg_array[0] === 'nuannuan' || alias_1.default.nuannuan.includes(msg_array[0])) {
        Command_nuannuan_new_1.Nuannuan_Group(ws, msg.group_id, cq_info);
    }
    else if (msg_array[0] === 'treasure' || alias_1.default.treasure.includes(msg_array[0])) {
        Command_treasure_1.Treasure_Group(ws, msg.group_id, cq_info, msg_array[1]);
    }
    else if (msg_array[0] === 'hso' || alias_1.default.hso.includes(msg_array[0])) {
        Command_hso_1.Hso_Group(ws, msg.group_id, cq_info, msg_array[1], msg_array[2]);
    }
    else if (msg_array[0] === 'weather' || alias_1.default.weather.includes(msg_array[0])) {
        Command_weather_1.Weather_Group(ws, msg.group_id, msg_array[1]);
    }
    else if (msg_array[0] === 'dps' || alias_1.default.dps.includes(msg_array[0])) {
        Command_dps_1.Dps_Group(ws, msg.group_id, msg_array);
    }
    else if (msg_array[0] === 'fsx' || alias_1.default.fsx.includes(msg_array[0])) {
        Command_fsx_1.Fsx_Group(ws, msg.group_id, msg_array[1], msg_array[2]);
    }
    else if (alias_1.default.fsx_child.includes(msg_array[0])) {
        Command_fsx_1.Fsx_Group(ws, msg.group_id, msg_array[0], msg_array[1]);
    }
    else if (msg_array[0] === 'macro' || alias_1.default.macro.includes(msg_array[0])) {
        Command_macro_1.Macro_Group(ws, msg.group_id, msg_array[1], msg_array[2]);
    }
    else if (msg_array[0] === 'blue' || alias_1.default.blue.includes(msg_array[0])) {
        Command_blue_1.Blue_Group(ws, msg.group_id, msg_array[1]);
    }
    else if (msg_array[0] === 'luck' || alias_1.default.luck.includes(msg_array[0])) {
        Command_luck_1.Luck_Group(ws, msg.group_id, msg.user_id, cq_info);
    }
    else if (msg_array[0] === 'image' || alias_1.default.image.includes(msg_array[0])) {
        Command_image_1.Image_Group(ws, msg.group_id, msg_array[1], msg_array[2], msg_array[3]);
    }
    else if (msg_array[0] === 'nyaa' || alias_1.default.nyaa.includes(msg_array[0])) {
        Command_nyaa_1.Nyaa_Group(ws, msg.group_id);
    }
    else if (msg_array[0] === 'yuer' || alias_1.default.yuer.includes(msg_array[0])) {
        Command_yuer_1.Yuer_Group(ws, msg.group_id);
    }
};
exports.default = CQHandle;
