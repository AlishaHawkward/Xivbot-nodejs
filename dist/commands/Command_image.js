"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var gm_1 = __importDefault(require("gm"));
var image_1 = __importDefault(require("../models/image"));
var image_refer_1 = __importDefault(require("../models/image_refer"));
var CQReply_1 = require("./CQReply");
exports.Image_Private = function (ws, user_id, arg1, arg2, arg3) {
    console.log('[Debug]', 'Receive command: Image, User_ID:', user_id, ': Arg1:2:3:', arg1, arg2, arg3);
    image(arg1, arg2, arg3, function (res) {
        CQReply_1.send_private_msg(ws, user_id, res);
    });
};
exports.Image_Group = function (ws, group_id, arg1, arg2, arg3) {
    console.log('[Debug]', 'Receive command: Image, Group_ID:', group_id, ': Arg1:2:3:', arg1, arg2, arg3);
    image(arg1, arg2, arg3, function (res) {
        CQReply_1.send_group_msg(ws, group_id, res);
    });
};
function image(arg1, arg2, arg3, callback) {
    if (!arg1) {
        callback('月儿传图：\n获取随机图片：!image <图库名称>\n上传图片到图库：!image upload <图库名称> <图片>\n给图库添加一个别名：!image refer <图库名称> <参照昵称>');
        return;
    }
    if (arg1 === 'upload') {
        if (!arg2 || !arg3) {
            callback('月儿传图：\n获取随机图片：!image <图库名称>\n上传图片到图库：!image upload <图库名称> <图片>\n给图库添加一个别名：!image refer <图库名称> <参照昵称>');
            return;
        }
        if (arg2.length < 1 || arg2.length > 16) {
            callback('图库名称长度规则为1-16字符。');
            return;
        }
        if (!getImageUrl(arg3)) {
            callback('提交的图片不是有效的格式。');
            return;
        }
        request_1.default({
            url: getImageUrl(arg3),
            encoding: null,
            method: 'get'
        }, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                var cache = fs_1.default.existsSync(path_1.default.resolve(__dirname, '../cache'));
                if (!cache)
                    fs_1.default.mkdirSync(path_1.default.resolve(__dirname, '../cache'));
                var upload_file_1 = path_1.default.resolve(__dirname, '../cache', getImageName(arg3));
                gm_1.default(body).write(upload_file_1, function (err) {
                    if (err) {
                        console.log('[Error]', err);
                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                    }
                    else {
                        var form_data = {
                            smfile: fs_1.default.createReadStream(upload_file_1)
                        };
                        request_1.default({
                            url: 'https://sm.ms/api/v2/upload',
                            method: 'post',
                            json: true,
                            headers: {
                                // Accept: '*/*',
                                Origin: 'https://sm.ms',
                                'User-Agent': 'Yuer-Bot: v1.0',
                                // 'Content-Type': 'multipart/form-data',
                                Authorization: 'basic n1llPovjA6jDZY4XAwyMd9Ocq1Ty3pyt'
                            },
                            formData: form_data
                        }, function (err, res, body) {
                            // console.log(res)
                            if (!err && res.statusCode == 200) {
                                if (body.success || body.code === 'image_repeated') {
                                    var img_source_1;
                                    if (body.success) {
                                        img_source_1 = body.data.url;
                                    }
                                    else {
                                        img_source_1 = body.images;
                                    }
                                    image_1.default.find({ image_name: getImageName(arg3) }, function (err, res) {
                                        if (err) {
                                            console.log('[Error]', err);
                                            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                                        }
                                        else if (res && res.length > 0) {
                                            callback('很抱歉，图库中已经存在这张图片了。');
                                        }
                                        else {
                                            refer2name(arg2, function (err, res) {
                                                if (err) {
                                                    callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                                                }
                                                else {
                                                    image_1.default.create({
                                                        image_name: getImageName(arg3),
                                                        category: res,
                                                        link: img_source_1
                                                    }).then(function () {
                                                        callback('图片 ' + getImageName(arg3) + ' 上传至分类 ' + res + ' 成功！');
                                                    }).catch(function (err) {
                                                        console.log('[Error]', err);
                                                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    callback('图库那边返回了一个错误：' + body.message + '。');
                                }
                            }
                            else {
                                console.log('[Error]', err);
                                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                            }
                        });
                    }
                });
            }
            else {
                console.log('[Error]', err);
                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
            }
        });
    }
    else if (arg1 === 'refer') {
        if (!arg2 || !arg3) {
            callback('月儿传图：\n获取随机图片：!image <图库名称>\n上传图片到图库：!image upload <图库名称> <图片>\n给图库添加一个别名：!image refer <图库名称> <参照昵称>');
            return;
        }
        if (arg2.length < 1 || arg2.length > 16 || arg3.length < 1 || arg3.length > 16) {
            callback('图库名称和参照昵称长度规则为1-16字符。');
            return;
        }
        image_1.default.find({ category: arg2 }, function (err, res) {
            if (err) {
                console.log('[Error]', err);
                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
            }
            else if (!res || res.length === 0) {
                callback('没有找到 ' + arg2 + ' 这个分类！');
            }
            else {
                image_1.default.find({ category: arg3 }, function (err, res) {
                    if (err) {
                        console.log('[Error]', err);
                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                    }
                    else if (!res || res.length === 0) {
                        image_refer_1.default.findOne({ category: arg2 }, function (err, res) {
                            if (err) {
                                console.log('[Error]', err);
                                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                            }
                            else if (res) {
                                res.refer.push(arg3);
                                image_refer_1.default.updateOne({ category: arg2 }, { refer: res.refer }, function (err) {
                                    if (err) {
                                        console.log('[Error]', err);
                                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                                    }
                                    else {
                                        callback('成功给 ' + arg2 + ' 分类设置了参照：' + arg3 + '。');
                                    }
                                });
                            }
                            else {
                                image_refer_1.default.create({
                                    category: arg2,
                                    refer: [arg3]
                                }).then(function () {
                                    callback('成功给 ' + arg2 + ' 分类设置了参照：' + arg3 + '。');
                                }).catch(function (err) {
                                    console.log('[Error]', err);
                                    callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                                });
                            }
                        });
                    }
                    else {
                        callback(arg3 + ' 这个分类已经存在了，无法设置参照了。');
                    }
                });
            }
        });
    }
    else {
        refer2name(arg1, function (err, name) {
            if (err) {
                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
            }
            else {
                image_1.default.find({ category: name }, function (err, res) {
                    if (err) {
                        console.log('[Error]', err);
                        callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                    }
                    else if (!res || res.length === 0) {
                        callback('没有找到 ' + name + ' 这个分类！');
                    }
                    else {
                        var num = Math.floor(Math.random() * res.length);
                        callback('[CQ:image, file=' + res[num].link + ']');
                    }
                });
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
function refer2name(refer, callback) {
    image_refer_1.default.find(function (err, res) {
        if (err) {
            console.log('[Error]', err);
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
        }
        else {
            var found = false;
            for (var i = 0; i < res.length; i++) {
                if (res[i].refer.includes(refer)) {
                    callback(null, res[i].category);
                    found = true;
                    break;
                }
            }
            if (!found) {
                callback(null, refer);
            }
        }
    });
}
