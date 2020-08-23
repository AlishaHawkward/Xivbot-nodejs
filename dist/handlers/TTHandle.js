"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var request_1 = __importDefault(require("request"));
var AvaTT = [];
exports.TTAdd = function (user_id, ws) {
    AvaTT[user_id] = ws;
};
exports.TTGet = function (user_id) {
    return AvaTT[user_id];
};
exports.TTHandle = function (msg, url, access, user_id) {
    msg = JSON.stringify(msg);
    var hmac = crypto_1.default.createHmac('sha1', access);
    var sign = hmac.update(msg).digest('hex');
    request_1.default({
        url: url,
        method: 'post',
        headers: {
            'X-Self-ID': user_id,
            'X-Signature': 'sha1=' + sign
        },
        body: msg
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log(body);
        }
        else {
            console.log(err, url, access, user_id);
        }
    });
};
