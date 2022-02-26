"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authentication_controller_1 = __importDefault(require("../controllers/authentication-controller"));
const router = express_1.default.Router();
exports.authRouter = router;
router.post('/create-user-account', authentication_controller_1.default.createUserAccount);
router.post('/create-admin-account', authentication_controller_1.default.createAdminAccount);
router.post('/login-user-account', authentication_controller_1.default.loginUserAccount);
router.post('/login-admin-account', authentication_controller_1.default.loginAdminAccount);
//# sourceMappingURL=auth-api.js.map