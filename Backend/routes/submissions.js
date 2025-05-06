const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');

// Get all submissions for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ 
            userId: req.user.id 
        })
        .sort({ submittedAt: -1 })
        .populate('problemId', 'title');

        const formattedSubmissions = submissions.map(submission => ({
            id: submission._id,
            problem: submission.problemId.title,
            status: submission.status,
            language: submission.language,
            runtime: submission.executionTime ? `${submission.executionTime}ms` : 'N/A',
            memory: submission.memoryUsed ? `${submission.memoryUsed}KB` : 'N/A',
            submittedAt: submission.submittedAt.toISOString()
        }));

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
            output,
            executionTime,
            memoryUsed,
            submittedAt: new Date()
        });

        res.status(201).json(submission);
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
        }).populate('problemId', 'title');

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            id: submission._id,
            problem: submission.problemId.title,
            code: submission.code,
            language: submission.language,
            status: submission.status,
            output: submission.output,
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