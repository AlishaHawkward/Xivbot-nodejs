"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("../configs/config"));
var DBHandle = new Promise(function (resolve, reject) {
    var db_engine = config_1.default.db_engine;
    var db_info = config_1.default.db_info;
    if (db_engine === 'mongo') {
        mongoose_1.default.connect('mongodb://' + db_info.host + ':' + db_info.port + '/xivbot', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
        mongoose_1.default.connection.once('open', function (err) {
            if (!err) {
                console.log('[Debug]', 'Database connected.');
                resolve();
            }
            else {
                console.log('[Error]', err);
                reject(err);
            }
        });
    }
    else {
        console.log('[Error]', 'Can not find db_engine in config.ts');
        reject('Engine not found');
    }
});
exports.default = DBHandle;
