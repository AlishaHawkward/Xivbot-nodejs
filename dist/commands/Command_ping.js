"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
exports.Ping_Private = function (ws, user_id, ping) {
    console.log('[Debug]', 'Receive command: Ping, User_ID:', user_id);
    CQReply_1.send_private_msg_ping(ws, user_id, ping);
};
exports.Ping_Group = function (ws, group_id, ping) {
    console.log('[Debug]', 'Receive command: Ping, Group_ID:', group_id);
    CQReply_1.send_group_msg_ping(ws, group_id, ping);
};
