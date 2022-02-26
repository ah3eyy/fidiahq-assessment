"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class DatabaseConnection {
    constructor() {
        this.uri = process.env.MONGO_URI;
    }
    connect() {
        mongoose_1.default.connect(this.uri, {})
            .then(response => {
            console.log('Database connected');
        })
            .catch(error => {
            console.log(error);
            console.log('Database connection failed');
        });
    }
}
exports.default = new DatabaseConnection();
//# sourceMappingURL=database-init.js.map