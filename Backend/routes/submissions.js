const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const Problem = require('../models/Problems');
const ActivityService = require('../services/ActivityService');

// Get all submissions for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ 
            userId: req.user.id 
        }).sort({ submittedAt: -1 });

        const formattedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                let problemTitle = 'Unknown Problem';
                let problemDifficulty = 'Unknown';
                
                try {
                    const problem = await Problem.findById(submission.problemId);
                    if (problem) {
                        problemTitle = problem.title;
                        problemDifficulty = problem.difficulty;
                    }
                } catch (error) {
                    console.error('Error finding problem:', error);
                }

                return {
                    id: submission._id,
                    problem: problemTitle,
                    difficulty: problemDifficulty,
                    status: submission.status || 'completed',
                    language: submission.language,
                    runtime: submission.executionTime ? `${submission.executionTime}ms` : 'N/A',
                    memory: submission.memoryUsed ? `${submission.memoryUsed}KB` : 'N/A',
                    submittedAt: submission.submittedAt.toISOString(),
                    code: submission.code // Include code for viewing
                };
            })
        );

        res.json(formattedSubmissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Submit code with activity tracking
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { code, language, problemId, output, executionTime, memoryUsed, timeSpent } = req.body;

        if (!code || !language || !problemId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create submission
        const submission = await Submission.create({
            userId: req.user.id,
            problemId,
            code,
            language,
            status: 'completed',
            results: [{
                output,
                status: 'completed',
                executionTime,
                memoryUsed
            }],
            executionTime,
            memoryUsed,
            submittedAt: new Date()
        });

        // Record submission activity
        await ActivityService.recordSubmission(
            req.user.id,
            problemId,
            language,
            submission._id,
            executionTime || 0,
            timeSpent || 5 // Default 5 minutes if not provided
        );

        // Check if this is a successful solution (basic check)
        const isSuccessful = output && !output.toLowerCase().includes('error') && 
                           !output.toLowerCase().includes('exception');

        if (isSuccessful) {
            // Record as solved
            await ActivityService.recordSolution(
                req.user.id,
                problemId,
                language,
                submission._id,
                executionTime || 0,
                timeSpent || 5
            );
        }

        res.status(201).json({
            id: submission._id,
            message: 'Submission created successfully',
            isSuccessful
        });
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ error: 'Failed to create submission' });
    }
});

// Get specific submission
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const submission = await Submission.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        let problemTitle = 'Unknown Problem';
        try {
            const problem = await Problem.findById(submission.problemId);
            if (problem) {
                problemTitle = problem.title;
            }
        } catch (error) {
            console.error('Error finding problem for submission:', error);
        }

        res.json({
            id: submission._id,
            problem: problemTitle,
            code: submission.code,
            language: submission.language,
            status: submission.status,
            output: submission.results?.[0]?.output || '',
            executionTime: submission.executionTime,
            memoryUsed: submission.memoryUsed,
            submittedAt: submission.submittedAt
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ error: 'Failed to fetch submission' });
    }
});

module.exports = router;