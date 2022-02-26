import AuthenticationController from '../../controllers/authentication-controller'

const authResolver = {
    Mutation: {
        async loginUser(_, {email, password}) {
            return AuthenticationController.loginUserAccount(email, password);
        },
        async registerUser(_, {email, password, full_name, phone_number, country}) {
            return AuthenticationController.createUserAccount(email, password, phone_number, full_name, country)
        },
        async resendVerificationCode(_, {email, code}) {
            return AuthenticationController.resendVerificationCode(email, code);
        },
        async verifyUserAccount(_, {code}) {
            return AuthenticationController.verifyAccount(code);
        }
    },
    Query: {
        async allUsers(_, {page_number}) {
            return AuthenticationController.allUsers(page_number);
        }
    }
}

export default authResolver;