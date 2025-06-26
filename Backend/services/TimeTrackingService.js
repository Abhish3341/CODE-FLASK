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

  // Combined Dashboard Stats
  static async getDashboardTimeStats(userId) {
    try {
      const [sessionStats, problemStats] = await Promise.all([
        this.getSessionStats(userId),
        this.getProblemTimeStats(userId)
      ]);

      return {
        // Session-based metrics
        averageSessionTime: sessionStats.averageSessionTime,
        thisWeekTime: sessionStats.thisWeekTime,
        totalSessionTime: sessionStats.totalTime,
        activeDays: sessionStats.activeDays,
        totalSessions: sessionStats.totalSessions,
        
        // Problem-based metrics
        averageTimePerProblem: Math.round(problemStats.averageTimePerProblem || 0),
        averageTimePerSolved: Math.round(problemStats.averageTimePerSolved || 0),
        fastestSolve: problemStats.fastestSolve || 0,
        slowestSolve: problemStats.slowestSolve || 0,
        totalProblemTime: problemStats.totalTimeSpent || 0
      };
    } catch (error) {
      console.error('Error getting dashboard time stats:', error);
      return {
        averageSessionTime: 0,
        thisWeekTime: 0,
        totalSessionTime: 0,
        activeDays: 0,
        totalSessions: 0,
        averageTimePerProblem: 0,
        averageTimePerSolved: 0,
        fastestSolve: 0,
        slowestSolve: 0,
        totalProblemTime: 0
      };
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