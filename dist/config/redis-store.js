"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
class RedisStore {
    constructor(app) {
        this.app = app;
    }
    connectStore() {
        const RedisStoreInit = (0, connect_redis_1.default)(express_session_1.default);
        const redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL
        });
        redisClient.on('error', function (err) {
            console.log('Could not establish a connection with redis. ' + err);
        });
        redisClient.on('connect', function (err) {
            console.log('Redis connected successfully. ');
        });
        redisClient.connect().then(r => {
        });
        this.app.use((0, express_session_1.default)({
            store: new RedisStoreInit({ client: redisClient }),
            secret: process.env.REDIS_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: false,
                maxAge: 1000 * 60 * 10
            }
        }));
        return redisClient;
    }
}
exports.default = RedisStore;
//# sourceMappingURL=redis-store.js.map