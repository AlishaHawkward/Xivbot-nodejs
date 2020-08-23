"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var luckSchema = new mongoose_1.default.Schema({
    user_id: {
        type: String,
        unique: true,
        required: true
    },
    num: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true,
        default: 0
    }
});
var luckModel = mongoose_1.default.model('luck', luckSchema);
exports.default = luckModel;
