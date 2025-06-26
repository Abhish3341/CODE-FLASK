const Session = require('../models/Session');
const ProblemTime = require('../models/ProblemTime');
const mongoose = require('mongoose');

class TimeTrackingService {
  // Session Management
  static async startSession(userId, sessionType = 'login') {
    try {
      // End any existing active sessions
      await this.endActiveSession(userId);
      
      // Create new session
      const session = await Session.createSession(userId, sessionType);
      console.log(`📅 Started new session for user ${userId}`);
      return session;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  static async endActiveSession(userId) {
    try {
      const activeSession = await Session.getActiveSession(userId);
      if (activeSession) {
        activeSession.endSession();
        await activeSession.save();
        console.log(`📅 Ended session for user ${userId}, duration: ${activeSession.duration} minutes`);
        return activeSession;
      }
      return null;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  static async updateSessionActivity(userId) {
    try {
      const activeSession = await Session.getActiveSession(userId);
      if (activeSession) {
        activeSession.updateActivity();
        await activeSession.save();
      }
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  static async getSessionStats(userId, days = 30) {
    try {
      return await Session.getSessionStats(userId, days);
    } catch (error) {
      console.error('Error getting session stats:', error);
      return {
        totalSessions: 0,
        totalTime: 0,
        averageSessionTime: 0,
        thisWeekTime: 0,
        activeDays: 0
      };
    }
  }

  // Problem Time Management
  static async startProblemTime(userId, problemId, problemTitle, language) {
    try {
      const problemTime = await ProblemTime.getOrCreate(userId, problemId, problemTitle, language);
      
      // Update session activity
      await this.updateSessionActivity(userId);
      
      console.log(`⏱️ Started tracking time for problem ${problemId} for user ${userId}`);
      return problemTime;
    } catch (error) {
      console.error('Error starting problem time:', error);
      throw error;
    }
  }

  static async recordProblemRun(userId, problemId) {
    try {
      const problemTime = await ProblemTime.findOne({ userId, problemId });
      if (problemTime) {
        problemTime.recordFirstRun();
        await problemTime.save();
        
        // Update session activity
        await this.updateSessionActivity(userId);
        
        console.log(`🏃 Recorded run for problem ${problemId} for user ${userId}`);
        return problemTime;
      }
    } catch (error) {
      console.error('Error recording problem run:', error);
    }
  }

  static async recordProblemSubmission(userId, problemId, isCorrect = false) {
    try {
      const problemTime = await ProblemTime.findOne({ userId, problemId });
      if (problemTime) {
        problemTime.recordSubmission();
        
        if (isCorrect) {
          problemTime.recordSolution();
        }
        
        await problemTime.save();
        
        // Update session activity
        await this.updateSessionActivity(userId);
        
        console.log(`📤 Recorded submission for problem ${problemId} for user ${userId}, correct: ${isCorrect}`);
        return problemTime;
      }
    } catch (error) {
      console.error('Error recording problem submission:', error);
    }
  }

  static async getProblemTimeStats(userId) {
    try {
      return await ProblemTime.getUserStats(userId);
    } catch (error) {
      console.error('Error getting problem time stats:', error);
      return {
        totalProblems: 0,
        solvedProblems: 0,
        totalTimeSpent: 0,
        averageTimePerProblem: 0,
        averageTimePerSolved: 0,
        fastestSolve: 0,
        slowestSolve: 0
      };
    }
  }

  // Combined Dashboard Stats - Enhanced for Problem-Solving Focus
  static async getDashboardTimeStats(userId) {
    try {
      const [sessionStats, problemStats] = await Promise.all([
        this.getSessionStats(userId),
        this.getProblemTimeStats(userId)
      ]);

      // Calculate problem-solving focused metrics
      const averageTimePerSolved = problemStats.averageTimePerSolved || 0;
      const averageTimePerProblem = problemStats.averageTimePerProblem || 0;
      
      // Use problem-solving time as primary metric, fall back to session time
      const primaryAvgTime = averageTimePerSolved > 0 ? averageTimePerSolved : 
                           (averageTimePerProblem > 0 ? averageTimePerProblem : sessionStats.averageSessionTime);

      // Calculate this week's problem-solving time
      const thisWeekProblemTime = await this.getThisWeekProblemTime(userId);
      const thisWeekTime = thisWeekProblemTime > 0 ? thisWeekProblemTime : sessionStats.thisWeekTime;

      return {
        // Session-based metrics (fallback)
        averageSessionTime: sessionStats.averageSessionTime,
        totalSessionTime: sessionStats.totalTime,
        totalSessions: sessionStats.totalSessions,
        
        // Problem-focused metrics (primary)
        averageTimePerProblem: Math.round(averageTimePerProblem),
        averageTimePerSolved: Math.round(averageTimePerSolved),
        thisWeekTime: Math.round(thisWeekTime),
        activeDays: Math.max(sessionStats.activeDays, await this.getProblemActiveDays(userId)),
        
        // Performance metrics
        fastestSolve: problemStats.fastestSolve || 0,
        slowestSolve: problemStats.slowestSolve || 0,
        totalProblemTime: problemStats.totalTimeSpent || 0,
        
        // Combined metrics for dashboard display
        primaryAvgTime: Math.round(primaryAvgTime),
        hasProblemData: problemStats.solvedProblems > 0
      };
    } catch (error) {
      console.error('Error getting dashboard time stats:', error);
      return {
        averageSessionTime: 0,
        averageTimePerProblem: 0,
        averageTimePerSolved: 0,
        thisWeekTime: 0,
        totalSessionTime: 0,
        activeDays: 0,
        totalSessions: 0,
        fastestSolve: 0,
        slowestSolve: 0,
        totalProblemTime: 0,
        primaryAvgTime: 0,
        hasProblemData: false
      };
    }
  }

  // Helper method to get this week's problem-solving time
  static async getThisWeekProblemTime(userId) {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const problemTimes = await ProblemTime.find({
        userId,
        openedAt: { $gte: oneWeekAgo }
      });

      return problemTimes.reduce((total, pt) => total + (pt.timeTaken || 0), 0);
    } catch (error) {
      console.error('Error getting this week problem time:', error);
      return 0;
    }
  }

  // Helper method to get problem-solving active days
  static async getProblemActiveDays(userId) {
    try {
      const problemTimes = await ProblemTime.find({ userId });
      const activeDays = new Set();
      
      problemTimes.forEach(pt => {
        if (pt.openedAt) {
          activeDays.add(pt.openedAt.toDateString());
        }
      });
      
      return activeDays.size;
    } catch (error) {
      console.error('Error getting problem active days:', error);
      return 0;
    }
  }

  // Auto-timeout inactive sessions (call this periodically)
  static async timeoutInactiveSessions(timeoutMinutes = 60) {
    try {
      const timeoutDate = new Date();
      timeoutDate.setMinutes(timeoutDate.getMinutes() - timeoutMinutes);

      const inactiveSessions = await Session.find({
        isActive: true,
        lastActivity: { $lt: timeoutDate }
      });

      for (const session of inactiveSessions) {
        session.endTime = session.lastActivity;
        session.endSession();
        await session.save();
      }

      console.log(`⏰ Timed out ${inactiveSessions.length} inactive sessions`);
      return inactiveSessions.length;
    } catch (error) {
      console.error('Error timing out sessions:', error);
      return 0;
    }
  }
}

module.exports = TimeTrackingService;