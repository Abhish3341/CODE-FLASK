const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Problem = require('../models/Problems');
const UserStats = require('../models/UserStats');

// Get all problems with user's solve status
router.get('/', authMiddleware, async (req, res) => {
    try {
        const problems = await Problem.find();
        const userStats = await UserStats.findOne({ userId: req.user.id });
        
        const problemsWithStatus = problems.map(problem => ({
            id: problem._id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            acceptance: problem.acceptance,
            submissions: problem.totalSubmissions,
            solved: userStats?.solvedProblems?.includes(problem._id) || false
        }));

        res.json(problemsWithStatus);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

// Get user stats
router.get('/user/stats', authMiddleware, async (req, res) => {
    try {
        const userStats = await UserStats.findOne({ userId: req.user.id });
        const totalProblems = await Problem.countDocuments();
        
        res.json({
            problemsSolved: userStats?.problemsSolved || 0,
            totalProblems,
            successRate: userStats?.successRate || 0,
            averageTime: userStats?.averageTime || 0,
            ranking: userStats?.rank || 0
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

module.exports = router;