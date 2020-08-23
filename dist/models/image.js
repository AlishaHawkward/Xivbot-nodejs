"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var imageSchema = new mongoose_1.default.Schema({
    image_name: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});
var imageModel = mongoose_1.default.model('image', imageSchema);
exports.default = imageModel;
