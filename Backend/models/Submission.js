const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Add index for faster queries
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
        index: true // Add index for faster queries
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['python', 'javascript', 'java', 'cpp'],
        index: true // Add index for filtering
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'running', 'completed', 'error'],
        default: 'completed',
        index: true // Add index for filtering
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
    executionTime: {
        type: Number,
        default: 0
    },
    memoryUsed: {
        type: Number,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        index: true // Add index for sorting
    }
}, {
    timestamps: true
});

// Compound index for efficient user submission queries
submissionSchema.index({ userId: 1, submittedAt: -1 });

// Compound index for problem-specific queries
submissionSchema.index({ problemId: 1, submittedAt: -1 });

// Check if model exists before compiling
module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);