const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const Problem = require('../models/Problems');

// Get all submissions for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ 
            userId: req.user.id 
        }).sort({ submittedAt: -1 });

        const formattedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                let problemTitle = 'Unknown Problem';
                
                try {
                    // Try to find the problem by ObjectId first, then by string ID
                    let problem = await Problem.findById(submission.problemId);
                    if (!problem && typeof submission.problemId === 'string') {
                        // If not found by ObjectId, try finding by string match
                        problem = await Problem.findOne({ 
                            $or: [
                                { _id: submission.problemId },
                                { title: { $regex: submission.problemId, $options: 'i' } }
                            ]
                        });
                    }
                    
                    if (problem) {
                        problemTitle = problem.title;
                    }
                } catch (error) {
                    console.error('Error finding problem:', error);
                }

                return {
                    id: submission._id,
                    problem: problemTitle,
                    status: submission.status || 'completed',
                    language: submission.language,
                    runtime: submission.executionTime ? `${submission.executionTime}ms` : 'N/A',
                    memory: submission.memoryUsed ? `${submission.memoryUsed}KB` : 'N/A',
                    submittedAt: submission.submittedAt.toISOString()
                };
            })
        );

        res.json(formattedSubmissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Submit code
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { code, language, problemId, output, executionTime, memoryUsed } = req.body;

        if (!code || !language || !problemId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

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

        res.status(201).json({
            id: submission._id,
            message: 'Submission created successfully'
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