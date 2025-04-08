const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Activity = require('../models/Activity');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const submissions = await Activity.find({ 
            userId: req.user.id,
            type: 'submitted'
        })
        .sort({ timestamp: -1 })
        .populate('problemId', 'title');

        const formattedSubmissions = submissions.map(submission => ({
            id: submission._id,
            problem: submission.problemTitle,
            status: submission.status,
            language: submission.language,
            runtime: submission.runtime,
            memory: submission.memory,
            submittedAt: submission.timestamp
        }));

        res.json(formattedSubmissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

module.exports = router;