import session from 'express-session';
import {createClient} from 'redis';
import connectRedis from 'connect-redis';
import {promisify} from 'util';

class RedisStore {

    app;

    constructor(app) {
        this.app = app;
    }

    connectStore() {
        const RedisStoreInit = connectRedis(session);

        const redisClient = createClient({
            url: process.env.REDIS_URL
        })

        redisClient.on('error', function (err) {
            console.log('Could not establish a connection with redis. ' + err);
        });

        redisClient.on('connect', function (err) {
            console.log('Redis connected successfully. ');
        });

        redisClient.connect().then(r => {
        });

        this.app.use(session({
            store: new RedisStoreInit({client: redisClient}),
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

export default RedisStore;