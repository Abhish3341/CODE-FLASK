const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        sparse: true,
    },
    resetToken: String,
    resetTokenExpiry: Date
}, {
    timestamps: true
});

// Make sure to export the model properly
const User = mongoose.model('User', userSchema);
module.exports = User;