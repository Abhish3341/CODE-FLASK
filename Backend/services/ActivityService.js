const Activity = require('../models/Activity');
const UserStats = require('../models/UserStats');
const Problem = require('../models/Problems');

class ActivityService {
  // Record when user starts working on a problem
  static async recordAttempt(userId, problemId, language) {
    try {
      const problem = await Problem.findById(problemId);
      if (!problem) return null;

      const activity = await Activity.create({
        userId,
        problemId,
        problemTitle: problem.title,
        type: 'attempted',
        language,
        timeSpent: 0
      });

      await this.updateUserStats(userId);
      return activity;
    } catch (error) {
      console.error('Error recording attempt:', error);
      return null;
    }
  }

  // Record when user submits code
  static async recordSubmission(userId, problemId, language, submissionId, executionTime = 0, timeSpent = 0) {
    try {
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

      await this.updateUserStats(userId);
      return activity;
    } catch (error) {
      console.error('Error recording submission:', error);
      return null;
    }
  }

  // Record when user successfully solves a problem
  static async recordSolution(userId, problemId, language, submissionId, executionTime = 0, timeSpent = 0) {
    try {
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

      await this.updateUserStats(userId);
      await this.updateProblemStats(problemId);
      return activity;
    } catch (error) {
      console.error('Error recording solution:', error);
      return null;
    }
  }

  // Update user statistics
  static async updateUserStats(userId) {
    try {
      let userStats = await UserStats.findOne({ userId });
      
      if (!userStats) {
        userStats = await UserStats.create({ userId });
      }

      await userStats.updateStats();
      
      // Calculate rank among all users
      const betterUsers = await UserStats.countDocuments({
        problemsSolved: { $gt: userStats.problemsSolved }
      });
      
      userStats.rank = betterUsers + 1;
      await userStats.save();

      return userStats;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return null;
    }
  }

  // Update problem statistics
  static async updateProblemStats(problemId) {
    try {
      const problem = await Problem.findById(problemId);
      if (!problem) return;

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
      const solvedActivities = await Activity.find({
        userId,
        type: 'solved'
      }).distinct('problemId');

      return solvedActivities;
    } catch (error) {
      console.error('Error getting solved problems:', error);
      return [];
    }
  }

  // Calculate time spent on a problem (estimate based on submission times)
  static calculateTimeSpent(startTime, endTime) {
    const diffMs = new Date(endTime) - new Date(startTime);
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    return Math.max(1, Math.min(diffMinutes, 120)); // Cap at 2 hours
  }
}

module.exports = ActivityService;