"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    successResponse(message, data) {
        return {
            message,
            data,
            statusCode: 200
        };
    }
    errorResponse(message, data, errorCode = 400) {
        return {
            message,
            data,
            statusCode: errorCode
        };
    }
}
exports.default = new ResponseHandler();
//# sourceMappingURL=response-handler.js.map