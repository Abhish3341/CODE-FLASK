const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/Users");
const authMiddleware = require('../middleware/auth');
const { sendResetEmail } = require('../utils/emailService');
const router = express.Router();

// Add this debug line at the top of the file
console.log('User model:', typeof User, User);

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Add after the destructuring in register route
        if (!password || password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters long"
            });
        }

        // Add after password validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Please provide a valid email address"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.googleId) {
                return res.status(400).json({ 
                    error: "This email is already registered with Google. Please use Google Sign In."
                });
            }
            return res.status(400).json({ 
                error: "Email already registered. Please login or use a different email."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Return user data (excluding password) and token
        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        };

        res.status(201).json({
            user: userResponse,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        // If user doesn't exist, return registration message
        if (!user) {
            return res.status(401).json({
                error: "You are not registered. Please register first."
            });
        }

        // Check if user registered through Google
        if (user.googleId) {
            return res.status(401).json({
                error: "This email is registered with Google. Please use Google Sign In."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid password. Please try again."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Return user data and token
        res.json({
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                picture: user.picture || ''
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Google OAuth Route
router.post('/google', async (req, res) => {
    try {
        // Add debug logging
        console.log('Received Google OAuth data:', req.body);

        const { email, given_name, family_name, picture, sub } = req.body;

        // Validate required fields
        if (!email || !given_name || !family_name) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { email, given_name, family_name }
            });
        }

        // Add this debug line
        console.log('Looking for existing user with email:', email);

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Check if the user was originally registered with Google
            if (!existingUser.googleId) {
                return res.status(400).json({
                    error: "This email is already registered. Please login with email and password instead of Google Sign In."
                });
            }

            console.log('Existing Google user found:', existingUser.email);
            const token = jwt.sign(
                { id: existingUser._id, email: existingUser.email },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                user: {
                    id: existingUser._id,
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname,
                    email: existingUser.email,
                    picture: existingUser.picture || ''
                },
                token
            });
        }

        // Create new user for Google OAuth
        const newUser = await User.create({
            firstname: given_name,
            lastname: family_name,
            email: email,
            picture: picture || '',
            googleId: sub,
            password: await bcrypt.hash(Math.random().toString(36), 10)
        });

        console.log('New user created:', newUser.email);

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                picture: newUser.picture || ''
            },
            token
        });
    } catch (error) {
        console.error('Detailed Google OAuth error:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.googleId) {
            return res.json({
                message: 'If an account exists with this email, you will receive password reset instructions.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        await sendResetEmail(email, resetToken);

        res.json({
            message: 'If an account exists with this email, you will receive password reset instructions.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

