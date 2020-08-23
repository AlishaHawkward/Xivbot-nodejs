"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
exports.Nyaa_Private = function (ws, user_id) {
    console.log('[Debug]', 'Receive command: Nyaa, User_ID:', user_id);
    CQReply_1.send_private_msg(ws, user_id, nyaa());
};
exports.Nyaa_Group = function (ws, group_id) {
    console.log('[Debug]', 'Receive command: Nyaa, Group_ID:', group_id);
    CQReply_1.send_group_msg(ws, group_id, nyaa());
};
function nyaa() {
    return '噗，你是说尼娅啊，她就是一个大笨蛋哦~';
}
