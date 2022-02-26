import ResponseHandler from '../helpers/response-handler'
import UserSchema from "../database/models/user";
import Utils from '../helpers/utils';
import JWTInit from "../config/jwt-init";
import CodeSchema from "../database/models/codes";
import user from "../database/models/user";

class AuthenticationService {
    async createUserAccount(payload) {
        try {

            let {full_name, email, password, phone_number, country} = payload;

            // check if email already in use
            let emailCheck = await UserSchema.findOne({email: email});

            if (emailCheck)
                return ResponseHandler.errorResponse('Email already in use', null, 422);

            // check phone number
            let phoneNumberCheck = await UserSchema.findOne({phone_number: phone_number});

            if (phoneNumberCheck)
                return ResponseHandler.errorResponse('Phone number already in use', null, 422);


            let user = new UserSchema();
            user.email = email;
            user.full_name = full_name;
            user.password = password;
            user.phone_number = phone_number;
            user.country = country;
            await user.save();

            // create session and login token for user
            let token = JWTInit.signToken(user);

            let userData = await UserSchema.findOne({_id: user._id});

            let code = Utils.generateRandomAlphaString(5);

            let codeData = new CodeSchema();
            codeData.code = code;
            codeData.uid = userData.id;
            await codeData.save();

            await Utils.sendVerificationMail({full_name: full_name, code: code, email: email});

            let data = {
                token,
                user: userData
            };

            return ResponseHandler.successResponse('Account created successfully', data);
        } catch (e) {
            return ResponseHandler.errorResponse(e.message || 'An error occurred creating account at the moment', null, 500);
        }
    }

    async loginUserAccount(payload) {
        try {

            let {email, password} = payload;

            // check if email already in use
            let userAccount = await UserSchema.findOne({email: email}).select('password');

            if (!userAccount)
                return ResponseHandler.errorResponse('Invalid account credentials provided', null, 422);

            // verify password
            let passwordVerify = Utils.comparePassword(password, userAccount.password);

            if (!passwordVerify)
                return ResponseHandler.errorResponse('Invalid account credentials provided', null, 422);

            let userData = await UserSchema.findOne({_id: userAccount._id});

            if (!userData.is_verified)
                return ResponseHandler.errorResponse('Account not verified. Proceed to verify account ', null, 422);

            // create session and login token for user
            let token = JWTInit.signToken(userAccount);

            let data = {
                token,
                user: userData
            };

            return ResponseHandler.successResponse('Account granted successfully', data);
        } catch (e) {
            return ResponseHandler.errorResponse('An error occurred accessing account at the moment', null, 500);
        }
    }

    async allUser(payload) {
        try {

            let {page_number, search_Value} = payload;

            let skip = (page_number - 1) * 30;

            let pipeline = <any>[
                {
                    '$sort': {'createdAt': -1}
                },
                {
                    '$facet': {
                        metadata: [{$count: "total"}, {$addFields: {page: page_number}}],
                        data: [{$skip: skip}, {$limit: 30}]
                    }
                }
            ];

            let users = await UserSchema.aggregate(pipeline);

            return ResponseHandler.successResponse('All users', {users});

        } catch (e) {
            return ResponseHandler.errorResponse('An error occurred fetching all user records', null, 500);
        }
    }

    async resendVerificationCode(payload) {
        try {

            let {email, code} = payload;

            let codeCheck;
            // check if old code has expired and if yes send a new code
            if (code) {
                codeCheck = await CodeSchema.findOne({code: code});
                let startTime = new Date(codeCheck.createdAt).getTime();
                let endTime = new Date().getTime();
                let diffInTime = endTime - startTime;
                let diffInMin = Math.abs(diffInTime) / (1000 * 60) % 60;
                //    verify account and proceed to verify account.. code is valid if time created is under 5min

                if (parseInt(diffInMin.toString()) <= 5)
                    return this.verifyUserAccount({code});
            }

            let userAccount;

            if (codeCheck)
                userAccount = await UserSchema.findOne({_id: codeCheck.uid});

            if (!userAccount && email)
                userAccount = await UserSchema.findOne({email: email});

            if (!userAccount)
                return ResponseHandler.errorResponse('Invalid email account. Kindly contact support for help.', {}, 422);

            code = Utils.generateRandomAlphaString(5);

            let codeData = new CodeSchema();
            codeData.code = code;
            codeData.uid = userAccount.id;
            await codeData.save();

            await Utils.sendVerificationMail({
                full_name: userAccount.full_name,
                code: code,
                email: email || userAccount.email
            });

            return ResponseHandler.successResponse('', {message: 'Verification code sent successfully.'});
        } catch (e) {
            return ResponseHandler.errorResponse(e.message || 'An error occurred creating account at the moment', null, 500);
        }
    }

    async verifyUserAccount(payload) {
        try {

            let {code} = payload;

            let codeCheck;

            // check if old code has expired and if yes send a new code
            codeCheck = await CodeSchema.findOne({code: code});

            if (!codeCheck)
                return ResponseHandler.errorResponse('Invalid code provided.', {}, 422);

            let startTime = new Date(codeCheck.createdAt).getTime();
            let endTime = new Date().getTime();
            let diffInTime = endTime - startTime;
            let diffInMin = Math.abs(diffInTime) / (1000 * 60) % 60;
            //    verify account and proceed to verify account.. code is valid if time created is under 5min

            if (parseInt(diffInMin.toString()) > 5)
                return ResponseHandler.errorResponse('Verification code expired.', {}, 422);

            let userAccount;

            if (codeCheck)
                userAccount = await UserSchema.findOne({_id: codeCheck.uid});

            if (!userAccount)
                return ResponseHandler.errorResponse('Invalid verification code provided.', {}, 422);

            userAccount.is_verified = true;
            await userAccount.save();

            return ResponseHandler.successResponse('Account verified successfully.', {message: 'Account verified successfully.'});
        } catch (e) {
            console.log(e)
            return ResponseHandler.errorResponse(e.message || 'An error occurred creating account at the moment', null, 500);
        }
    }
}

export default new AuthenticationService();