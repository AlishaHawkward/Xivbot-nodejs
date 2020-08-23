"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
var alias_1 = __importDefault(require("../configs/alias"));
exports.Help_Private = function (ws, user_id) {
    console.log('[Debug]', 'Receive command: Help, User_ID:', user_id);
    CQReply_1.send_private_msg(ws, user_id, help());
};
exports.Help_Group = function (ws, group_id) {
    console.log('[Debug]', 'Receive command: Help, Group_ID:', group_id);
    CQReply_1.send_group_msg(ws, group_id, help());
};
function help() {
    return '月華FF14功能说明：\n' +
        '★ 物品查询：!search <物品名称>, 别名：' + alias_1.default.search.join(', ') + '\n' +
        '★ 本周暖暖：!nuannuan, 别名：' + alias_1.default.nuannuan.join(', ') + '\n' +
        '★ 玄学选门：!gate, 三个门使用：!gate3, 别名：' + alias_1.default.gate.join(', ') + '\n' +
        '★ 挖宝查询：!treasure <藏宝图截图>, 别名：' + alias_1.default.treasure.join(', ') + '\n' +
        '★ 贪欲陷阱：!trap <数值|1-9>, 别名：' + alias_1.default.trap.join(', ') + '\n' +
        '★ 投掷子：!dice {数值|n>0|可空}, 别名：' + alias_1.default.dice.join(', ') + '\n' +
        '★ 好涩哦~：!hso {标签|可空}[格式: miqo\'te, au_ra], 别名：' + alias_1.default.hso.join(', ') + '\n' +
        '★ 月儿传图：请输入 !image 查看具体使用说明, 别名：' + alias_1.default.image.join(', ') + '\n' +
        '★ 查看天气：!weather <地图名|中文>, 别名：' + alias_1.default.weather.join(', ') + '\n' +
        '★ 浅草寺求签：!luck, 别名：' + alias_1.default.luck.join(', ') + '\n' +
        '★ DPS统计：请输入 !dps 查看具体使用说明, 别名：' + alias_1.default.dps.join(', ') + '\n' +
        '★ 宏书查询：!search <宏书ID> <第几条宏>, 别名：' + alias_1.default.macro.join(', ') + '\n' +
        '★ 副属性计算：!fsx <暴击|直击|等> <数值>, 别名：' + alias_1.default.fsx.join(', ') + '\n' +
        '★ 青魔法书：!blue <技能ID|技能名称|ALL>, 别名：' + alias_1.default.blue.join(', ') + '\n' +
        '★ 指令符别名：[\'' + alias_1.default.symble.join('\' ,  \'') + '\']';
}
