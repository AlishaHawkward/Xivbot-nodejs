"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
exports.Dice_Private = function (ws, user_id, input_num) {
    console.log('[Debug]', 'Receive command: Dice, User_ID:', user_id, ': Input_Num:', input_num);
    CQReply_1.send_private_msg(ws, user_id, dice(input_num));
};
exports.Dice_Group = function (ws, group_id, user_id, input_num) {
    console.log('[Debug]', 'Receive command: Dice, Group_ID:', group_id, ': Input_Num:', input_num);
    CQReply_1.send_group_msg(ws, group_id, '[CQ:at, qq=' + user_id + '] ' + dice(input_num));
};
function dice(input_num) {
    var num = 100;
    if (input_num && !isNaN(parseInt(input_num)) && parseInt(input_num) > 0) {
        num = input_num;
    }
    var msg = '你投掷出了' + Math.floor(Math.random() * num + 1) + '点。';
    return msg;
}
