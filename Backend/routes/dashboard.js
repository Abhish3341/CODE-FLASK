const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const UserStats = require('../models/UserStats');
const Activity = require('../models/Activity');
const Problem = require('../models/Problems');
const ActivityService = require('../services/ActivityService');

// Get user dashboard data with real activity tracking
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get or create user stats
    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = await UserStats.create({ userId });
      await userStats.updateStats();
    }

    // Get total problems count for context
    const totalProblems = await Problem.countDocuments();

    // Get user's recent activity (last 10 activities)
    const recentActivity = await ActivityService.getRecentActivity(userId, 10);

    // Get solved problem IDs for recommendations
    const solvedProblemIds = await ActivityService.getSolvedProblems(userId);

    // Get recommended problems based on user's level and unsolved problems
    let recommendedDifficulty = 'Easy';
    if (userStats.problemsSolved >= 10) {
      recommendedDifficulty = 'Medium';
    }
    if (userStats.problemsSolved >= 30) {
      recommendedDifficulty = 'Hard';
    }

    const recommendedProblems = await Problem.find({
      _id: { $nin: solvedProblemIds },
      difficulty: recommendedDifficulty
    })
    .sort({ acceptance: -1 }) // Sort by acceptance rate (easier first)
    .limit(3)
    .lean();

    // Calculate additional stats
    const stats = {
      rank: userStats.rank || 0,
      problemsSolved: userStats.problemsSolved,
      totalProblems,
      totalSubmissions: userStats.totalSubmissions,
      timeSpent: Math.round(userStats.timeSpent / 60), // Convert to hours
      successRate: userStats.successRate,
      averageTime: userStats.averageTime,
      // Difficulty breakdown
      easyProblems: userStats.easyProblems,
      mediumProblems: userStats.mediumProblems,
      hardProblems: userStats.hardProblems,
      // Language breakdown
      languageStats: userStats.languageStats
    };

    // Format recent activity for display
    const formattedActivity = recentActivity.map(activity => ({
      id: activity._id,
      problem: activity.problemTitle,
      type: activity.type,
      language: activity.language,
      timeSpent: activity.timeSpent,
      timestamp: activity.createdAt
    }));

    // Format recommended problems
    const formattedRecommendations = recommendedProblems.map(problem => ({
      id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      acceptance: problem.acceptance
    }));

    res.json({
      stats,
      recentActivity: formattedActivity,
      recommendedProblems: formattedRecommendations,
      userLevel: recommendedDifficulty
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get detailed user statistics
router.get('/stats/detailed', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = await UserStats.create({ userId });
      await userStats.updateStats();
    }

    // Get activity timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = await Activity.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    // Group activities by date for chart data
    const activityByDate = {};
    recentActivities.forEach(activity => {
      const date = activity.createdAt.toISOString().split('T')[0];
      if (!activityByDate[date]) {
        activityByDate[date] = { attempted: 0, submitted: 0, solved: 0 };
      }
      activityByDate[date][activity.type]++;
    });

    res.json({
      userStats,
      activityTimeline: activityByDate,
      totalUsers: await UserStats.countDocuments(),
      userRankPercentile: userStats.rank > 0 ? 
        Math.round((1 - (userStats.rank - 1) / await UserStats.countDocuments()) * 100) : 0
    });

  } catch (error) {
    console.error('Detailed stats error:', error);
    res.status(500).json({ error: 'Failed to fetch detailed statistics' });
  }
});

module.exports = router;