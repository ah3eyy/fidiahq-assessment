"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const FixtureSchema = new mongoose_1.Schema({
    home_team: { ref: 'Team', type: mongoose_1.Types.ObjectId, default: null },
    away_team: { ref: 'Team', type: mongoose_1.Types.ObjectId, default: null },
    match_time: { type: String, default: null },
    status: { type: String, enum: ['completed', 'pending'], default: 'pending' }
}, {
    timestamps: true
});
FixtureSchema.plugin(mongoose_delete_1.default);
FixtureSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
exports.default = (0, mongoose_1.model)("Fixtures", FixtureSchema);
//# sourceMappingURL=fixtures.js.map