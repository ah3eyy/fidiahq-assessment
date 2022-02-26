"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = (0, apollo_server_express_1.gql) `
    scalar JSON
    
    type Mutation {
        loginUser(email:String!, password: String!):JSON
        registerUser(email:String!, password:String!, phone_number:String!, full_name: String!, country: String!):JSON
        verifyUserAccount(verification_code: String!):JSON
        resendVerificationCode:JSON
    }
    
    type Query {
        allUsers(page_number: Int):JSON
    }
`;
//# sourceMappingURL=typeDefs.js.map