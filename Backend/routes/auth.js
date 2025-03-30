const express = require("express");
const axios = require("axios");
const router = express.Router();

// Use router.post instead of app.post
router.post('/api/auth/github/callback', async (req, res) => {
    const { code, state } = req.body;

    // Log the incoming request
    console.log("Received GitHub callback request:", { code, state });

    if (!code) {
        return res.status(400).json({ error: "Missing 'code' parameter" });
    }

    try {
        // Verify environment variables
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
            console.error("Missing GitHub OAuth credentials in environment variables");
            return res.status(500).json({ error: "Server configuration error" });
        }

        console.log("Exchanging code for access token...");
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:5173/auth/github/callback',
                state
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );

        console.log("GitHub response:", tokenResponse.data);

        if (tokenResponse.data.error) {
            console.error("GitHub API error:", tokenResponse.data);
            return res.status(400).json({
                error: "GitHub API error",
                details: tokenResponse.data
            });
        }

        const accessToken = tokenResponse.data.access_token;
        if (accessToken) {
            res.json({ accessToken });
        } else {
            console.error("No access token in response:", tokenResponse.data);
            res.status(400).json({
                error: "Failed to retrieve access token",
                details: tokenResponse.data
            });
        }
    } catch (error) {
        console.error("Error during GitHub OAuth callback:", {
            message: error.message,
            response: error.response?.data
        });
        res.status(500).json({
            error: "Internal server error",
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;