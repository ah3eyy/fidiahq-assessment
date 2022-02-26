import chai from "chai";
import 'dotenv/config'
import mocha from 'mocha';
import request from "supertest";


const url = `http://localhost:${process.env.PORT}/`;
console.log(url);
const requestU = request(url);
const expect = chai.expect;

describe('GraphQL', () => {
    it('Registration successful', (done) => {
        requestU.post('/')
            .send({mutation: '{registerUser(email: "abtech247@gmail.com", password: "testbakinde", phone_number: "08147645670", full_name: "Abiodun Test", country: "Nigeria")}'})
            .expect(400)
            .then((res) => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    })

    it('Fetch all users', (done) => {
        requestU.post('/')
            .send({query: '{allUsers(page_number: 1)}'})
            .expect(200)
            .then((res) => {
                res.body.data.allUsers.users.isArray([])
                done()
            })
            .catch((err) => {
                done(err);
            });
    })
});