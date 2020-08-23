"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var gm_1 = __importDefault(require("gm"));
var CQReply_1 = require("./CQReply");
var cool_down = false;
exports.Hso_Private = function (ws, user_id, cq_info, rage, tags) {
    console.log('[Debug]', 'Receive command: Hso, User_ID:', user_id, ': Tags:', tags);
    if (cq_info.version !== 'pro') {
        CQReply_1.send_private_msg(ws, user_id, '很抱歉，您的BOT版本不支持该指令！');
        return;
    }
    if (rage && rage === 'x') {
        hso(tags, true, function (res, wd) {
            if (wd === void 0) { wd = 0; }
            CQReply_1.send_private_msg_wd(ws, user_id, res, wd);
        });
    }
    else {
        hso(rage, false, function (res, wd) {
            if (wd === void 0) { wd = 0; }
            CQReply_1.send_private_msg_wd(ws, user_id, res, wd);
        });
    }
};
exports.Hso_Group = function (ws, group_id, cq_info, rage, tags) {
    console.log('[Debug]', 'Receive command: Hso, Group_ID:', group_id, ': Tags:', tags);
    if (cq_info.version !== 'pro') {
        CQReply_1.send_group_msg(ws, group_id, '很抱歉，您的BOT版本不支持该指令！');
        return;
    }
    if (rage && rage === 'x') {
        hso(tags, true, function (res, wd) {
            if (wd === void 0) { wd = 0; }
            CQReply_1.send_group_msg_wd(ws, group_id, res, wd);
        });
    }
    else {
        hso(rage, false, function (res, wd) {
            if (wd === void 0) { wd = 0; }
            CQReply_1.send_group_msg_wd(ws, group_id, res, wd);
        });
    }
};
function hso(tags, r18, callback) {
    if (r18 === void 0) { r18 = false; }
    if (cool_down === false) {
        cool_down = true;
        if (tags)
            req(1, 1000, tags, r18, callback);
        else {
            var page = Math.floor(Math.random() * 1000);
            req(page, 100, tags, r18, callback);
        }
    }
    else {
        callback('上一个请求尚未结束，请稍后再试！');
    }
}
function req(page, limit, tags, r18, callback) {
    var url = 'https://konachan.com/post.json?limit=' + limit + '&page=' + page;
    if (tags)
        url = 'https://konachan.com/post.json?limit=' + limit + '&page=' + page + '&tags=' + escape(tags.replace(/,/g, ' '));
    // console.log(url)
    request_1.default({
        url: url,
        method: 'get',
        json: true
    }, function (err, res, body) {
        console.log('[Debug]', 'Hso req Fetched.');
        if (!err && res.statusCode == 200) {
            try {
                if (body.length === 0) {
                    callback('没有搜索到相关图片！');
                    cool_down = false;
                }
                else {
                    if (r18) {
                        var seed = Math.floor(Math.random() * body.length);
                        reqImg(body[seed].sample_url, body[seed].source, (body[seed].rating === 's' ? 0 : 8000), callback);
                    }
                    else {
                        var sImg = [];
                        for (var i = 0; i < body.length; i++) {
                            if (body[i].rating === 's') {
                                sImg.push(body[i]);
                            }
                        }
                        if (sImg.length === 0) {
                            callback('没有搜索到相关图片！');
                            cool_down = false;
                        }
                        else {
                            var seed = Math.floor(Math.random() * sImg.length);
                            reqImg(sImg[seed].sample_url, sImg[seed].source, 0, callback);
                        }
                    }
                    // callback('[CQ:image, file=' + body[Math.floor(Math.random() * body.length)].sample_url + ']')
                }
            }
            catch (err) {
                console.log('[Error]', err);
                callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                cool_down = false;
            }
        }
        else {
            console.log('[Error]', err);
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
            cool_down = false;
        }
    });
}
function reqImg(url, source, wd, callback) {
    if (wd === void 0) { wd = 0; }
    // console.log(url)
    request_1.default({
        url: url,
        method: 'get',
        encoding: null
    }, function (err, res, body) {
        console.log('[Debug]', 'Hso reqImg Fetched.');
        if (!err && res.statusCode == 200) {
            // callback('[CQ:image, file=base64://' + body.toString('base64') + ']', wd)
            cool_down = false;
            gm_1.default(body).resize(512).toBuffer('PNG', function (err, buffer) {
                if (err) {
                    console.log('[Error]', err);
                    callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
                }
                else {
                    callback('[CQ:image, file=base64://' + buffer.toString('base64') + ']\n' + '图片源: ' + source, wd);
                }
            });
        }
        else {
            console.log('[Error]', err);
            callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。');
            cool_down = false;
        }
    });
}
// function req (page: any, tags: any, callback: any) {
//   let url = 'http://206.189.159.80/konachan.php?limit=50&page=' + page
//   if (tags)
//     url = 'http://206.189.159.80/konachan.php?limit=50&page=' + page + '&tags=' + escape(tags)
//   request({
//     url,
//     method: 'get'
//   }, (err, res, body) => {
//     if (!err && res.statusCode == 200) {
//       let json
//       try {
//         json = JSON.parse(body)
//         if (json.length === 0 && page > 1) {
//           req(Math.floor(page / 2), tags, callback)
//         } else {
//           if (json.length === 0) {
//             callback('没有搜索到相关图片！')
//           } else {
//             console.log(page, json.length)
//           }
//         }
//       } catch (err) {
//         req(Math.floor(page / 4), tags, callback)
//       }
//       // let ran = Math.floor(Math.random() * 20)
//       // callback('[CQ:image, file=' + json[ran].sample_url + ']')
//     } else {
//       console.log('[Error]', err)
//       callback('很抱歉，月儿出现了一点小问题，没能完成你的请求。')
//     }
//   })
// }
