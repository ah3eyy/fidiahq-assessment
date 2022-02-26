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
const bcrypt_1 = __importDefault(require("bcrypt"));
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
console.log(process.env.MAILGUN_API_KEY);
const mailGun = new mailgun_js_1.default(form_data_1.default);
const initializeMailGun = mailGun.client({ username: "api", key: process.env.MAILGUN_API_KEY });
class Utils {
    comparePassword(plain_password, hash_password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compareSync(plain_password, hash_password);
        });
    }
    generateRandomAlphaString(length) {
        let chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    sendVerificationMail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //  send reset mail
            data['template'] = `<p>Dear ${data.full_name},</p><br><br><p>Welcome to FidiaHq, <br>Please use the following code to verify your account: <b>${data.code}</b></p>`;
            return this.sendMail(data);
        });
    }
    sendMail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return initializeMailGun.messages.create(process.env.MAILGUN_DOMAIN, {
                from: process.env.MAILGUN_FROM_EMAIL,
                to: [data.email],
                subject: data.subject,
                text: data.subject,
                html: data.template
            });
        });
    }
}
exports.default = new Utils();
//# sourceMappingURL=utils.js.map