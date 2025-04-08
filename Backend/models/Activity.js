const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: String,
    required: true
  },
  problemTitle: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['solved', 'attempted', 'submitted'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;