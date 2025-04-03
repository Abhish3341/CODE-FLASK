const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
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

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

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

        res.json({
            user: userResponse,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GitHub OAuth callback
router.post('/github/callback', async (req, res) => {
    const { code, state } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Missing 'code' parameter" });
    }

    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.FRONTEND_URL + '/auth/github/callback',
                state
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        if (tokenResponse.data.error) {
            return res.status(400).json({
                error: "GitHub API error",
                details: tokenResponse.data
            });
        }

        const accessToken = tokenResponse.data.access_token;
        if (accessToken) {
            res.json({ accessToken });
        } else {
            res.status(400).json({ error: "Failed to retrieve access token" });
        }
    } catch (error) {
        console.error("GitHub OAuth error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;