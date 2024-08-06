import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, user_id) => {
    const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, // prevent XSS
        samesite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'development',
    });
};