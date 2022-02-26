import bcrypt from 'bcrypt';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailGun = new Mailgun(formData);
const initializeMailGun = mailGun.client({username: "api", key: process.env.MAILGUN_API_KEY});

class Utils {

    async comparePassword(plain_password: string, hash_password: string) {
        return bcrypt.compareSync(plain_password, hash_password);
    }

    generateRandomAlphaString(length) {
        let chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    async sendVerificationMail(data) {
        //  send reset mail
        data['template'] = `<p>Dear ${data.full_name},</p><br><br><p>Welcome to FidiaHq, <br>Please use the following code to verify your account: <b>${data.code}</b></p>`;
        data['subject'] = 'Verify Account';
        return this.sendMail(data);
    }

    async sendMail(data) {
        return initializeMailGun.messages.create(process.env.MAILGUN_DOMAIN, {
            from: process.env.MAILGUN_FROM_EMAIL,
            to: [data.email],
            subject: data.subject,
            text: data.subject,
            html: data.template
        });
    }
}

export default new Utils();