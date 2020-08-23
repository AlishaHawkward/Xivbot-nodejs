"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var CQReply_1 = require("./CQReply");
exports.Nuannuan_Private = function (ws, user_id, cq_info) {
    console.log('[Debug]', 'Receive command: Search, User_ID:', user_id);
    nuannuan(cq_info, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Nuannuan_Group = function (ws, group_id, cq_info) {
    console.log('[Debug]', 'Receive command: Search, Group_ID:', group_id);
    nuannuan(cq_info, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function nuannuan(cq_info, callback) {
    var url = 'http://nuannuan.yorushika.co:5000/text';
    if (cq_info.version === 'pro')
        url = 'http://nuannuan.yorushika.co:5000/';
    request_1.default({
        url: url,
        method: 'get',
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.success) {
                callback(body.content);
            }
            else {
                callback('远程服务器出错，请稍后再试。');
            }
        }
        else {
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
    });
}
