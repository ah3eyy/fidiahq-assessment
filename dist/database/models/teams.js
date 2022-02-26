"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const TeamSchema = new mongoose_1.Schema({
    name: { type: String, default: null },
    color: { type: String, default: null },
    total_team_count: { type: String, default: null },
}, {
    timestamps: true
});
TeamSchema.plugin(mongoose_delete_1.default);
TeamSchema.index({ name: 'text', color: 'text' });
TeamSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
exports.default = (0, mongoose_1.model)("Team", TeamSchema);
//# sourceMappingURL=teams.js.map