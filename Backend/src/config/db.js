const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log("MONGODB CONNECTED SUCCESSFULLY");

    } catch (error) {
        console.log("MONGODB CONNECTION FAILED", error.message);
        process.exit(1)
    }
}

module.exports = connectDB