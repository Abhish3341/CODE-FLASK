const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    index: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sessionType: {
    type: String,
    enum: ['login', 'auto', 'manual'],
    default: 'login'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  // Track activities during session
  problemsWorkedOn: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    },
    timeSpent: Number, // in minutes
    startedAt: Date,
    lastWorkedAt: Date
  }],
  totalProblemsWorked: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ startTime: 1, endTime: 1 });

// Method to end session
sessionSchema.methods.endSession = function() {
  if (this.isActive && !this.endTime) {
    this.endTime = new Date();
    this.isActive = false;
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }
  return this;
};

// Method to update last activity
sessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this;
};

// Static method to get active session for user
sessionSchema.statics.getActiveSession = function(userId) {
  return this.findOne({ userId, isActive: true });
};

// Static method to create new session
sessionSchema.statics.createSession = function(userId, sessionType = 'login') {
  return this.create({
    userId,
    sessionType,
    startTime: new Date(),
    isActive: true,
    lastActivity: new Date()
  });
};

// Static method to get session stats for user
sessionSchema.statics.getSessionStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sessions = await this.find({
    userId,
    startTime: { $gte: startDate },
    endTime: { $exists: true }
  });

  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  const averageSessionTime = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

  // Calculate this week's time
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const thisWeekSessions = sessions.filter(session => session.startTime >= oneWeekAgo);
  const thisWeekTime = thisWeekSessions.reduce((sum, session) => sum + (session.duration || 0), 0);

  return {
    totalSessions,
    totalTime,
    averageSessionTime,
    thisWeekTime,
    activeDays: new Set(sessions.map(s => s.startTime.toDateString())).size
  };
};

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;