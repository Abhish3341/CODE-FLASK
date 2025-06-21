const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  problemTitle: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['attempted', 'submitted', 'solved'],
    required: true
  },
  language: {
    type: String,
    required: true
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }
}, {
  timestamps: true
});

// Index for better query performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, type: 1 });
activitySchema.index({ userId: 1, problemId: 1 });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;