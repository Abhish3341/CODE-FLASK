const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');

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
            results: submission.results,
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