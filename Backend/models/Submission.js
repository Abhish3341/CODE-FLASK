const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
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
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['c', 'cpp', 'java', 'python'],
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'running', 'completed', 'error'],
        default: 'completed',
        index: true
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
        index: true
    }
}, {
    timestamps: true
});

submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ problemId: 1, submittedAt: -1 });

module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);