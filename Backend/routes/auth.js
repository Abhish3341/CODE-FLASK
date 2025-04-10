const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Rate limiting for password changes
const passwordChangeAttempts = new Map();

const checkPasswordStrength = (password) => {
  const minLength = 8;
  const maxLength = 128;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters long`);
  if (password.length > maxLength) errors.push(`Password must be less than ${maxLength} characters`);
  if (!hasUpperCase) errors.push("Password must contain at least one uppercase letter");
  if (!hasLowerCase) errors.push("Password must contain at least one lowercase letter");
  if (!hasNumbers) errors.push("Password must contain at least one number");
  if (!hasSpecialChar) errors.push("Password must contain at least one special character");

  return errors;
};

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
            { 
                id: user._id, 
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            },
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
                picture: user.picture || '',
                isFirstLogin: user.isFirstLogin
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Change Password Route
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Rate limiting check
        const now = Date.now();
        const userAttempts = passwordChangeAttempts.get(userId) || [];
        const recentAttempts = userAttempts.filter(timestamp => now - timestamp < 3600000); // Last hour

        if (recentAttempts.length >= 3) {
            return res.status(429).json({
                error: "Too many password change attempts. Please try again later."
            });
        }

        // Update attempts
        passwordChangeAttempts.set(userId, [...recentAttempts, now]);

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Check password strength
        const passwordErrors = checkPasswordStrength(newPassword);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ errors: passwordErrors });
        }

        // Check if new password matches any of the last 3 passwords
        if (user.previousPasswords) {
            for (const oldHash of user.previousPasswords.slice(-3)) {
                const matches = await bcrypt.compare(newPassword, oldHash);
                if (matches) {
                    return res.status(400).json({
                        error: "Cannot reuse any of your last 3 passwords"
                    });
                }
            }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and password history
        user.previousPasswords = user.previousPasswords || [];
        user.previousPasswords.push(user.password);
        if (user.previousPasswords.length > 5) {
            user.previousPasswords = user.previousPasswords.slice(-5);
        }
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check password strength
        const passwordErrors = checkPasswordStrength(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ errors: passwordErrors });
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
            isFirstLogin: true,
            profileUpdates: {
                count: 0
            },
            previousPasswords: [hashedPassword]
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Return user data (excluding password) and token
        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            isFirstLogin: true
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

// Google OAuth Route
router.post('/google', async (req, res) => {
    try {
        const { email, given_name, family_name, picture, sub } = req.body;

        // Validate required fields
        if (!email || !given_name || !family_name) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { email, given_name, family_name }
            });
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Check if the user was originally registered with Google
            if (!existingUser.googleId) {
                return res.status(400).json({
                    error: "This email is already registered. Please login with email and password instead of Google Sign In."
                });
            }

            const token = jwt.sign(
                { 
                    id: existingUser._id, 
                    email: existingUser.email,
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname
                },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                user: {
                    id: existingUser._id,
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname,
                    email: existingUser.email,
                    picture: existingUser.picture || '',
                    isFirstLogin: existingUser.isFirstLogin
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
            password: await bcrypt.hash(Math.random().toString(36), 10),
            isFirstLogin: true,
            profileUpdates: {
                count: 0
            }
        });

        const token = jwt.sign(
            { 
                id: newUser._id, 
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                picture: newUser.picture || '',
                isFirstLogin: true
            },
            token
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { firstname, lastname, email } = req.body;

        // For first update after registration
        if (user.isFirstLogin) {
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.isFirstLogin = false;
            user.profileUpdates.count = 0;
            await user.save();

            const token = jwt.sign(
                { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                message: "Profile updated successfully",
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    isFirstLogin: false
                },
                token
            });
        }

        // Check update limit for subsequent updates
        if (user.profileUpdates.count >= 3) {
            return res.status(403).json({
                error: "You have reached the maximum number of profile updates"
            });
        }

        // Update profile
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.profileUpdates.count += 1;
        user.profileUpdates.lastUpdate = new Date();
        await user.save();

        // Generate new token with updated info
        const token = jwt.sign(
            { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Profile updated successfully",
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isFirstLogin: false
            },
            remainingUpdates: 3 - user.profileUpdates.count,
            token
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isFirstLogin: user.isFirstLogin,
                profileUpdates: {
                    count: user.profileUpdates.count,
                    remaining: 3 - user.profileUpdates.count
                }
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

module.exports = router;