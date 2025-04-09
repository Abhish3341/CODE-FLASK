const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const UserStats = require('../models/UserStats');
const Activity = require('../models/Activity');
const Problem = require('../models/Problems');

// Get user dashboard data
router.get('/', auth, async (req, res) => {
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

    // Get user's recent activity
    const recentActivity = await Activity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    // Calculate user's rank only if they have solved problems
    let rank = 0;
    if (userStats.problemsSolved > 0) {
      const higherRankedUsers = await UserStats.countDocuments({
        problemsSolved: { $gt: userStats.problemsSolved }
      });
      rank = higherRankedUsers + 1;
    }

    // Get recommended problems based on user's level
    const solvedProblems = await Activity.distinct('problemId', {
      userId,
      type: 'solved'
    });

    const userLevel = userStats.problemsSolved < 10 ? 'Easy' :
                     userStats.problemsSolved < 30 ? 'Medium' : 'Hard';

    const recommendedProblems = await Problem.find({
      _id: { $nin: solvedProblems },
      difficulty: userLevel
    })
    .sort({ acceptance: -1 })
    .limit(3)
    .lean();

    // Calculate time spent (in hours)
    const timeSpentHours = Math.floor(userStats.timeSpent / 60);

    res.json({
      stats: {
        rank,
        problemsSolved: userStats.problemsSolved,
        totalSubmissions: userStats.totalSubmissions,
        timeSpent: timeSpentHours
      },
      recentActivity: recentActivity.map(activity => ({
        id: activity._id,
        problem: activity.problemTitle,
        type: activity.type,
        timestamp: activity.timestamp
      })),
      recommendedProblems: recommendedProblems.map(problem => ({
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category
      }))
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;