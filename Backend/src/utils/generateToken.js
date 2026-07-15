const jwt = require('jsonwebtoken') 

const generateToken = (userId) => {
    return jwt.sign(
        {id : userId},
        process.env.JWT_SECRET_KEY,
        {expiresIn : process.env.JWT_EXPIRES }
    )
}

module.exports = generateToken