"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var gm_1 = __importDefault(require("gm"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var location_1 = __importDefault(require("./treasure/location"));
var CQReply_1 = require("./CQReply");
exports.Treasure_Private = function (ws, user_id, cq_info, image) {
    console.log('[Debug]', 'Receive command: Treasure, User_ID:', user_id, ': Image:', image);
    treasure(cq_info, image, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Treasure_Group = function (ws, group_id, cq_info, image) {
    console.log('[Debug]', 'Receive command: Treasure, Group_ID:', group_id, ': Image:', image);
    treasure(cq_info, image, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function treasure(cq_info, image, callback) {
    if (!image)
        callback('藏宝图查询：!treasure <藏宝图截图>');
    else if (!getImageUrl(image))
        callback('提交的图片不是有效的格式。');
    else {
        request_1.default({
            url: getImageUrl(image),
            encoding: null,
            method: 'get'
        }, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                var cache = fs_1.default.existsSync(path_1.default.resolve(__dirname, '../cache'));
                if (!cache)
                    fs_1.default.mkdirSync(path_1.default.resolve(__dirname, '../cache'));
                var upload_file_1 = path_1.default.resolve(__dirname, '../cache', getImageName(image));
                gm_1.default(body).resize(195, 162).write(upload_file_1, function (err) {
                    if (err) {
                        console.log('[Error]', err);
                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                    }
                    else {
                        var map_lst_1 = location_1.default();
                        var _loop_1 = function (i) {
                            var compare_file = path_1.default.resolve(__dirname, map_lst_1[i].uri);
                            gm_1.default.compare(upload_file_1, compare_file, function (err, isEqual, equality) {
                                if (err) {
                                    console.log('[Error]', err);
                                    callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                                }
                                else {
                                    map_lst_1[i]['equality'] = equality;
                                    for (var j = 0; j < map_lst_1.length; j++) {
                                        if (!map_lst_1[j]['equality'])
                                            return;
                                    }
                                    // 所有图片相似度检索完成，开始比较
                                    var similarity = 1;
                                    var most_similarity_1 = 0;
                                    for (var j = 0; j < map_lst_1.length; j++) {
                                        if (map_lst_1[j]['equality'] < similarity) {
                                            most_similarity_1 = j;
                                            similarity = map_lst_1[j]['equality'];
                                        }
                                    }
                                    if (cq_info.version === 'pro') {
                                        try {
                                            gm_1.default(path_1.default.resolve(__dirname, map_lst_1[most_similarity_1].uri.replace('/maps/', '/remaps/'))).resize(256, 256).toBuffer('jpg', function (err, buffer) {
                                                if (err) {
                                                    console.log('[Error]', err);
                                                }
                                                else {
                                                    callback('查询到当前宝图位置：' + map_lst_1[most_similarity_1].pos.z + ' (' + map_lst_1[most_similarity_1].pos.x + ', ' + map_lst_1[most_similarity_1].pos.y + ')\n' +
                                                        '[CQ:image, file=base64://' + buffer.toString('base64') + ']');
                                                }
                                            });
                                        }
                                        catch (err) {
                                            console.log('[Error]', '无法找到对应地图文件。');
                                            callback('查询到当前宝图位置：' + map_lst_1[most_similarity_1].pos.z + ' (' + map_lst_1[most_similarity_1].pos.x + ', ' + map_lst_1[most_similarity_1].pos.y + ')\n' +
                                                'https://map.wakingsands.com/#f=mark&x=' + map_lst_1[most_similarity_1].pos.x + '&y=' + map_lst_1[most_similarity_1].pos.y + '&id=' + map_lst_1[most_similarity_1].pos.id);
                                        }
                                    }
                                    else {
                                        callback('查询到当前宝图位置：' + map_lst_1[most_similarity_1].pos.z + ' (' + map_lst_1[most_similarity_1].pos.x + ', ' + map_lst_1[most_similarity_1].pos.y + ')\n' +
                                            'https://map.wakingsands.com/#f=mark&x=' + map_lst_1[most_similarity_1].pos.x + '&y=' + map_lst_1[most_similarity_1].pos.y + '&id=' + map_lst_1[most_similarity_1].pos.id);
                                    }
                                }
                            });
                        };
                        for (var i = 0; i < map_lst_1.length; i++) {
                            _loop_1(i);
                        }
                    }
                });
            }
            else {
                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
            }
        });
    }
}
function getImageName(image) {
    if (image.match(/file=(.+?),/))
        return image.match(/file=(.+?),/)[1];
    else
        return null;
}
function getImageUrl(image) {
    if (image.match(/url=(.+?)]/))
        return image.match(/url=(.+?)]/)[1];
    else
        return null;
}
