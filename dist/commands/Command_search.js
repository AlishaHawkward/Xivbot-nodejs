"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var cheerio_1 = __importDefault(require("cheerio"));
var CQReply_1 = require("./CQReply");
exports.Search_Private = function (ws, user_id, item_name) {
    console.log('[Debug]', 'Receive command: Search, User_ID:', user_id, ': Item_Name:', item_name);
    item_search(item_name, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Search_Group = function (ws, group_id, item_name) {
    console.log('[Debug]', 'Receive command: Search, Group_ID:', group_id, ': Item_Name:', item_name);
    item_search(item_name, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function item_search(item_name, callback) {
    if (!item_name) {
        callback('物品查询：!search <物品名称>');
        return;
    }
    request_1.default({
        url: 'https://cdn.huijiwiki.com/ff14/api.php?format=json&action=parse&title=ItemSearch&text={{ItemSearch|name=' + encodeURIComponent(item_name) + '}}',
        method: 'get',
        json: true,
        headers: {
            Referer: 'https://ff14.huijiwiki.com/wiki/ItemSearch?name=' + encodeURIComponent(item_name)
        }
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var $_1 = cheerio_1.default.load(body.parse.text['*']);
            var item_num = decodeUnicode($_1('div.mw-parser-output>p').html());
            var item_lst = $_1('div.ff14-item-list--item');
            var ouput_buffer_1 = item_name + ' 的搜索结果\n' + item_num;
            item_lst.each(function (key, value) {
                if (key >= 10)
                    return;
                var html = $_1(value);
                var item = {
                    item_name: decodeUnicode($_1(html.find('div.item-name.rarity-common>a')).html()),
                    item_img: $_1(html.find('div.item-icon--img>a')).attr('href'),
                    item_category: decodeUnicode($_1(html.find('div.item-category')).html())
                };
                if (item.item_name)
                    ouput_buffer_1 += ('\n' + key + '. ' + item.item_name + ' ' + 'https://ff14.huijiwiki.com/wiki/' + encodeURIComponent('物品:' + item.item_name));
            });
            callback(ouput_buffer_1);
        }
        else {
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
    });
}
function decodeUnicode(str) {
    if (str)
        str = str.replace(/&#x/g, '%u').replace(/;/g, '');
    else
        str = '';
    return unescape(str);
}
