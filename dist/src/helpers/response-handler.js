"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
class ResponseHandler {
    successResponse(message, data) {
        return data;
        // return {
        //     message,
        //     data,
        //     statusCode: 200
        // };
    }
    errorResponse(message, data, errorCode = 400) {
        if (errorCode == 422 || errorCode == 400) {
            throw new apollo_server_express_1.UserInputError(message);
        }
        throw new Error(message);
    }
}
exports.default = new ResponseHandler();
//# sourceMappingURL=response-handler.js.map