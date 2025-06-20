const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  acceptance: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  version: {
    type: String, 
    required: true 
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: {
    type: String
  },
  followUp: {
    type: String
  }
}, {
  timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;