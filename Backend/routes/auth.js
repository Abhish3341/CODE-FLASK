const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const auth = require('../middleware/authMiddleware');
const axios = require('axios');
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

// Enhanced email conflict checking function
const checkEmailConflicts = async (email, excludeUserId = null) => {
  const query = excludeUserId ? { email, _id: { $ne: excludeUserId } } : { email };
  const existingUser = await User.findOne(query);
  
  if (!existingUser) {
    return { hasConflict: false };
  }

  // Determine the authentication method of the existing user
  let existingAuthMethod = 'email';
  if (existingUser.googleId) {
    existingAuthMethod = 'google';
  } else if (existingUser.githubId) {
    existingAuthMethod = 'github';
  }

  return {
    hasConflict: true,
    existingAuthMethod,
    conflictMessage: getConflictMessage(existingAuthMethod)
  };
};

const getConflictMessage = (authMethod) => {
  switch (authMethod) {
    case 'google':
      return 'This email is already registered with Google OAuth. Please use Google Sign In or choose a different email address.';
    case 'github':
      return 'This email is already registered with GitHub OAuth. Please use GitHub Sign In or choose a different email address.';
    case 'email':
      return 'This email is already registered with email/password authentication. Please sign in with your password or choose a different email address.';
    default:
      return 'This email is already registered. Please use the appropriate sign-in method or choose a different email address.';
  }
};

