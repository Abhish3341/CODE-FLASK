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
    githubId: {
        type: String,
        sparse: true,
    },
    githubUsername: String,
    githubAccessToken: String,
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
    },
    // Add authentication method tracking
    authMethod: {
        type: String,
        enum: ['email', 'google', 'github'],
        default: 'email'
    },
    // Track if user is OAuth user
    isOAuthUser: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save middleware to set auth method and OAuth status
userSchema.pre('save', function(next) {
    // Determine authentication method based on OAuth IDs
    if (this.googleId && !this.githubId) {
        this.authMethod = 'google';
        this.isOAuthUser = true;
    } else if (this.githubId && !this.googleId) {
        this.authMethod = 'github';
        this.isOAuthUser = true;
    } else if (this.googleId && this.githubId) {
        // If both exist, prioritize the most recent one
        // This shouldn't happen in normal flow, but just in case
        this.authMethod = this.githubId ? 'github' : 'google';
        this.isOAuthUser = true;
    } else {
        this.authMethod = 'email';
        this.isOAuthUser = false;
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;