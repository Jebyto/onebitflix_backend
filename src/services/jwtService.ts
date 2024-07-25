import jwt from 'jsonwebtoken'

const secret = 'secret';

export const jwtService = {
    signToken: (payload: string | object | Buffer, 
        expiration: string
    ) => {
        return jwt.sign(payload, secret, {
            expiresIn: expiration
        });
    }
}