const mongoose = require('mongoose');

// Only create the model if it hasn't been compiled yet
if (!mongoose.models.Problem) {
  const testCaseSchema = new mongoose.Schema({
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  });

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
    constraints: {
      type: String,
      required: true
    },
    sampleInput: {
      type: String,
      required: true
    },
    sampleOutput: {
      type: String,
      required: true
    },
    testCases: [testCaseSchema],
    timeLimit: {
      type: Number,
      default: 2000, // in milliseconds
      required: true
    },
    memoryLimit: {
      type: Number,
      default: 512, // in MB
      required: true
    }
  }, {
    timestamps: true
  });

  mongoose.model('Problem', problemSchema);
}

module.exports = mongoose.model('Problem');