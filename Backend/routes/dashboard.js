const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const UserStats = require('../models/UserStats');
const Activity = require('../models/Activity');
const Problem = require('../models/Problems');
const ActivityService = require('../services/ActivityService');
const TimeTrackingService = require('../services/TimeTrackingService');

// Get user dashboard data with enhanced progress overview and time tracking
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

    // Get solved problem IDs for recommendations
    const solvedProblemIds = await ActivityService.getSolvedProblems(userId);

    // Get user's activities for status tracking
    const userActivities = await Activity.find({ userId });
    
    // Create maps for quick lookup
    const attemptedProblems = new Set();
    const submittedProblems = new Set();
    const solvedProblems = new Set();
    
    userActivities.forEach(activity => {
      const problemIdStr = activity.problemId.toString();
      
      if (activity.type === 'attempted') {
        attemptedProblems.add(problemIdStr);
      } else if (activity.type === 'submitted') {
        submittedProblems.add(problemIdStr);
        attemptedProblems.add(problemIdStr); // Submitted implies attempted
      } else if (activity.type === 'solved') {
        solvedProblems.add(problemIdStr);
        submittedProblems.add(problemIdStr); // Solved implies submitted
        attemptedProblems.add(problemIdStr); // Solved implies attempted
      }
    });

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
    .select('title difficulty category') // Only select essential fields
    .lean();

    // Get time tracking statistics
    const timeStats = await TimeTrackingService.getDashboardTimeStats(userId);

    // Calculate additional stats with time data
    const stats = {
      rank: userStats.rank || 0,
      problemsSolved: userStats.problemsSolved,
      totalProblems,
      totalSubmissions: userStats.totalSubmissions,
      timeSpent: Math.round(userStats.timeSpent / 60), // Convert to hours
      successRate: userStats.successRate,
      averageTime: timeStats.averageTimePerSolved, // Use time tracking data
      // Difficulty breakdown
      easyProblems: userStats.easyProblems,
      mediumProblems: userStats.mediumProblems,
      hardProblems: userStats.hardProblems,
      // Language breakdown
      languageStats: userStats.languageStats,
      // Time tracking stats
      averageSessionTime: timeStats.averageSessionTime,
      thisWeekTime: timeStats.thisWeekTime,
      totalSessionTime: timeStats.totalSessionTime,
      activeDays: timeStats.activeDays,
      fastestSolve: timeStats.fastestSolve,
      slowestSolve: timeStats.slowestSolve
    };

    // Get progress overview data with enhanced time tracking
    const progressOverview = await getProgressOverview(userId, timeStats);

    // Format recommended problems with status information (clean format)
    const formattedRecommendations = recommendedProblems.map(problem => {
      const problemIdStr = problem._id.toString();
      
      // Determine the highest status achieved
      let status = 'not-attempted';
      if (attemptedProblems.has(problemIdStr)) {
        status = 'attempted';
      }
      if (submittedProblems.has(problemIdStr)) {
        status = 'submitted';
      }
      if (solvedProblems.has(problemIdStr)) {
        status = 'solved';
      }
      
      return {
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        status: status
      };
    });

    res.json({
      stats,
      progressOverview,
      recommendedProblems: formattedRecommendations,
      userLevel: recommendedDifficulty,
      timeStats // Include detailed time stats
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Helper function to get progress overview data with enhanced time tracking
async function getProgressOverview(userId, timeStats) {
  try {
    // Get all user activities
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
    
    // Calculate current streak
    const currentStreak = calculateCurrentStreak(activities);
    
    // Use time tracking data for more accurate time calculations
    const thisWeekTime = timeStats.thisWeekTime || calculateThisWeekTime(activities);
    
    // Get difficulty completion rates
    const difficultyRates = await calculateDifficultyRates(userId);
    
    // Get language distribution
    const languageDistribution = calculateLanguageDistribution(activities);
    
    // Get weekly activity data (last 7 days)
    const weeklyActivity = calculateWeeklyActivity(activities);
    
    // Get monthly progress
    const monthlyProgress = calculateMonthlyProgress(activities);

    return {
      currentStreak,
      thisWeekTime,
      difficultyRates,
      languageDistribution,
      weeklyActivity,
      monthlyProgress,
      totalActiveDays: timeStats.activeDays || calculateTotalActiveDays(activities),
      averageSessionTime: timeStats.averageSessionTime || calculateAverageSessionTime(activities),
      // Enhanced time metrics
      averageTimePerProblem: timeStats.averageTimePerProblem || 0,
      fastestSolve: timeStats.fastestSolve || 0,
      slowestSolve: timeStats.slowestSolve || 0,
      totalSessionTime: timeStats.totalSessionTime || 0
    };
  } catch (error) {
    console.error('Error calculating progress overview:', error);
    return {
      currentStreak: 0,
      thisWeekTime: 0,
      difficultyRates: { easy: 0, medium: 0, hard: 0 },
      languageDistribution: {},
      weeklyActivity: [],
      monthlyProgress: { solved: 0, attempted: 0 },
      totalActiveDays: 0,
      averageSessionTime: 0,
      averageTimePerProblem: 0,
      fastestSolve: 0,
      slowestSolve: 0,
      totalSessionTime: 0
    };
  }
}

function calculateCurrentStreak(activities) {
  if (!activities.length) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Check each day going backwards
  for (let i = 0; i < 30; i++) { // Check last 30 days max
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const hasActivity = activities.some(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate >= dayStart && activityDate <= dayEnd;
    });
    
    if (hasActivity) {
      streak++;
    } else if (i > 0) { // Allow for today to have no activity yet
      break;
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

function calculateThisWeekTime(activities) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const thisWeekActivities = activities.filter(activity => 
    new Date(activity.createdAt) >= oneWeekAgo
  );
  
  return thisWeekActivities.reduce((total, activity) => 
    total + (activity.timeSpent || 0), 0
  );
}

async function calculateDifficultyRates(userId) {
  try {
    const Problem = require('../models/Problems');
    
    // Get all problems by difficulty
    const easyProblems = await Problem.countDocuments({ difficulty: 'Easy' });
    const mediumProblems = await Problem.countDocuments({ difficulty: 'Medium' });
    const hardProblems = await Problem.countDocuments({ difficulty: 'Hard' });
    
    // Get user's solved problems by difficulty
    const solvedActivities = await Activity.find({ 
      userId, 
      type: 'solved' 
    }).distinct('problemId');
    
    const solvedProblems = await Problem.find({
      _id: { $in: solvedActivities }
    });
    
    const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;
    
    return {
      easy: easyProblems > 0 ? Math.round((easySolved / easyProblems) * 100) : 0,
      medium: mediumProblems > 0 ? Math.round((mediumSolved / mediumProblems) * 100) : 0,
      hard: hardProblems > 0 ? Math.round((hardSolved / hardProblems) * 100) : 0
    };
  } catch (error) {
    console.error('Error calculating difficulty rates:', error);
    return { easy: 0, medium: 0, hard: 0 };
  }
}

function calculateLanguageDistribution(activities) {
  const distribution = {};
  
  activities.forEach(activity => {
    if (activity.language) {
      distribution[activity.language] = (distribution[activity.language] || 0) + 1;
    }
  });
  
  return distribution;
}

function calculateWeeklyActivity(activities) {
  const weeklyData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate >= date && activityDate < nextDay;
    });
    
    weeklyData.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayActivities.length,
      timeSpent: dayActivities.reduce((total, activity) => total + (activity.timeSpent || 0), 0)
    });
  }
  
  return weeklyData;
}

function calculateMonthlyProgress(activities) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const monthlyActivities = activities.filter(activity => 
    new Date(activity.createdAt) >= oneMonthAgo
  );
  
  const solved = monthlyActivities.filter(a => a.type === 'solved').length;
  const attempted = new Set(monthlyActivities.map(a => a.problemId.toString())).size;
  
  return { solved, attempted };
}

function calculateTotalActiveDays(activities) {
  const activeDays = new Set();
  
  activities.forEach(activity => {
    const date = new Date(activity.createdAt);
    const dateString = date.toISOString().split('T')[0];
    activeDays.add(dateString);
  });
  
  return activeDays.size;
}

function calculateAverageSessionTime(activities) {
  if (!activities.length) return 0;
  
  const totalTime = activities.reduce((total, activity) => 
    total + (activity.timeSpent || 0), 0
  );
  
  const activeDays = calculateTotalActiveDays(activities);
  
  return activeDays > 0 ? Math.round(totalTime / activeDays) : 0;
}

// Get detailed user statistics with time tracking
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

    // Get time tracking statistics
    const timeStats = await TimeTrackingService.getDashboardTimeStats(userId);

    res.json({
      userStats,
      activityTimeline: activityByDate,
      timeStats,
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