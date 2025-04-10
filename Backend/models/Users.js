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
    previousPasswords: {
        type: [String],
        default: []
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
    resetTokenExpiry: Date,
    profileUpdates: {
        count: {
            type: Number,
            default: 0
        },
        lastUpdate: {
            type: Date
        }
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    passwordChangeAttempts: {
        count: {
            type: Number,
            default: 0
        },
        lastAttempt: {
            type: Date
        }
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;