import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, user_id) => {
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, // prevent XSS
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'development',
    });
};


export const genToken = (payload) => jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    data: payload
}, process.env.JWT_SECRET)

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
