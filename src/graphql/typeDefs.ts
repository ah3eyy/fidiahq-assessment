import {ApolloServer, gql} from 'apollo-server-express';

export default gql`
    scalar JSON
    
    type Mutation {
        loginUser(email:String!, password: String!):JSON
        registerUser(email:String!, password:String!, phone_number:String!, full_name: String!, country: String!):JSON
        verifyUserAccount(code: String!):JSON
        resendVerificationCode(email:String, code:String):JSON
    }
    
    type Query {
        allUsers(page_number: Int):JSON
    }
`;