// Get user profile with OAuth information
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -previousPasswords');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine authentication method and OAuth status
    let authMethod = 'email';
    let isOAuthUser = false;

    if (user.googleId) {
      authMethod = 'google';
      isOAuthUser = true;
    } else if (user.githubId) {
      authMethod = 'github';
      isOAuthUser = true;
    }

    // Include OAuth status and auth method in response
    const userProfile = {
      ...user.toObject(),
      isOAuthUser,
      authMethod,
      canEditEmail: !isOAuthUser // Can only edit email if not OAuth user
    };

    console.log('👤 Profile response:', {
      id: user._id,
      email: user.email,
      authMethod,
      isOAuthUser,
      hasGoogleId: !!user.googleId,
      hasGithubId: !!user.githubId
    });

    res.json({ user: userProfile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile with enhanced email conflict checking
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    const userId = req.user.id;

    console.log('📝 Profile update request:', { userId, firstname, lastname, email });

    // Validate required fields
    if (!firstname || !lastname || !email) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'All fields (firstname, lastname, email) are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({ 
        error: 'Please enter a valid email address' 
      });
    }

    // Find user and check if it exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine authentication method
    let authMethod = 'email';
    let isOAuthUser = false;

    if (user.googleId) {
      authMethod = 'google';
      isOAuthUser = true;
    } else if (user.githubId) {
      authMethod = 'github';
      isOAuthUser = true;
    }

    console.log('👤 Current user:', { 
      id: user._id, 
      email: user.email, 
      isOAuthUser, 
      authMethod,
      hasGoogleId: !!user.googleId,
      hasGithubId: !!user.githubId
    });

    // Check if user is trying to change email and is OAuth user
    if (email !== user.email && isOAuthUser) {
      console.log('🚫 OAuth user trying to change email');
      const providerName = authMethod === 'google' ? 'Google' : 'GitHub';
      return res.status(403).json({ 
        error: `Email cannot be changed for ${providerName} OAuth accounts. Your email is managed by ${providerName}.`,
        isOAuthRestriction: true,
        authMethod
      });
    }

    // Enhanced email conflict checking (only if email is being changed)
    if (email !== user.email) {
      console.log('🔍 Checking email conflicts for email change...');
      const conflictCheck = await checkEmailConflicts(email, userId);
      
      if (conflictCheck.hasConflict) {
        console.log('❌ Email conflict detected:', conflictCheck.existingAuthMethod);
        return res.status(400).json({ 
          error: conflictCheck.conflictMessage,
          conflictType: 'email_already_exists',
          existingAuthMethod: conflictCheck.existingAuthMethod
        });
      }
    }

    // Update user profile
    user.firstname = firstname;
    user.lastname = lastname;
    
    // Only update email if user is not OAuth user
    if (!isOAuthUser) {
      user.email = email;
    }

    // Increment profile updates count if not first login
    if (!user.isFirstLogin) {
      user.profileUpdates.count = (user.profileUpdates.count || 0) + 1;
      user.profileUpdates.lastUpdate = new Date();
    } else {
      user.isFirstLogin = false;
    }

    await user.save();
    console.log('✅ Profile updated successfully');

    // Generate new token with updated information
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

    res.json({
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isFirstLogin: user.isFirstLogin,
        isOAuthUser,
        authMethod,
        canEditEmail: !isOAuthUser,
        profileUpdates: {
          count: user.profileUpdates.count,
          lastUpdate: user.profileUpdates.lastUpdate
        }
      },
      token,
      remainingUpdates: 3 - (user.profileUpdates.count || 0)
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Enhanced User Login Route with email conflict checking
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔐 Login attempt for email:', email);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found for email:', email);
            return res.status(401).json({
                error: "No account found with this email address. Please register first or check your email."
            });
        }

        // Enhanced OAuth conflict checking
        if (user.googleId && !user.githubId) {
            console.log('🚫 Email registered with Google OAuth only');
            return res.status(401).json({
                error: "This email is registered with Google OAuth. Please use Google Sign In.",
                authMethod: 'google',
                conflictType: 'oauth_conflict'
            });
        }

        if (user.githubId && !user.googleId) {
            console.log('🚫 Email registered with GitHub OAuth only');
            return res.status(401).json({
                error: "This email is registered with GitHub OAuth. Please use GitHub Sign In.",
                authMethod: 'github',
                conflictType: 'oauth_conflict'
            });
        }

        if (user.googleId && user.githubId) {
            console.log('🚫 Email registered with both OAuth providers');
            return res.status(401).json({
                error: "This email is registered with OAuth providers. Please use Google or GitHub Sign In.",
                authMethod: 'oauth',
                conflictType: 'multiple_oauth_conflict'
            });
        }

        // Verify this is an email/password account
        if (!user.password) {
            console.log('🚫 Account exists but no password set (OAuth account)');
            return res.status(401).json({
                error: "This account was created with OAuth. Please use the appropriate OAuth sign-in method.",
                conflictType: 'oauth_account_no_password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('❌ Invalid password for email:', email);
            return res.status(401).json({
                error: "Invalid password. Please try again."
            });
        }

        console.log('✅ Successful email/password login for:', email);

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

        res.json({
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                picture: user.picture || '',
                isFirstLogin: user.isFirstLogin,
                isOAuthUser: false,
                authMethod: 'email',
                canEditEmail: true
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

        const now = Date.now();
        const userAttempts = passwordChangeAttempts.get(userId) || [];
        const recentAttempts = userAttempts.filter(timestamp => now - timestamp < 3600000);

        if (recentAttempts.length >= 3) {
            return res.status(429).json({
                error: "Too many password change attempts. Please try again later."
            });
        }

        passwordChangeAttempts.set(userId, [...recentAttempts, now]);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Determine if user is OAuth user
        const isOAuthUser = !!(user.googleId || user.githubId);
        const authMethod = user.googleId ? 'google' : user.githubId ? 'github' : 'email';

        // Check if OAuth user is trying to change password
        if (isOAuthUser) {
            const providerName = authMethod === 'google' ? 'Google' : 'GitHub';
            return res.status(403).json({
                error: `Password cannot be changed for ${providerName} OAuth accounts. Your password is managed by ${providerName}.`,
                isOAuthRestriction: true,
                authMethod
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const passwordErrors = checkPasswordStrength(newPassword);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ errors: passwordErrors });
        }

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

        const hashedPassword = await bcrypt.hash(newPassword, 10);

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

// Enhanced User Registration Route with email conflict checking
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        console.log('📝 Registration attempt for email:', email);

        const passwordErrors = checkPasswordStrength(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ errors: passwordErrors });
        }

        // Enhanced email conflict checking
        const conflictCheck = await checkEmailConflicts(email);
        
        if (conflictCheck.hasConflict) {
            console.log('❌ Email conflict during registration:', conflictCheck.existingAuthMethod);
            return res.status(400).json({ 
                error: conflictCheck.conflictMessage,
                conflictType: 'email_already_exists',
                existingAuthMethod: conflictCheck.existingAuthMethod
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            isFirstLogin: true,
            authMethod: 'email',
            isOAuthUser: false,
            profileUpdates: {
                count: 0
            },
            previousPasswords: [hashedPassword]
        });

        console.log('✅ Successful registration for email:', email);

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

        const userResponse = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            isFirstLogin: true,
            isOAuthUser: false,
            authMethod: 'email',
            canEditEmail: true
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

// Enhanced GitHub OAuth callback with email conflict checking
router.post('/github/callback', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('🔐 GitHub OAuth callback initiated');

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!tokenResponse.data.access_token) {
      console.error('GitHub token response:', tokenResponse.data);
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    const accessToken = tokenResponse.data.access_token;

    // Get user data from GitHub
    const [userResponse, emailsResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    ]);

    const primaryEmail = emailsResponse.data.find(email => email.primary)?.email;

    if (!primaryEmail) {
      return res.status(400).json({ error: 'No primary email found in GitHub account' });
    }

    console.log('📧 GitHub OAuth email:', primaryEmail);

    // Enhanced email conflict checking
    const conflictCheck = await checkEmailConflicts(primaryEmail);
    
    if (conflictCheck.hasConflict) {
      console.log('❌ GitHub OAuth email conflict:', conflictCheck.existingAuthMethod);
      
      // Special handling for existing GitHub users
      if (conflictCheck.existingAuthMethod === 'github') {
        // Allow existing GitHub user to sign in
        const existingUser = await User.findOne({ email: primaryEmail });
        if (existingUser && existingUser.githubId) {
          console.log('✅ Existing GitHub user signing in');
          // Update access token and proceed with login
          existingUser.githubAccessToken = accessToken;
          await existingUser.save();
          
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
              isFirstLogin: existingUser.isFirstLogin,
              isOAuthUser: true,
              authMethod: 'github',
              canEditEmail: false
            },
            token
          });
        }
      }
      
      // For other conflicts, return error
      return res.status(400).json({ 
        error: `Cannot sign in with GitHub. ${conflictCheck.conflictMessage}`,
        conflictType: 'email_already_exists',
        existingAuthMethod: conflictCheck.existingAuthMethod
      });
    }

    // Create new user if no conflicts
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    const user = await User.create({
      firstname: userResponse.data.name ? userResponse.data.name.split(' ')[0] : userResponse.data.login,
      lastname: userResponse.data.name ? userResponse.data.name.split(' ').slice(1).join(' ') : '',
      email: primaryEmail,
      password: hashedPassword,
      previousPasswords: [hashedPassword],
      picture: userResponse.data.avatar_url,
      githubId: userResponse.data.id.toString(),
      githubUsername: userResponse.data.login,
      githubAccessToken: accessToken,
      authMethod: 'github',
      isOAuthUser: true,
      isFirstLogin: true,
      profileUpdates: {
        count: 0
      }
    });
    
    console.log('✅ Created new GitHub OAuth user');

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

    console.log('🔑 GitHub OAuth response:', {
      userId: user._id,
      email: user.email,
      authMethod: 'github',
      isOAuthUser: true
    });

    res.json({
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        picture: user.picture || '',
        isFirstLogin: user.isFirstLogin,
        isOAuthUser: true,
        authMethod: 'github',
        canEditEmail: false
      },
      token
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    const errorMessage = error.response?.data?.message || error.message;
    res.status(500).json({ 
      error: "Failed to authenticate with GitHub",
      details: errorMessage
    });
  }
});

