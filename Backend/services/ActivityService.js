const Activity = require('../models/Activity');
const UserStats = require('../models/UserStats');
const Problem = require('../models/Problems');
const mongoose = require('mongoose');

class ActivityService {
  // Record when user starts working on a problem
  static async recordAttempt(userId, problemId, language) {
    try {
      // Validate inputs
      if (!userId || !problemId || !language) {
        console.log('Invalid inputs for recordAttempt');
        return null;
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(problemId)) {
        console.log('Invalid problemId format');
        return null;
      }

      const problem = await Problem.findById(problemId);
      if (!problem) {
        console.log('Problem not found:', problemId);
        return null;
      }

      // Check if already attempted recently (within last hour)
      const recentAttempt = await Activity.findOne({
        userId,
        problemId,
        type: 'attempted',
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
      });

      if (recentAttempt) {
        return recentAttempt; // Don't create duplicate attempts
      }

      const activity = await Activity.create({
        userId,
        problemId,
        problemTitle: problem.title,
        type: 'attempted',
        language,
        timeSpent: 0
      });

      // Update user stats in background (don't wait)
      this.updateUserStats(userId).catch(err => 
        console.error('Background user stats update failed:', err)
      );

      return activity;
    } catch (error) {
      console.error('Error recording attempt:', error);
      return null;
    }
  }

  // Record when user submits code
  static async recordSubmission(userId, problemId, language, submissionId, executionTime = 0, timeSpent = 0) {
    try {
      // Validate inputs
      if (!userId || !problemId || !language) {
        return null;
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(problemId)) {
        return null;
      }

      const problem = await Problem.findById(problemId);
      if (!problem) return null;

      const activity = await Activity.create({
        userId,
        problemId,
        problemTitle: problem.title,
        type: 'submitted',
        language,
        executionTime,
        timeSpent,
        submissionId
      });

      // Update stats in background
      this.updateUserStats(userId).catch(err => 
        console.error('Background user stats update failed:', err)
      );
      this.updateProblemStats(problemId).catch(err => 
        console.error('Background problem stats update failed:', err)
      );

      return activity;
    } catch (error) {
      console.error('Error recording submission:', error);
      return null;
    }
  }

  // Record when user successfully solves a problem
  static async recordSolution(userId, problemId, language, submissionId, executionTime = 0, timeSpent = 0) {
    try {
      // Validate inputs
      if (!userId || !problemId || !language) {
        return null;
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(problemId)) {
        return null;
      }

      const problem = await Problem.findById(problemId);
      if (!problem) return null;

      // Check if already solved
      const existingSolution = await Activity.findOne({
        userId,
        problemId,
        type: 'solved'
      });

      if (existingSolution) {
        return existingSolution; // Already solved
      }

      const activity = await Activity.create({
        userId,
        problemId,
        problemTitle: problem.title,
        type: 'solved',
        language,
        executionTime,
        timeSpent,
        isCorrect: true,
        submissionId
      });

      // Update stats in background
      this.updateUserStats(userId).catch(err => 
        console.error('Background user stats update failed:', err)
      );
      this.updateProblemStats(problemId).catch(err => 
        console.error('Background problem stats update failed:', err)
      );

      return activity;
    } catch (error) {
      console.error('Error recording solution:', error);
      return null;
    }
  }

