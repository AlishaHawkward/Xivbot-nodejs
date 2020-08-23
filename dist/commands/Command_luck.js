"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var luck_1 = __importDefault(require("../models/luck"));
var CQReply_1 = require("./CQReply");
var luck_2 = __importDefault(require("./luck/luck"));
var luck_lst = luck_2.default();
exports.Luck_Private = function (ws, user_id, cq_info) {
    console.log('[Debug]', 'Receive command: Luck, User_ID:', user_id);
    luck(user_id, cq_info, function (res) {
        CQReply_1.send_group_msg(ws, user_id, res);
    });
};
exports.Luck_Group = function (ws, group_id, user_id, cq_info) {
    console.log('[Debug]', 'Receive command: Luck, Group_ID:', group_id);
    luck(user_id, cq_info, function (res) {
        CQReply_1.send_group_msg(ws, group_id, '[CQ:at, qq=' + user_id + ']\n' + res);
    });
};
function luck(user_id, cq_info, callback) {
    luck_1.default.findOne({ user_id: user_id }, function (err, res) {
        if (err) {
            console.log('[Error]', err);
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
        else {
            if (res) {
                if (res.time > Math.floor(new Date().getTime() / 86400000 + 1) * 86400000) {
                    exec_luck(user_id, cq_info, callback);
                }
                else {
                    callback('您已经抽过签了哦，请明早8点以后再次抽签！');
                }
            }
            else {
                exec_luck(user_id, cq_info, callback);
            }
        }
    });
}
function exec_luck(user_id, cq_info, callback) {
    var num = Math.floor(Math.random() * luck_lst.length);
    luck_1.default.findOne({ user_id: user_id }, function (err, res) {
        if (err) {
            console.log('[Error]', err);
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
        else {
            if (res) {
                luck_1.default.updateOne({ user_id: user_id }, {
                    num: num,
                    time: new Date().getTime()
                }, function (err) {
                    if (err) {
                        console.log('[Error]', err);
                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                    }
                    else {
                        if (cq_info.version === 'pro') {
                            callback('[CQ:image, file=' + luck_lst[num].fields.img_url + ']');
                        }
                        else {
                            callback(luck_lst[num].fields.text);
                        }
                    }
                });
            }
            else {
                luck_1.default.create({
                    user_id: user_id, num: num,
                    time: new Date().getTime()
                }).then(function () {
                    if (cq_info.version === 'pro') {
                        callback('[CQ:image, file=' + luck_lst[num].fields.img_url + ']');
                    }
                    else {
                        callback(luck_lst[num].fields.text);
                    }
                }).catch(function (err) {
                    console.log('[Error]', err);
                    callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                });
            }
        }
    });
}
