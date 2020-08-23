"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var CQReply_1 = require("./CQReply");
exports.Macro_Private = function (ws, user_id, id, index) {
    console.log('[Debug]', 'Receive command: Macro, User_ID:', user_id, ': ID&INDEX:', id, index);
    macro(id, index, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Macro_Group = function (ws, group_id, id, index) {
    console.log('[Debug]', 'Receive command: Macro, Group_ID:', group_id, ': ID&INDEX:', id, index);
    macro(id, index, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function macro(id, index, callback) {
    if (!id || !index || index < 0 || index > 99) {
        callback('宏书查询：!macro <宏书ID> <第几条宏>' + '\n阿莉塞的宏书: xiv.acgme.cn');
        return;
    }
    id = parseInt(id);
    index = parseInt(index);
    request_1.default({
        url: 'https://xiv.acgme.cn/macro/yuer?id=' + id,
        method: 'get',
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.code === 200) {
                var macro_1 = JSON.parse(body.data.contents);
                var msg = body.data.bookname + ' 的第' + index + '条宏如下：';
                var macroD = macro_1[index];
                var null_line = 0;
                msg += ('\n标题：' + macroD.title);
                for (var i = 0; i < macroD.line.length; i++) {
                    if (macroD.line[i] !== null) {
                        msg += ('\n' + macroD.line[i]);
                    }
                    else {
                        null_line++;
                    }
                }
                msg += ('\n该宏书作者: ' + body.data.user_info.nickname + '@' + body.data.user_info.server.server_name);
                msg += '\nPowered by: 阿莉塞的宏书';
                if (null_line < macroD.line.length) {
                    callback(msg);
                }
                else {
                    callback(body.data.bookname + '中不存在第' + index + '条宏。');
                }
            }
            else {
                callback('阿莉塞的宏书那边返回了一个错误：' + body.msg + '。');
            }
        }
        else {
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
    });
}
