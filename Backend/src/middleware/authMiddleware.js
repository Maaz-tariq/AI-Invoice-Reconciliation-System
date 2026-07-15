const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');


//  PROTECT MIDDLEWARE CHECK THE HEADER AUTHORIZATION - VERIFY WHETHER THE USER WITH THAT TOKEN EXIST  
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Not authorized, no token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            // JWT VERIFY RETURNS PAYLOAD, WHICH CONSIST USERID, ROLE, EXPIRY AND THINGS LIKE THAT
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError('Token expired, please log in again', 401);
            }
            throw new AppError('Invalid token', 401);
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new AppError('User belonging to this token no longer exists', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = protect;