  // Update user statistics based on real activity data
  static async updateUserStats(userId) {
    try {
      // Validate userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return null;
      }

      let userStats = await UserStats.findOne({ userId });
      
      if (!userStats) {
        userStats = await UserStats.create({ 
          userId,
          problemsSolved: 0,
          totalSubmissions: 0,
          totalAttempts: 0,
          timeSpent: 0,
          averageTime: 0,
          successRate: 0,
          rank: 0,
          easyProblems: { solved: 0, attempted: 0 },
          mediumProblems: { solved: 0, attempted: 0 },
          hardProblems: { solved: 0, attempted: 0 },
          languageStats: {
            python: { solved: 0, attempted: 0 },
            javascript: { solved: 0, attempted: 0 },
            java: { solved: 0, attempted: 0 },
            cpp: { solved: 0, attempted: 0 }
          }
        });
      }

      // Get all user activities
      const activities = await Activity.find({ userId });
      const submissions = activities.filter(a => a.type === 'submitted');
      const solved = activities.filter(a => a.type === 'solved');
      const attempts = activities.filter(a => a.type === 'attempted');

      // Update basic stats
      userStats.totalSubmissions = submissions.length;
      userStats.totalAttempts = attempts.length;
      userStats.problemsSolved = solved.length;
      userStats.timeSpent = activities.reduce((total, activity) => total + (activity.timeSpent || 0), 0);
      
      // Calculate success rate
      userStats.successRate = userStats.totalSubmissions > 0 ? 
        Math.round((userStats.problemsSolved / userStats.totalSubmissions) * 100) : 0;
      
      // Calculate average time per problem
      userStats.averageTime = userStats.problemsSolved > 0 ? 
        Math.round(userStats.timeSpent / userStats.problemsSolved) : 0;
      
      // Update last activity
      if (activities.length > 0) {
        userStats.lastActivity = activities[activities.length - 1].createdAt;
      }
      
      // Calculate difficulty breakdown safely
      try {
        const solvedProblemIds = solved.map(s => s.problemId).filter(id => mongoose.Types.ObjectId.isValid(id));
        const attemptedProblemIds = attempts.map(a => a.problemId).filter(id => mongoose.Types.ObjectId.isValid(id));

        const solvedProblems = await Problem.find({
          _id: { $in: solvedProblemIds }
        });

        const attemptedProblems = await Problem.find({
          _id: { $in: attemptedProblemIds }
        });
        
        userStats.easyProblems = {
          solved: solvedProblems.filter(p => p.difficulty === 'Easy').length,
          attempted: attemptedProblems.filter(p => p.difficulty === 'Easy').length
        };
        
        userStats.mediumProblems = {
          solved: solvedProblems.filter(p => p.difficulty === 'Medium').length,
          attempted: attemptedProblems.filter(p => p.difficulty === 'Medium').length
        };
        
        userStats.hardProblems = {
          solved: solvedProblems.filter(p => p.difficulty === 'Hard').length,
          attempted: attemptedProblems.filter(p => p.difficulty === 'Hard').length
        };
      } catch (difficultyError) {
        console.error('Error calculating difficulty breakdown:', difficultyError);
        // Keep existing values or set defaults
        userStats.easyProblems = userStats.easyProblems || { solved: 0, attempted: 0 };
        userStats.mediumProblems = userStats.mediumProblems || { solved: 0, attempted: 0 };
        userStats.hardProblems = userStats.hardProblems || { solved: 0, attempted: 0 };
      }
      
      // Calculate language breakdown
      const languageStats = {
        python: { solved: 0, attempted: 0 },
        javascript: { solved: 0, attempted: 0 },
        java: { solved: 0, attempted: 0 },
        cpp: { solved: 0, attempted: 0 }
      };
      
      activities.forEach(activity => {
        if (languageStats[activity.language]) {
          if (activity.type === 'solved') {
            languageStats[activity.language].solved++;
          }
          if (activity.type === 'attempted' || activity.type === 'submitted' || activity.type === 'solved') {
            languageStats[activity.language].attempted++;
          }
        }
      });
      
      userStats.languageStats = languageStats;
      
      await userStats.save();
      
      // Calculate rank among all users (in background)
      try {
        const betterUsers = await UserStats.countDocuments({
          problemsSolved: { $gt: userStats.problemsSolved }
        });
        
        userStats.rank = betterUsers + 1;
        await userStats.save();
      } catch (rankError) {
        console.error('Error calculating rank:', rankError);
      }

      return userStats;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return null;
    }
  }

  // Update problem statistics
  static async updateProblemStats(problemId) {
    try {
      // Validate problemId
      if (!problemId || !mongoose.Types.ObjectId.isValid(problemId)) {
        return null;
      }

      const problem = await Problem.findById(problemId);
      if (!problem) return null;

      const totalSubmissions = await Activity.countDocuments({
        problemId,
        type: 'submitted'
      });

      const totalSolved = await Activity.countDocuments({
        problemId,
        type: 'solved'
      });

      problem.totalSubmissions = totalSubmissions;
      problem.acceptance = totalSubmissions > 0 ? 
        Math.round((totalSolved / totalSubmissions) * 100) : 0;

      await problem.save();
      return problem;
    } catch (error) {
      console.error('Error updating problem stats:', error);
      return null;
    }
  }

  // Get user's recent activity
  static async getRecentActivity(userId, limit = 10) {
    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return [];
      }

      return await Activity.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  // Get user's solved problems
  static async getSolvedProblems(userId) {
    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return [];
      }

      const solvedActivities = await Activity.find({
        userId,
        type: 'solved'
      }).distinct('problemId');

      return solvedActivities.filter(id => mongoose.Types.ObjectId.isValid(id));
    } catch (error) {
      console.error('Error getting solved problems:', error);
      return [];
    }
  }

  // Calculate time spent on a problem (estimate based on submission times)
  static calculateTimeSpent(startTime, endTime) {
    try {
      const diffMs = new Date(endTime) - new Date(startTime);
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return Math.max(1, Math.min(diffMinutes, 120)); // Cap at 2 hours
    } catch (error) {
      return 5; // Default 5 minutes
    }
  }

  // Get user activity summary for dashboard
  static async getUserActivitySummary(userId) {
    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return null;
      }

      const activities = await Activity.find({ userId });
      
      const summary = {
        totalActivities: activities.length,
        problemsAttempted: new Set(activities.filter(a => a.type === 'attempted').map(a => a.problemId.toString())).size,
        problemsSubmitted: new Set(activities.filter(a => a.type === 'submitted').map(a => a.problemId.toString())).size,
        problemsSolved: new Set(activities.filter(a => a.type === 'solved').map(a => a.problemId.toString())).size,
        totalTimeSpent: activities.reduce((total, activity) => total + (activity.timeSpent || 0), 0),
        languageUsage: {},
        recentStreak: 0
      };

      // Calculate language usage
      activities.forEach(activity => {
        if (!summary.languageUsage[activity.language]) {
          summary.languageUsage[activity.language] = 0;
        }
        summary.languageUsage[activity.language]++;
      });

      // Calculate recent activity streak (consecutive days with activity)
      const today = new Date();
      let streakDays = 0;
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        checkDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(checkDate);
        nextDay.setDate(checkDate.getDate() + 1);
        
        const hasActivity = activities.some(activity => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= checkDate && activityDate < nextDay;
        });
        
        if (hasActivity) {
          streakDays++;
        } else if (i > 0) {
          break; // Break streak if no activity found (but allow for today)
        }
      }
      
      summary.recentStreak = streakDays;
      
      return summary;
    } catch (error) {
      console.error('Error getting user activity summary:', error);
      return null;
    }
  }
}

module.exports = ActivityService;