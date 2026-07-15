const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

const sanitizeUser = (user) => {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};


// REGISTER USER SERVICE FUNCTION
const register = async ({ name, email, password, role, department }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }

    const user = await User.create({ name, email, password, role, department });
    const token = generateToken(user._id);

    return { user: sanitizeUser(user), token };
};



// LOGIN USER SERVICE FUNCTION
const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    return { user: sanitizeUser(user), token };
};



// GET USER SERVICE FUNCTION
const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return { user };
};



module.exports = { register, login, getMe };