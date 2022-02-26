"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTInit {
    signToken(user) {
        const expiresIn = 1000 * 60 * 10;
        const secret = process.env.JWT_SECRET;
        const dataStore = {
            user: user._id
        };
        return jsonwebtoken_1.default.sign(dataStore, secret, { expiresIn });
    }
    verifyToken(token) {
        const secret = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.verify(token, secret);
    }
}
exports.default = new JWTInit();
//# sourceMappingURL=jwt-init.js.map