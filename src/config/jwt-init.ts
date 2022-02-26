import jwt from 'jsonwebtoken';

class JWTInit {

    signToken(user) {
        const expiresIn = 1000 * 60 * 10;
        const secret = process.env.JWT_SECRET;
        const dataStore = {
            user: user._id
        }
        return jwt.sign(dataStore, secret, {expiresIn});
    }

    verifyToken(token) {
        const secret = process.env.JWT_SECRET;
        return jwt.verify(token, secret);
    }

}

export default new JWTInit();