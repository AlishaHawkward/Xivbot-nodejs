"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
exports.Gate_Private = function (ws, user_id, cq_info, input_num) {
    console.log('[Debug]', 'Receive command: Gate, User_ID:', user_id, ': Input_Num:', input_num);
    CQReply_1.send_private_msg(ws, user_id, gate(cq_info, input_num));
};
exports.Gate_Group = function (ws, group_id, cq_info, input_num) {
    console.log('[Debug]', 'Receive command: Gate, Group_ID:', group_id, ': Input_Num:', input_num);
    CQReply_1.send_group_msg(ws, group_id, gate(cq_info, input_num));
};
function gate(cq_info, input_num) {
    var num = Math.floor(Math.random() * 2);
    if (input_num === '3')
        num = Math.floor(Math.random() * 3);
    var msg = cq_info.nickname + '认为应该走{{where}}的门，相信' + cq_info.nickname + '没错的！';
    if (num === 0) {
        msg = msg.replace('{{where}}', '左边');
    }
    else if (num === 1) {
        msg = msg.replace('{{where}}', '右边');
    }
    else if (num === 2) {
        msg = msg.replace('{{where}}', '中间');
    }
    return msg;
}
