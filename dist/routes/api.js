"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_api_1 = require("./auth-api");
const admin_api_1 = require("./admin-api");
const jwt_middleware_1 = __importDefault(require("../middleware/jwt-middleware"));
const user_api_1 = require("./user-api");
const router = express_1.default.Router();
exports.appRouter = router;
router.use('/auth', auth_api_1.authRouter);
router.use('/admin', jwt_middleware_1.default.verifyUserAuthToken, admin_api_1.AdminRouter);
router.use('/user', jwt_middleware_1.default.verifyUserAuthToken, user_api_1.UserRouter);
//# sourceMappingURL=api.js.map