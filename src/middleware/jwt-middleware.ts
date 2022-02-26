import JWTInit from '../config/jwt-init';
import {Request, Response} from "express";
import UserSchema from "../database/models/user";

class TokenAuthVerification {


    constructor() {
    }

    async verifyUserAuthToken(req: Request, res: Response, next) {
        // endpoints that can be called publicly
        let skipRoute = [
            '/search-fixtures'
        ];

        let currentUrl = req.path;

        if (skipRoute.includes(currentUrl)) {
            return next();
        }

        let authHeader = req.header('authorization');

        if (!authHeader)
            return res.status(401).send({'message': 'Authorization Failed'});

        // get authentication token
        let parts = req.headers.authorization.split(' ')

        if (parts.length !== 2)
            return res.status(401).send({'message': 'Authorization Failed'});

        let schema = parts[0];
        let token = parts[1];

        if (!/^Bearer/i.test(schema))
            return res.status(401).send({'message': 'Authorization Failed'});

        let verifyJWT = JWTInit.verifyToken(token);

        if (!verifyJWT)
            return res.status(401).send({'message': 'Authorization Failed'});

        let userAccount = await UserSchema.findOne({_id: verifyJWT['user']});

        if (!userAccount)
            return res.status(401).send({'message': 'Authorization Failed'});

        req['user'] = userAccount;

        next();
    }


}

export default new TokenAuthVerification();