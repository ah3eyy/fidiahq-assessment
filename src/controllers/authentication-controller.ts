import {Request, Response} from "express";
import AuthenticationService from '../services/authentication-service';
import ResponseHandler from '../helpers/response-handler';
import Joi from "joi";

class AuthenticationController {

    createUserAccount(email, password, phone_number, full_name, country) {

        const schema = Joi.object({
            country: Joi.string().required().messages({"any.required": "Country is required"}),
            password: Joi.string().required().messages({"any.required": "Password is required"}),
            phone_number: Joi.string().required().messages({"any.required": "Phone Number is required"}),
            full_name: Joi.string().required().messages({"any.required": "Full name is required"}),
            email: Joi.string().required().messages({"any.required": "Email is required"})
        });

        const validate = schema.validate({email, password, phone_number, full_name, country});

        if (validate.error)
            return ResponseHandler.errorResponse(validate.error.details[0].message, null);

        return AuthenticationService.createUserAccount({email, password, phone_number, full_name, country});
    }

    loginUserAccount(email, password) {
        const schema = Joi.object({
            password: Joi.string().required().messages({"any.required": "Password is required"}),
            email: Joi.string().required().messages({"any.required": "Email is required"})
        });

        const validate = schema.validate({email, password});

        if (validate.error)
            return ResponseHandler.errorResponse(validate.error.details[0].message, null);

        return AuthenticationService.loginUserAccount({email, password});
    }

    resendVerificationCode(email, code) {
        return AuthenticationService.resendVerificationCode({email, code});
    }

    verifyAccount(code) {
        return AuthenticationService.verifyUserAccount({code});
    }

    allUsers(page_number = 1) {
        return AuthenticationService.allUser({page_number})
    }
}

export default new AuthenticationController();