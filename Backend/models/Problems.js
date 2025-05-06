const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
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
  version: {  // <-- New version field
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
