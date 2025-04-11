const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Problem = require('../models/Problems');
const UserStats = require('../models/UserStats');
const Activity = require('../models/Activity');

// Get all problems with user's solve status
router.get('/', authMiddleware, async (req, res) => {
    try {
        const problems = await Problem.find().select('title difficulty category acceptance totalSubmissions');
        const userActivities = await Activity.find({ 
            userId: req.user.id,
            type: 'solved'
        });
        
        const solvedProblemIds = userActivities.map(activity => activity.problemId);
        
        const problemsWithStatus = problems.map(problem => ({
            id: problem._id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            acceptance: problem.acceptance,
            submissions: problem.totalSubmissions,
            solved: solvedProblemIds.includes(problem._id.toString())
        }));

        res.json(problemsWithStatus);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

// Get specific problem details
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ error: 'Failed to fetch problem' });
    }
});

// Get user stats
router.get('/user/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get or create user stats
        let userStats = await UserStats.findOne({ userId });
        if (!userStats) {
            userStats = await UserStats.create({
                userId,
                rank: 0,
                problemsSolved: 0,
                totalSubmissions: 0,
                timeSpent: 0
            });
        }

        // Get total problems count
        const totalProblems = await Problem.countDocuments();

        // Calculate success rate
        const successRate = userStats.totalSubmissions > 0
            ? Math.round((userStats.problemsSolved / userStats.totalSubmissions) * 100)
            : 0;

        // Calculate average time per problem (in minutes)
        const averageTime = userStats.problemsSolved > 0
            ? Math.round(userStats.timeSpent / userStats.problemsSolved)
            : 0;

        // Calculate user's rank
        let ranking = 0;
        if (userStats.problemsSolved > 0) {
            const higherRankedUsers = await UserStats.countDocuments({
                problemsSolved: { $gt: userStats.problemsSolved }
            });
            ranking = higherRankedUsers + 1;
        }

        res.json({
            problemsSolved: userStats.problemsSolved,
            totalProblems,
            successRate,
            averageTime,
            ranking
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

module.exports = router;