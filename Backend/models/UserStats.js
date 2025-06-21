const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  averageTime: {
    type: Number, // in minutes per problem
    default: 0
  },
  successRate: {
    type: Number, // percentage
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  // Difficulty breakdown with safe defaults
  easyProblems: {
    solved: { type: Number, default: 0 },
    attempted: { type: Number, default: 0 }
  },
  mediumProblems: {
    solved: { type: Number, default: 0 },
    attempted: { type: Number, default: 0 }
  },
  hardProblems: {
    solved: { type: Number, default: 0 },
    attempted: { type: Number, default: 0 }
  },
  // Language breakdown with safe defaults
  languageStats: {
    python: { 
      solved: { type: Number, default: 0 }, 
      attempted: { type: Number, default: 0 } 
    },
    javascript: { 
      solved: { type: Number, default: 0 }, 
      attempted: { type: Number, default: 0 } 
    },
    java: { 
      solved: { type: Number, default: 0 }, 
      attempted: { type: Number, default: 0 } 
    },
    cpp: { 
      solved: { type: Number, default: 0 }, 
      attempted: { type: Number, default: 0 } 
    }
  }
}, {
  timestamps: true
});

// Ensure default values are set on save
userStatsSchema.pre('save', function(next) {
  // Ensure difficulty breakdown exists
  if (!this.easyProblems) {
    this.easyProblems = { solved: 0, attempted: 0 };
  }
  if (!this.mediumProblems) {
    this.mediumProblems = { solved: 0, attempted: 0 };
  }
  if (!this.hardProblems) {
    this.hardProblems = { solved: 0, attempted: 0 };
  }

  // Ensure language stats exist
  if (!this.languageStats) {
    this.languageStats = {
      python: { solved: 0, attempted: 0 },
      javascript: { solved: 0, attempted: 0 },
      java: { solved: 0, attempted: 0 },
      cpp: { solved: 0, attempted: 0 }
    };
  }

  // Ensure each language has both solved and attempted
  const languages = ['python', 'javascript', 'java', 'cpp'];
  languages.forEach(lang => {
    if (!this.languageStats[lang]) {
      this.languageStats[lang] = { solved: 0, attempted: 0 };
    }
    if (typeof this.languageStats[lang].solved === 'undefined') {
      this.languageStats[lang].solved = 0;
    }
    if (typeof this.languageStats[lang].attempted === 'undefined') {
      this.languageStats[lang].attempted = 0;
    }
  });

  next();
});

// Method to safely update stats
userStatsSchema.methods.updateStats = async function() {
  try {
    const Activity = mongoose.model('Activity');
    const Problem = mongoose.model('Problem');
    
    // Get all user activities
    const activities = await Activity.find({ userId: this.userId });
    const submissions = activities.filter(a => a.type === 'submitted');
    const solved = activities.filter(a => a.type === 'solved');
    const attempts = activities.filter(a => a.type === 'attempted');
    
    // Basic stats
    this.totalSubmissions = submissions.length;
    this.totalAttempts = attempts.length;
    this.problemsSolved = solved.length;
    this.timeSpent = activities.reduce((total, activity) => total + (activity.timeSpent || 0), 0);
    
    // Calculate success rate
    this.successRate = this.totalSubmissions > 0 ? 
      Math.round((this.problemsSolved / this.totalSubmissions) * 100) : 0;
    
    // Calculate average time per problem
    this.averageTime = this.problemsSolved > 0 ? 
      Math.round(this.timeSpent / this.problemsSolved) : 0;
    
    // Update last activity
    if (activities.length > 0) {
      this.lastActivity = activities[activities.length - 1].createdAt;
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
      
      this.easyProblems = {
        solved: solvedProblems.filter(p => p.difficulty === 'Easy').length,
        attempted: attemptedProblems.filter(p => p.difficulty === 'Easy').length
      };
      
      this.mediumProblems = {
        solved: solvedProblems.filter(p => p.difficulty === 'Medium').length,
        attempted: attemptedProblems.filter(p => p.difficulty === 'Medium').length
      };
      
      this.hardProblems = {
        solved: solvedProblems.filter(p => p.difficulty === 'Hard').length,
        attempted: attemptedProblems.filter(p => p.difficulty === 'Hard').length
      };
    } catch (difficultyError) {
      console.error('Error calculating difficulty breakdown:', difficultyError);
      // Keep existing values or set defaults
      this.easyProblems = this.easyProblems || { solved: 0, attempted: 0 };
      this.mediumProblems = this.mediumProblems || { solved: 0, attempted: 0 };
      this.hardProblems = this.hardProblems || { solved: 0, attempted: 0 };
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
    
    this.languageStats = languageStats;
    
    await this.save();
    return this;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return this;
  }
};

const UserStats = mongoose.model('UserStats', userStatsSchema);
module.exports = UserStats;