// Enhanced Google OAuth Route with email conflict checking
router.post('/google', async (req, res) => {
    try {
        const { email, given_name, family_name, picture, sub } = req.body;

        if (!email || !given_name || !family_name) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { email, given_name, family_name }
            });
        }

        console.log('🔐 Google OAuth attempt for email:', email);

        // Enhanced email conflict checking
        const conflictCheck = await checkEmailConflicts(email);
        
        if (conflictCheck.hasConflict) {
            console.log('❌ Google OAuth email conflict:', conflictCheck.existingAuthMethod);
            
            // Special handling for existing Google users
            if (conflictCheck.existingAuthMethod === 'google') {
                // Allow existing Google user to sign in
                const existingUser = await User.findOne({ email });
                if (existingUser && existingUser.googleId) {
                    console.log('✅ Existing Google user signing in');
                    
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
                            isFirstLogin: existingUser.isFirstLogin,
                            isOAuthUser: true,
                            authMethod: 'google',
                            canEditEmail: false
                        },
                        token
                    });
                }
            }
            
            // For other conflicts, return error
            return res.status(400).json({ 
                error: `Cannot sign in with Google. ${conflictCheck.conflictMessage}`,
                conflictType: 'email_already_exists',
                existingAuthMethod: conflictCheck.existingAuthMethod
            });
        }

        // Create new user if no conflicts
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        const user = await User.create({
            firstname: given_name,
            lastname: family_name,
            email: email,
            password: hashedPassword,
            previousPasswords: [hashedPassword],
            picture: picture || '',
            googleId: sub,
            authMethod: 'google',
            isOAuthUser: true,
            isFirstLogin: true,
            profileUpdates: {
                count: 0
            }
        });
        
        console.log('✅ Created new Google OAuth user');

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

        console.log('🔑 Google OAuth response:', {
          userId: user._id,
          email: user.email,
          authMethod: 'google',
          isOAuthUser: true
        });

        res.json({
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                picture: user.picture || '',
                isFirstLogin: user.isFirstLogin,
                isOAuthUser: true,
                authMethod: 'google',
                canEditEmail: false
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

module.exports = router;