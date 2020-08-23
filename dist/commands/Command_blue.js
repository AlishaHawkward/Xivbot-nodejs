"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CQReply_1 = require("./CQReply");
var skills_1 = __importDefault(require("./blue/skills"));
var skills_lst = skills_1.default();
exports.Blue_Private = function (ws, user_id, arg) {
    console.log('[Debug]', 'Receive command: Help, User_ID:', user_id, ': arg:', arg);
    CQReply_1.send_private_msg(ws, user_id, blue(arg));
};
exports.Blue_Group = function (ws, group_id, arg) {
    console.log('[Debug]', 'Receive command: Blue, Group_ID:', group_id, ': arg:', arg);
    CQReply_1.send_group_msg(ws, group_id, blue(arg));
};
function blue(arg) {
    if (!arg) {
        return '青魔法书：!blue <技能ID|技能名称|ALL>';
    }
    if (arg.toUpperCase() === 'ALL') {
        var msg = '青魔法师技能一览：';
        for (var i = 0; i < skills_lst.length; i++) {
            if (i % 4 === 0) {
                msg += '\n';
            }
            else {
                msg += '     ';
            }
            msg += (skills_lst[i]['编号'] + '. ' + skills_lst[i]['终极针']);
        }
        return msg;
    }
    var skill = null;
    for (var i = 0; i < skills_lst.length; i++) {
        if (skills_lst[i]['编号'] === parseInt(arg) || skills_lst[i]['终极针'].search(arg) >= 0) {
            skill = skills_lst[i];
            break;
        }
    }
    if (skill) {
        var msg = '★ 青魔法书技能 ' + skill['终极针'] + '(id: ' + skill['编号'] + ')' + ' 详情如下：';
        msg += ('\n★ 攻击类型：' + skill['类型'] + '   攻击属性：' + skill['属性']);
        msg += ('\n★ 稀有度：' + skill['稀有度'] + '   敌人等级：' + skill['敌人等级']);
        msg += ('\n★ 介绍：\n' + skill['技能效果']);
        msg += ('\n★ 获得方法：\n' + skill['获得方法']);
        return msg;
    }
    else {
        return '月儿在青魔法书内没有找到这个技能哦！';
    }
}
