const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const Problem = require('../models/Problems');
const ActivityService = require('../services/ActivityService');

// Get all submissions for a user with enhanced error handling
router.get('/', authMiddleware, async (req, res) => {
    try {
        console.log('📋 Fetching submissions for user:', req.user.id);
        
        const submissions = await Submission.find({ 
            userId: req.user.id 
        }).sort({ submittedAt: -1 }).lean();

        console.log('📊 Found submissions:', submissions.length);

        if (submissions.length === 0) {
            return res.json([]);
        }

        const formattedSubmissions = await Promise.all(
            submissions.map(async (submission, index) => {
                let problemTitle = 'Unknown Problem';
                let problemDifficulty = 'Unknown';
                
                try {
                    const problemId = submission.problemId;
                    if (problemId) {
                        const problem = await Problem.findById(problemId).lean();
                        if (problem) {
                            problemTitle = problem.title;
                            problemDifficulty = problem.difficulty;
                        }
                    }
                } catch (error) {
                    console.error('Error finding problem for submission:', error);
                }

                const submittedDate = new Date(submission.submittedAt);
                const formattedDate = submittedDate.toLocaleDateString() + ' ' + 
                                   submittedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let status = 'Completed';
                if (submission.results && submission.results.length > 0) {
                    const result = submission.results[0];
                    if (result.error) {
                        status = 'Error';
                    } else if (result.output && 
                              (result.output.toLowerCase().includes('passed') || 
                               result.output.includes('✅') || 
                               result.output.includes('✓'))) {
                        status = 'Accepted';
                    } else if (result.output && result.output.toLowerCase().includes('failed')) {
                        status = 'Wrong Answer';
                    }
                }

                return {
                    id: submission._id,
                    problem: problemTitle,
                    difficulty: problemDifficulty,
                    status: status,
                    language: submission.language || 'Unknown',
                    runtime: submission.executionTime ? `${submission.executionTime}ms` : 'N/A',
                    memory: submission.memoryUsed ? `${submission.memoryUsed}KB` : 'N/A',
                    submittedAt: formattedDate,
                    code: submission.code,
                    output: submission.results?.[0]?.output || '',
                    submissionNumber: submissions.length - index
                };
            })
        );

        console.log('✅ Formatted submissions:', formattedSubmissions.length);
        res.json(formattedSubmissions);
    } catch (error) {
        console.error('❌ Error fetching submissions:', error);
        res.status(500).json({ 
            error: 'Failed to fetch submissions',
            details: error.message 
        });
    }
});

// Submit code with proper activity tracking
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { code, language, problemId, output, executionTime, memoryUsed, timeSpent } = req.body;

        // Validate required fields
        if (!code || !language || !problemId) {
            return res.status(400).json({ 
                error: 'Missing required fields: code, language, and problemId are required' 
            });
        }

        // Validate language
        const supportedLanguages = ['c', 'cpp', 'java', 'python'];
        if (!supportedLanguages.includes(language)) {
            return res.status(400).json({
                error: `Unsupported language: ${language}. Supported languages: ${supportedLanguages.join(', ')}`
            });
        }

        console.log('📤 Creating submission for user:', req.user.id, 'problem:', problemId);

        // Create submission record
        const submission = await Submission.create({
            userId: req.user.id,
            problemId,
            code,
            language,
            status: 'completed',
            results: [{
                output: output || '',
                status: 'completed',
                executionTime: executionTime || 0,
                memoryUsed: memoryUsed || 0
            }],
            executionTime: executionTime || 0,
            memoryUsed: memoryUsed || 0,
            submittedAt: new Date()
        });

        console.log('✅ Submission created with ID:', submission._id);

        // Record submission activity
        await ActivityService.recordSubmission(
            req.user.id,
            problemId,
            language,
            submission._id,
            executionTime || 0,
            timeSpent || 5
        );

        // Enhanced solution detection
        const isSuccessful = output && 
                           !output.toLowerCase().includes('error') && 
                           !output.toLowerCase().includes('exception') &&
                           !output.toLowerCase().includes('failed') &&
                           !output.toLowerCase().includes('traceback') &&
                           (output.toLowerCase().includes('passed') || 
                            output.toLowerCase().includes('success') ||
                            output.includes('✅') ||
                            output.includes('✓') ||
                            output.toLowerCase().includes('correct'));

        console.log('🔍 Solution detection result:', isSuccessful);

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
            console.log('🎉 Problem marked as solved!');
        }

        // Get updated submission count
        const totalSubmissions = await Submission.countDocuments({ userId: req.user.id });

        res.status(201).json({
            id: submission._id,
            message: isSuccessful ? 
                'Solution submitted and marked as solved! 🎉' : 
                'Submission recorded successfully',
            isSuccessful,
            submissionCount: totalSubmissions
        });

    } catch (error) {
        console.error('❌ Error creating submission:', error);
        res.status(500).json({ 
            error: 'Failed to create submission',
            details: error.message 
        });
    }
});

// Get specific submission details
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const submission = await Submission.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).lean();

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        let problemTitle = 'Unknown Problem';
        let problemDifficulty = 'Unknown';
        
        try {
            const problem = await Problem.findById(submission.problemId).lean();
            if (problem) {
                problemTitle = problem.title;
                problemDifficulty = problem.difficulty;
            }
        } catch (error) {
            console.error('Error finding problem for submission:', error);
        }

        const formattedSubmission = {
            id: submission._id,
            problem: problemTitle,
            difficulty: problemDifficulty,
            code: submission.code,
            language: submission.language,
            status: submission.status,
            output: submission.results?.[0]?.output || '',
            executionTime: submission.executionTime,
            memoryUsed: submission.memoryUsed,
            submittedAt: submission.submittedAt
        };

        res.json(formattedSubmission);
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ error: 'Failed to fetch submission' });
    }
});

// Get user submission statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const totalSubmissions = await Submission.countDocuments({ userId });
        
        // Get recent submissions (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSubmissions = await Submission.find({ 
            userId,
            submittedAt: { $gte: sevenDaysAgo }
        }).lean();

        // Calculate language breakdown
        const languageBreakdown = {};
        const allSubmissions = await Submission.find({ userId }).lean();
        
        allSubmissions.forEach(sub => {
            const lang = sub.language || 'unknown';
            languageBreakdown[lang] = (languageBreakdown[lang] || 0) + 1;
        });

        // Calculate average execution time
        const validExecutionTimes = allSubmissions
            .map(sub => sub.executionTime)
            .filter(time => time && time > 0);
        
        const averageExecutionTime = validExecutionTimes.length > 0 ? 
            Math.round(validExecutionTimes.reduce((sum, time) => sum + time, 0) / validExecutionTimes.length) : 0;

        res.json({
            totalSubmissions,
            recentSubmissions: recentSubmissions.length,
            languageBreakdown,
            averageExecutionTime
        });
    } catch (error) {
        console.error('Error fetching submission stats:', error);
        res.status(500).json({ error: 'Failed to fetch submission statistics' });
    }
});

module.exports = router;