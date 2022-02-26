import {Response} from "express";
import RedisStore from "../config/redis-store";
import {UserInputError} from "apollo-server-express";

class ResponseHandler {

    successResponse(message: string, data: any) {
        return data;
        // return {
        //     message,
        //     data,
        //     statusCode: 200
        // };
    }

    errorResponse(message: string, data: any, errorCode = 400) {
        if(errorCode == 422 || errorCode == 400) {
            throw new UserInputError(message);
        }


        throw new Error(message);
    }

}

export default new ResponseHandler();