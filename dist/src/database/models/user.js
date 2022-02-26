"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    full_name: { type: String, default: null },
    phone_number: { type: String, default: null, unique: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    password: { type: String, required: true, select: false },
    is_verified: { type: Boolean, default: false }
}, {
    timestamps: true
});
UserSchema.pre("save", function userSchemaPre(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        // eslint-disable-next-line
        bcrypt_1.default.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            } // eslint-disable-next-line
            bcrypt_1.default.hash(user.password, salt, (hashErr, hash) => {
                //eslint-disable-line
                if (hashErr) {
                    return next(hashErr);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        return next();
    }
});
UserSchema.index({ name: 'text', color: 'text' });
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});
exports.default = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=user.js.map