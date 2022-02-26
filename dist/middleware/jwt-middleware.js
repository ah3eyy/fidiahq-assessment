"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_init_1 = __importDefault(require("../config/jwt-init"));
const user_1 = __importDefault(require("../database/models/user"));
class TokenAuthVerification {
    constructor() {
    }
    verifyUserAuthToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // endpoints that can be called publicly
            let skipRoute = [
                '/search-fixtures'
            ];
            let currentUrl = req.path;
            if (skipRoute.includes(currentUrl)) {
                return next();
            }
            let authHeader = req.header('authorization');
            if (!authHeader)
                return res.status(401).send({ 'message': 'Authorization Failed' });
            // get authentication token
            let parts = req.headers.authorization.split(' ');
            if (parts.length !== 2)
                return res.status(401).send({ 'message': 'Authorization Failed' });
            let schema = parts[0];
            let token = parts[1];
            if (!/^Bearer/i.test(schema))
                return res.status(401).send({ 'message': 'Authorization Failed' });
            let verifyJWT = jwt_init_1.default.verifyToken(token);
            if (!verifyJWT)
                return res.status(401).send({ 'message': 'Authorization Failed' });
            let userAccount = yield user_1.default.findOne({ _id: verifyJWT['user'] });
            if (!userAccount)
                return res.status(401).send({ 'message': 'Authorization Failed' });
            req['user'] = userAccount;
            next();
        });
    }
}
exports.default = new TokenAuthVerification();
//# sourceMappingURL=jwt-middleware.js.map