"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const schema_1 = require("@graphql-tools/schema");
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const database_init_1 = __importDefault(require("./database/database-init"));
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = 3000;
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const resolver_1 = require("./graphql/resolvers/resolver");
class StartApolloServer {
    initServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.default, resolvers: resolver_1.InitResolver });
            const httpServer = server;
            const apolloServer = new apollo_server_express_1.ApolloServer({
                schema,
                context: ({ req }) => ({
                    req
                }),
                plugins: [
                    (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                    (0, apollo_server_core_1.ApolloServerPluginSchemaReporting)(),
                    (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
                ]
            });
            yield apolloServer.start();
            apolloServer.applyMiddleware({
                app,
                path: '/'
            });
            httpServer.listen({ port: process.env.PORT || port });
            database_init_1.default.connect();
        });
    }
}
new StartApolloServer().initServer().then();
//# sourceMappingURL=app.js.map