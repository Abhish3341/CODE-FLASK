const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
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
  clickedHint: {
    type: Boolean,
    default: false
  },
  clickedSolution: {
    type: Boolean,
    default: false
  },
  wrongAttempts: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  finalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  language: {
    type: String,
    required: true,
    enum: ['c', 'cpp', 'java', 'python']
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
scoreSchema.index({ userId: 1, problemId: 1 }, { unique: true });
scoreSchema.index({ userId: 1, submittedAt: -1 });
scoreSchema.index({ problemId: 1, finalScore: -1 });

// Static method to calculate score
scoreSchema.statics.calculateScore = function({ clickedHint, clickedSolution, wrongAttempts, passed }) {
  if (clickedSolution) return 0;
  if (!passed) return 0;

  let score = 100;
  if (clickedHint) score -= 30; // -30 for using hint
  score -= wrongAttempts * 5; // -5 for each wrong submission

  return Math.max(score, 0);
};

// Instance method to update score
scoreSchema.methods.updateScore = function() {
  this.finalScore = this.constructor.calculateScore({
    clickedHint: this.clickedHint,
    clickedSolution: this.clickedSolution,
    wrongAttempts: this.wrongAttempts,
    passed: this.passed
  });
  return this;
};

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;