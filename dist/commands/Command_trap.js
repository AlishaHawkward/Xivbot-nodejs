"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
exports.Trap_Private = function (ws, user_id, cq_info, input_num) {
    console.log('[Debug]', 'Receive command: Trap, User_ID:', user_id, ': Input_Num:', input_num);
    CQReply_1.send_private_msg(ws, user_id, trap(cq_info, input_num));
};
exports.Trap_Group = function (ws, group_id, cq_info, input_num) {
    console.log('[Debug]', 'Receive command: Trap, Group_ID:', group_id, ': Input_Num:', input_num);
    CQReply_1.send_group_msg(ws, group_id, trap(cq_info, input_num));
};
function trap(cq_info, input_num) {
    if (!input_num || input_num < 1 || input_num > 9) {
        return '贪欲陷阱：!trap <数值|1-9>';
    }
    var res = {
        big: 0,
        small: 0,
        equal: 0
    };
    for (var i = 0; i < 20; i++) {
        var num = Math.floor(Math.random() * 9) + 1;
        if (num > input_num) {
            res.big++;
        }
        else if (num < input_num) {
            res.small++;
        }
        else {
            res.equal++;
        }
    }
    var msg = cq_info.nickname + '随机取了20个数值跟你给的' + input_num + '进行比较，其中' + res.big + '个比你给的大，' + res.small + '个比你给的小，还有' + res.equal + '个跟你给的一样。所以' + cq_info.nickname + '推荐你{{what}}';
    if (res.big > res.small) {
        msg = msg.replace('{{what}}', '选择大吧！');
    }
    else if (res.big < res.small) {
        msg = msg.replace('{{what}}', '选择小吧！');
    }
    else {
        msg = msg.replace('{{what}}', '随便选择都可以啦！');
    }
    return msg;
}
