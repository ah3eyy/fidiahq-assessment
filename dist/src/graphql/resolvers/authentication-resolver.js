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
const authentication_controller_1 = __importDefault(require("../../controllers/authentication-controller"));
const authResolver = {
    Mutation: {
        loginUser(_, { email, password }) {
            return __awaiter(this, void 0, void 0, function* () {
                return authentication_controller_1.default.loginUserAccount(email, password);
            });
        },
        registerUser(_, { email, password, full_name, phone_number, country }) {
            return __awaiter(this, void 0, void 0, function* () {
                return authentication_controller_1.default.createUserAccount(email, password, phone_number, full_name, country);
            });
        },
        resendVerificationCode(_, { email, code }) {
            return __awaiter(this, void 0, void 0, function* () {
                return authentication_controller_1.default.resendVerificationCode(email, code);
            });
        },
        verifyUserAccount(_, { code }) {
            return __awaiter(this, void 0, void 0, function* () {
                return authentication_controller_1.default.verifyAccount(code);
            });
        }
    },
    Query: {
        allUsers(_, { page_number }) {
            return __awaiter(this, void 0, void 0, function* () {
                return authentication_controller_1.default.allUsers(page_number);
            });
        }
    }
};
exports.default = authResolver;
//# sourceMappingURL=authentication-resolver.js.map