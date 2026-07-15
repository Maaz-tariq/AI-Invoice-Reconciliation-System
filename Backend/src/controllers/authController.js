const authService = require('../services/authService');


//THIS CONTROLLER FUNCTION CALL REGISTER AUTH SERVICE
const register = async (req, res, next) => {
    try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};



// THIS CONTROLLER FUNCTION CALL LOGIN AUTH SERVICE
const login = async (req, res, next) => {
    try {
        const { user, token } = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};



// THIS CONTROLLER FUNCTION CALLS GETME AUTH SERVICE 
const getMe = async (req, res, next) => {
    try {
        const { user } = await authService.getMe(req.user.id);
        res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };