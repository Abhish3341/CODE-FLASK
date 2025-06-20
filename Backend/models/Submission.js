const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['python', 'javascript', 'java', 'cpp']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'running', 'completed', 'error'],
        default: 'completed'
    },
    results: [{
        testCase: {
            input: mongoose.Schema.Types.Mixed,
            expectedOutput: mongoose.Schema.Types.Mixed
        },
        output: mongoose.Schema.Types.Mixed,
        status: String,
        error: String,
        executionTime: Number,
        memoryUsed: Number
    }],
    executionTime: Number,
    memoryUsed: Number,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Check if model exists before compiling
module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);