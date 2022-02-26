"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitResolver = void 0;
const graphql_type_json_1 = require("graphql-type-json");
const authentication_resolver_1 = __importDefault(require("../resolvers/authentication-resolver"));
const initResolver = {
    Query: Object.assign({}, authentication_resolver_1.default.Query),
    Mutation: Object.assign({}, authentication_resolver_1.default.Mutation),
    JSON: {
        __serialize(value) {
            return graphql_type_json_1.GraphQLJSON.parseValue(value);
        }
    }
};
exports.InitResolver = initResolver;
//# sourceMappingURL=resolver.js.map