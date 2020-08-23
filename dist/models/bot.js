"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var botSchema = new mongoose_1.default.Schema({
    user_id: {
        type: String,
        unique: true,
        required: true
    },
    use_private: {
        type: Boolean,
        required: true,
        default: false
    },
    use_group: {
        type: Boolean,
        required: true,
        default: false
    },
    allow_groups: {
        type: Array,
        required: true,
        default: ['*']
    },
    ban_groups: {
        type: Array,
        required: true,
        default: []
    },
    token: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: false
    },
    version: {
        type: String,
        required: false
    },
    online: {
        type: String,
        required: true,
        default: 0
    },
    use_tata: {
        type: Boolean,
        required: true,
        default: false
    },
    tata_url: {
        type: String,
        required: false
    },
    tata_access: {
        type: String,
        required: false
    }
});
var botModel = mongoose_1.default.model('bot', botSchema);
exports.default = botModel;
