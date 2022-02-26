import 'dotenv/config'
import {ApolloServer, gql} from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginSchemaReporting
} from 'apollo-server-core';
import {makeExecutableSchema} from '@graphql-tools/schema';
import express from 'express';
import * as http from 'http';
import DatabaseConnection from './database/database-init'

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
import typeDefs from "./graphql/typeDefs";
import {InitResolver} from "./graphql/resolvers/resolver";

class StartApolloServer {

    async initServer() {
        const schema = makeExecutableSchema({typeDefs, resolvers: InitResolver});
        const httpServer = server;
        const apolloServer = new ApolloServer({
            schema,
            context: ({req}) => ({
                req
            }),
            plugins: [
                ApolloServerPluginDrainHttpServer({httpServer}),
                ApolloServerPluginSchemaReporting(),
                ApolloServerPluginLandingPageGraphQLPlayground(),
            ]
        });

        await apolloServer.start();

        apolloServer.applyMiddleware({
            app,
            path: '/'
        });

        httpServer.listen({port: process.env.PORT || port});

        DatabaseConnection.connect();
    }
}


new StartApolloServer().initServer().then();