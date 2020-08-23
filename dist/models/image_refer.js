"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var image_referSchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        unique: true,
        required: true
    },
    refer: {
        type: Array,
        required: true,
        default: []
    }
});
var image_referModel = mongoose_1.default.model('image_refer', image_referSchema);
exports.default = image_referModel;
