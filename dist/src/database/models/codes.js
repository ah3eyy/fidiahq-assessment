"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CodeSchema = new mongoose_1.Schema({
    code: { type: String, default: null },
    uid: { type: String, default: null }
}, {
    timestamps: true
});
CodeSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
exports.default = (0, mongoose_1.model)("Code", CodeSchema);
//# sourceMappingURL=codes.js.map