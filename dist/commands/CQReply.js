"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reply = null;
var reply_queue = [];
var handling = false;
var timeout = null;
exports.send_private_msg = function (ws, user_id, message) {
    if (ws) {
        reply_queue.push({
            ws: ws,
            msg: {
                action: 'send_private_msg',
                params: {
                    user_id: user_id,
                    message: message
                }
            }
        });
        if (handling === false) {
            handling = true;
            handleMsg();
        }
    }
};
exports.send_private_msg_ping = function (ws, user_id, ping) {
    if (ws) {
        reply_queue.push({
            ws: ws,
            msg: {
                action: 'send_private_msg',
                params: {
                    user_id: user_id
                }
            },
            ping: ping,
            user_id: user_id
        });
        if (handling === false) {
            handling = true;
            handleMsg();
        }
    }
};
exports.send_private_msg_wd = function (ws, user_id, message, wd) {
    if (ws) {
        reply_queue.push({
            ws: ws,
            msg: {
                action: 'send_private_msg',
                params: {
                    user_id: user_id,
                    message: message
                }
            },
            withdraw: wd
        });
        if (handling === false) {
            handling = true;
            handleMsg();
        }
    }
};
exports.send_group_msg = function (ws, group_id, message) {
    if (ws) {
        reply_queue.push({
            ws: ws,
            msg: {
                action: 'send_group_msg',
                params: {
                    group_id: group_id,
                    message: message
                }
            }
        });
        if (handling === false) {
            handling = true;
            handleMsg();
        }
    }
};
exports.send_group_msg_ping = function (ws, group_id, ping) {
    if (ws) {
        reply_queue.push({
            ws: ws,
            msg: {
                action: 'send_group_msg',
                params: {
                    group_id: group_id
                }
            },
            ping: ping,
            group_id: group_id
        });
        if (handling === false) {
            handling = true;
            handleMsg();
        }
    }
};
exports.send_group_msg_wd = function (ws, group_id, message, wd) {
    if (ws) {
        reply_queue.push({
            ws: ws,
            msg: {
                action: 'send_group_msg',
                params: {
                    group_id: group_id,
                    message: message
                }
            },
            withdraw: wd
        });
        if (handling === false) {
            handling = true;
            handleMsg();
        }
    }
};
var handleMsg = function () {
    if (reply_queue.length > 0 && handling === true) {
        timeout = setTimeout(function () {
            handling = false;
        }, 3000);
        reply = reply_queue.shift();
        if (reply.ping && reply.ping > 0) {
            reply.tmp_msg = '队列延迟：' + (new Date().getTime() - reply.ping) + '毫秒';
            reply.msg.params.message = '正在检测通讯延迟...';
        }
        reply.ws.send(JSON.stringify(reply.msg));
    }
    else {
        handling = false;
    }
};
exports.onMsg = function (ws, msg) {
    if (ws == reply.ws) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (reply.withdraw && reply.withdraw > 0) {
            setTimeout(function () {
                ws.send(JSON.stringify({
                    action: 'delete_msg',
                    params: {
                        message_id: msg.data.message_id
                    }
                }));
            }, reply.withdraw);
        }
        if (reply.ping && reply.ping > 0) {
            if (reply.msg.action === 'send_group_msg') {
                exports.send_group_msg(ws, reply.group_id, reply.tmp_msg + '\n回执延迟：' + (new Date().getTime() - reply.ping) + '毫秒');
            }
            else if (reply.msg.action === 'send_private_msg') {
                exports.send_private_msg(ws, reply.user_id, reply.tmp_msg + '\n回执延迟：' + (new Date().getTime() - reply.ping) + '毫秒');
            }
        }
        handleMsg();
    }
};
