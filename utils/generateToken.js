import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// This function generates a JSON Web Token (JWT) for a given user_id and sets it as a cookie in the response.
export const generateTokenAndSetCookie = (res, user_id) => {
    // Sign a JWT with the user_id and a secret key, set to expire in 30 days.
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    // Set the JWT as a cookie in the response, with security features to prevent XSS and ensure it's sent over HTTPS in development.
    res.cookie('jwt', token, {
        httpOnly: true, // prevent XSS
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        secure: process.env.NODE_ENV === 'development',
    });
};


// This function generates a JWT token with a payload and an expiration time of 24 hours.
export const genToken = (payload) => jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    data: payload
}, process.env.JWT_SECRET)

// This function extracts the token from the socket handshake and verifies it.
// If the token is valid, it sets the current user in the socket.
export const tokenFromSocket = async (socket,next)=>{
    let user = "blank"
    let token = socket.handshake.query.token
    if(token){
        try{
            user = jwt.verify(token,process.env.JWT_SECRET)
            socket.currentUser = user.data
        }catch(err){
            next(new Error("Handshake Error"))
        }
        next()
    }else{
        next(new Error("Token is required"))
    }
}
