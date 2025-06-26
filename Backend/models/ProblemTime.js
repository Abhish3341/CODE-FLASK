const mongoose = require('mongoose');

const problemTimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  problemTitle: {
    type: String,
    required: true
  },
  openedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  firstRunAt: {
    type: Date
  },
  submittedAt: {
    type: Date
  },
  solvedAt: {
    type: Date
  },
  timeTaken: {
    type: Number, // in minutes
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in minutes (including multiple sessions)
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  runs: {
    type: Number,
    default: 0
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    required: true,
    enum: ['c', 'cpp', 'java', 'python']
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  // Track individual sessions on this problem
  sessions: [{
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    activities: [{
      type: {
        type: String,
        enum: ['opened', 'run', 'submit', 'hint', 'solution']
      },
      timestamp: Date
    }]
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
problemTimeSchema.index({ userId: 1, problemId: 1 }, { unique: true });
problemTimeSchema.index({ userId: 1, solvedAt: -1 });
problemTimeSchema.index({ problemId: 1, isSolved: 1 });

// Method to record first run
problemTimeSchema.methods.recordFirstRun = function() {
  if (!this.firstRunAt) {
    this.firstRunAt = new Date();
    this.runs = 1;
  } else {
    this.runs += 1;
  }
  return this;
};

// Method to record submission
problemTimeSchema.methods.recordSubmission = function() {
  this.submittedAt = new Date();
  this.attempts += 1;
  this.calculateTimeTaken();
  return this;
};

// Method to record solution
problemTimeSchema.methods.recordSolution = function() {
  this.solvedAt = new Date();
  this.isSolved = true;
  this.calculateTimeTaken();
  return this;
};

// Method to calculate time taken
problemTimeSchema.methods.calculateTimeTaken = function() {
  if (this.openedAt && this.solvedAt) {
    this.timeTaken = Math.round((this.solvedAt - this.openedAt) / (1000 * 60)); // in minutes
  } else if (this.openedAt && this.submittedAt) {
    this.timeTaken = Math.round((this.submittedAt - this.openedAt) / (1000 * 60)); // in minutes
  }
  return this;
};

// Method to add session time
problemTimeSchema.methods.addSessionTime = function(minutes) {
  this.totalTimeSpent += minutes;
  return this;
};

// Static method to get or create problem time record
problemTimeSchema.statics.getOrCreate = async function(userId, problemId, problemTitle, language) {
  let problemTime = await this.findOne({ userId, problemId });
  
  if (!problemTime) {
    problemTime = await this.create({
      userId,
      problemId,
      problemTitle,
      language,
      openedAt: new Date()
    });
  }
  
  return problemTime;
};

// Static method to get user's problem time stats
problemTimeSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalProblems: { $sum: 1 },
        solvedProblems: { $sum: { $cond: ['$isSolved', 1, 0] } },
        totalTimeSpent: { $sum: '$totalTimeSpent' },
        averageTimePerProblem: { $avg: '$timeTaken' },
        averageTimePerSolved: { 
          $avg: { 
            $cond: ['$isSolved', '$timeTaken', null] 
          } 
        },
        fastestSolve: { 
          $min: { 
            $cond: ['$isSolved', '$timeTaken', null] 
          } 
        },
        slowestSolve: { 
          $max: { 
            $cond: ['$isSolved', '$timeTaken', null] 
          } 
        }
      }
    }
  ]);

  return stats[0] || {
    totalProblems: 0,
    solvedProblems: 0,
    totalTimeSpent: 0,
    averageTimePerProblem: 0,
    averageTimePerSolved: 0,
    fastestSolve: 0,
    slowestSolve: 0
  };
};

const ProblemTime = mongoose.model('ProblemTime', problemTimeSchema);
module.exports = ProblemTime;