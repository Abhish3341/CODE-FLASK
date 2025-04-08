const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserStats = require('../models/UserStats');
const Activity = require('../models/Activity');
const Problem = require('../models/Problems');

router.get('/', authMiddleware, async (req, res) => {
    try {
        // Get user stats
        const stats = await UserStats.findOne({ userId: req.user.id }) || {
            rank: 0,
            problemsSolved: 0,
            totalSubmissions: 0,
            timeSpent: 0
        };

        // Get recent activity
        const recentActivity = await Activity.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(3);

        // Get recommended problems
        const recommendedProblems = await Problem.find()
            .sort({ acceptance: -1 })
            .limit(3);

        res.json({
            stats,
            recentActivity,
            recommendedProblems
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;