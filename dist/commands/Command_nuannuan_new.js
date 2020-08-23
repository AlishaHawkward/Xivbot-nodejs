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
    var url = 'https://docs.qq.com/dop-api/get/sheet?padId=300000000$cMshIrVXeqSX&subId=dewveu&outformat=1';
    request_1.default({
        url: url,
        method: 'get',
        json: true,
        headers: {
            Referer: 'https://docs.qq.com'
        }
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var detail = body.data.initialAttributedText.text[0][4][0].c[1];
            var title = get_data(detail, 28);
            var item1 = get_data(detail, 109);
            var item2 = get_data(detail, 325);
            var item3 = get_data(detail, 514);
            var item4 = get_data(detail, 703);
            var info1 = get_data(detail, 137);
            var info2 = get_data(detail, 353);
            var info3 = get_data(detail, 542);
            var info4 = get_data(detail, 731);
            var get1 = get_data(detail, 191);
            var get2 = get_data(detail, 407);
            var get3 = get_data(detail, 596);
            var get4 = get_data(detail, 785);
            var dye1 = get_data(detail, 919) + get_data(detail, 920);
            var dye2 = get_data(detail, 946) + get_data(detail, 947);
            var dye3 = get_data(detail, 973) + get_data(detail, 974);
            var dye4 = get_data(detail, 1000) + get_data(detail, 1001);
            var dye5 = get_data(detail, 1027) + get_data(detail, 1028);
            var dye6 = get_data(detail, 1054) + get_data(detail, 1055);
            var msg = title;
            msg += ('\n★ ' + item1 + '\n本期提示：' + info1 + '\n可选方案/本期提示：\n' + get1);
            msg += ('\n★ ' + item2 + '\n本期提示：' + info2 + '\n可选方案/本期提示：\n' + get2);
            msg += ('\n★ ' + item3 + '\n本期提示：' + info3 + '\n可选方案/本期提示：\n' + get3);
            msg += ('\n★ ' + item4 + '\n本期提示：' + info4 + '\n可选方案/本期提示：\n' + get4);
            msg += ('\n★ 染色攻略：\n' + dye1 + '\n' + dye2 + '\n' + dye3 + '\n' + dye4 + '\n' + dye5 + '\n' + dye6);
            msg += ('\n\n数据来源: 游玩C\n接口提供: 艾莉莎霍华特@红玉海');
            callback(msg);
        }
        else {
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
    });
}
function get_data(data, index) {
    return data['' + index]['2'][1];
}
