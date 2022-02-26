"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_service_1 = __importDefault(require("../services/authentication-service"));
const response_handler_1 = __importDefault(require("../helpers/response-handler"));
const joi_1 = __importDefault(require("joi"));
class AuthenticationController {
    createUserAccount(email, password, phone_number, full_name, country) {
        const schema = joi_1.default.object({
            country: joi_1.default.string().required().messages({ "any.required": "Country is required" }),
            password: joi_1.default.string().required().messages({ "any.required": "Password is required" }),
            phone_number: joi_1.default.string().required().messages({ "any.required": "Phone Number is required" }),
            full_name: joi_1.default.string().required().messages({ "any.required": "Full name is required" }),
            email: joi_1.default.string().required().messages({ "any.required": "Email is required" })
        });
        const validate = schema.validate({ email, password, phone_number, full_name, country });
        if (validate.error)
            return response_handler_1.default.errorResponse(validate.error.details[0].message, null);
        return authentication_service_1.default.createUserAccount({ email, password, phone_number, full_name, country });
    }
    loginUserAccount(email, password) {
        const schema = joi_1.default.object({
            password: joi_1.default.string().required().messages({ "any.required": "Password is required" }),
            email: joi_1.default.string().required().messages({ "any.required": "Email is required" })
        });
        const validate = schema.validate({ email, password });
        if (validate.error)
            return response_handler_1.default.errorResponse(validate.error.details[0].message, null);
        return authentication_service_1.default.loginUserAccount({ email, password });
    }
    //requires that bearer token be attached for resend
    resendVerificationCode() {
        return {};
    }
    allUsers(page_number = 1) {
        return authentication_service_1.default.allUser({ page_number });
    }
}
exports.default = new AuthenticationController();
//# sourceMappingURL=authentication-controller.js.map