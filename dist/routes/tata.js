"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bot_1 = __importDefault(require("../models/bot"));
var CQReply_1 = require("../commands/CQReply");
var TTHandle_1 = require("../handlers/TTHandle");
var router = express_1.default.Router();
// Main page
router.post('/*', function (req, res) {
    try {
        var token_1 = req.url.split('?')[1];
        var user_id_1 = req.url.split('/')[1];
        var process_type_1 = req.url.split('?')[0].split('/')[2];
        bot_1.default.findOne({ user_id: user_id_1 }, function (err, res) {
            if (err) {
                console.log('[Error]', err);
            }
            else {
                if (res && res.use_tata && res.tata_access == token_1) {
                    if (process_type_1 === 'send_private_msg' || process_type_1 === 'send_private_msg_async') {
                        var ws = TTHandle_1.TTGet(user_id_1);
                        if (ws) {
                            CQReply_1.send_private_msg(ws, req.body.user_id, req.body.message);
                        }
                    }
                    else if (process_type_1 === 'send_group_msg' || process_type_1 === 'send_group_msg_async') {
                        var ws = TTHandle_1.TTGet(user_id_1);
                        if (ws) {
                            CQReply_1.send_group_msg(ws, req.body.group_id, req.body.message);
                        }
                    }
                }
            }
        });
        res.send('{code: 200}');
    }
    catch (e) {
        res.send('{code: 500}');
    }
});
module.exports = router;
