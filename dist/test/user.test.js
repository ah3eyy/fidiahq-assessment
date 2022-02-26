"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
require("dotenv/config");
const supertest_1 = __importDefault(require("supertest"));
const url = `http://localhost:${process.env.PORT}/`;
console.log(url);
const requestU = (0, supertest_1.default)(url);
const expect = chai_1.default.expect;
describe('GraphQL', () => {
    it('Registration successful', (done) => {
        requestU.post('/')
            .send({ mutation: '{registerUser(email: "abtech247@gmail.com", password: "testbakinde", phone_number: "08147645670", full_name: "Abiodun Test", country: "Nigeria")}' })
            .expect(400)
            .then((res) => {
            done();
        })
            .catch((err) => {
            console.log(err);
            done(err);
        });
    });
    it('Fetch all users', (done) => {
        requestU.post('/')
            .send({ query: '{allUsers(page_number: 1)}' })
            .expect(200)
            .then((res) => {
            res.body.data.allUsers.users.isArray([]);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
});
//# sourceMappingURL=user.test.js.map