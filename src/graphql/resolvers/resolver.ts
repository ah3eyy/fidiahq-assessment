import {GraphQLJSON, GraphQLJSONObject} from 'graphql-type-json';
import authResolver from '../resolvers/authentication-resolver';

const initResolver  ={
    Query: {
        ...authResolver.Query
    },
    Mutation: {
        ...authResolver.Mutation
    },
    JSON: {
        __serialize(value){
            return GraphQLJSON.parseValue(value);
        }
    }
}

export  {initResolver as InitResolver};