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
const response_handler_1 = __importDefault(require("../helpers/response-handler"));
const user_1 = __importDefault(require("../database/models/user"));
const utils_1 = __importDefault(require("../helpers/utils"));
const jwt_init_1 = __importDefault(require("../config/jwt-init"));
const codes_1 = __importDefault(require("../database/models/codes"));
class AuthenticationService {
    createUserAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { full_name, email, password, phone_number, country } = payload;
                // check if email already in use
                let emailCheck = yield user_1.default.findOne({ email: email });
                if (emailCheck)
                    return response_handler_1.default.errorResponse('Email already in use', null, 422);
                // check phone number
                let phoneNumberCheck = yield user_1.default.findOne({ phone_number: phone_number });
                if (phoneNumberCheck)
                    return response_handler_1.default.errorResponse('Phone number already in use', null, 422);
                let user = new user_1.default();
                user.email = email;
                user.full_name = full_name;
                user.password = password;
                user.phone_number = phone_number;
                user.country = country;
                yield user.save();
                // create session and login token for user
                let token = jwt_init_1.default.signToken(user);
                let userData = yield user_1.default.findOne({ _id: user._id });
                let code = utils_1.default.generateRandomAlphaString(5);
                let codeData = new codes_1.default();
                codeData.code = code;
                codeData.uid = userData.id;
                yield codeData.save();
                let va = yield utils_1.default.sendVerificationMail({ full_name: full_name, code: code, email: email });
                console.log(va);
                let data = {
                    token,
                    user: userData
                };
                return response_handler_1.default.successResponse('Account created successfully', data);
            }
            catch (e) {
                console.log(e);
                return response_handler_1.default.errorResponse('An error occurred creating account at the moment', null, 500);
            }
        });
    }
    loginUserAccount(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = payload;
                // check if email already in use
                let userAccount = yield user_1.default.findOne({ email: email }).select('password');
                if (!userAccount)
                    return response_handler_1.default.errorResponse('Invalid account credentials provided', null, 422);
                // verify password
                let passwordVerify = utils_1.default.comparePassword(password, userAccount.password);
                if (!passwordVerify)
                    return response_handler_1.default.errorResponse('Invalid account credentials provided', null, 422);
                // create session and login token for user
                let token = jwt_init_1.default.signToken(userAccount);
                let userData = yield user_1.default.findOne({ _id: userAccount._id });
                let data = {
                    token,
                    user: userData
                };
                return response_handler_1.default.successResponse('Account granted successfully', data);
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred accessing account at the moment', null, 500);
            }
        });
    }
    allUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { page_number, search_Value } = payload;
                let skip = (page_number - 1) * 30;
                let pipeline = [
                    {
                        '$sort': { 'createdAt': -1 }
                    },
                    {
                        '$facet': {
                            metadata: [{ $count: "total" }, { $addFields: { page: page_number } }],
                            data: [{ $skip: skip }, { $limit: 30 }]
                        }
                    }
                ];
                let users = yield user_1.default.aggregate(pipeline);
                return response_handler_1.default.successResponse('All users', { users });
            }
            catch (e) {
                return response_handler_1.default.errorResponse('An error occurred fetching all user records', null, 500);
            }
        });
    }
}
exports.default = new AuthenticationService();
//# sourceMappingURL=authentication-service.js.map