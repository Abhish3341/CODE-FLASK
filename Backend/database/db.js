const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connection successful");
    } catch (error) {
        console.log("Database connection failed, error: " + error);
    }

};

module.exports = { DBConnection };