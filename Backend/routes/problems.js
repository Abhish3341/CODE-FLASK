const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Problem = require('../models/Problems');
const UserStats = require('../models/UserStats');
const Activity = require('../models/Activity');
const TemplateService = require('../services/TemplateService');
const ActivityService = require('../services/ActivityService');

// Get all problems with user's solve status and activity status
router.get('/', authMiddleware, async (req, res) => {
    try {
        const problems = await Problem.find().select('title difficulty category');
        
        // Get user's activities for all problems
        const userActivities = await Activity.find({ userId: req.user.id });
        
        // Create maps for quick lookup
        const attemptedProblems = new Set();
        const submittedProblems = new Set();
        const solvedProblems = new Set();
        
        userActivities.forEach(activity => {
            const problemIdStr = activity.problemId.toString();
            
            if (activity.type === 'attempted') {
                attemptedProblems.add(problemIdStr);
            } else if (activity.type === 'submitted') {
                submittedProblems.add(problemIdStr);
                attemptedProblems.add(problemIdStr);
            } else if (activity.type === 'solved') {
                solvedProblems.add(problemIdStr);
                submittedProblems.add(problemIdStr);
                attemptedProblems.add(problemIdStr);
            }
        });
        
        const problemsWithStatus = problems.map(problem => {
            const problemIdStr = problem._id.toString();
            
            // Determine the highest status achieved
            let status = 'not-attempted';
            if (attemptedProblems.has(problemIdStr)) {
                status = 'attempted';
            }
            if (submittedProblems.has(problemIdStr)) {
                status = 'submitted';
            }
            if (solvedProblems.has(problemIdStr)) {
                status = 'solved';
            }
            
            return {
                id: problem._id,
                title: problem.title,
                difficulty: problem.difficulty,
                category: problem.category,
                status: status,
                solved: solvedProblems.has(problemIdStr)
            };
        });

        res.json(problemsWithStatus);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

// Get specific problem details and record attempt
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Record that user viewed/attempted this problem
        await ActivityService.recordAttempt(req.user.id, req.params.id, 'python'); // Default language

        res.json(problem);
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ error: 'Failed to fetch problem' });
    }
});

// Get template for specific problem and language
router.get('/:id/template/:language', authMiddleware, async (req, res) => {
    try {
        const { id, language } = req.params;
        
        // Validate language
        const supportedLanguages = ['c', 'cpp', 'java', 'python'];
        if (!supportedLanguages.includes(language)) {
            return res.status(400).json({ error: 'Unsupported language' });
        }
        
        // Get problem data
        const problem = await Problem.findById(id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        
        // Record attempt with specific language
        await ActivityService.recordAttempt(req.user.id, id, language);
        
        // Generate template
        const template = TemplateService.getTemplateForProblem(language, id, {
            title: problem.title,
            description: problem.description,
            category: problem.category
        });
        
        res.json({
            language,
            problemId: id,
            template,
            problemType: TemplateService.detectProblemType(problem.title, problem.description, problem.category)
        });
        
    } catch (error) {
        console.error('Error generating template:', error);
        res.status(500).json({ error: 'Failed to generate template' });
    }
});

// Get user stats with real data and proper error handling
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Initialize default response structure
        const defaultResponse = {
            problemsSolved: 0,
            totalProblems: 0,
            successRate: 0,
            averageTime: 0,
            ranking: 0,
            totalSubmissions: 0,
            timeSpent: 0,
            difficultyBreakdown: {
                easy: { solved: 0, attempted: 0 },
                medium: { solved: 0, attempted: 0 },
                hard: { solved: 0, attempted: 0 }
            },
            languageBreakdown: {
                c: { solved: 0, attempted: 0 },
                cpp: { solved: 0, attempted: 0 },
                java: { solved: 0, attempted: 0 },
                python: { solved: 0, attempted: 0 }
            }
        };

        // Get total problems count
        let totalProblems = 0;
        try {
            totalProblems = await Problem.countDocuments();
        } catch (problemCountError) {
            console.error('Error counting problems:', problemCountError);
        }

        // Get or create user stats
        let userStats = null;
        try {
            userStats = await UserStats.findOne({ userId });
            if (!userStats) {
                userStats = await UserStats.create({ 
                    userId,
                    problemsSolved: 0,
                    totalSubmissions: 0,
                    totalAttempts: 0,
                    timeSpent: 0,
                    averageTime: 0,
                    successRate: 0,
                    rank: 0,
                    easyProblems: { solved: 0, attempted: 0 },
                    mediumProblems: { solved: 0, attempted: 0 },
                    hardProblems: { solved: 0, attempted: 0 },
                    languageStats: {
                        c: { solved: 0, attempted: 0 },
                        cpp: { solved: 0, attempted: 0 },
                        java: { solved: 0, attempted: 0 },
                        python: { solved: 0, attempted: 0 }
                    }
                });
            }
        } catch (userStatsError) {
            console.error('Error with user stats:', userStatsError);
            return res.json({ ...defaultResponse, totalProblems });
        }

        // Calculate user's rank among all users
        let ranking = 0;
        try {
            if (userStats.problemsSolved > 0) {
                const higherRankedUsers = await UserStats.countDocuments({
                    problemsSolved: { $gt: userStats.problemsSolved }
                });
                ranking = higherRankedUsers + 1;
            }
        } catch (rankingError) {
            console.error('Error calculating ranking:', rankingError);
        }

        // Safely build response with fallbacks
        const response = {
            problemsSolved: userStats?.problemsSolved || 0,
            totalProblems: totalProblems,
            successRate: userStats?.successRate || 0,
            averageTime: userStats?.averageTime || 0,
            ranking: ranking,
            totalSubmissions: userStats?.totalSubmissions || 0,
            timeSpent: Math.round((userStats?.timeSpent || 0) / 60),
            difficultyBreakdown: {
                easy: {
                    solved: userStats?.easyProblems?.solved || 0,
                    attempted: userStats?.easyProblems?.attempted || 0
                },
                medium: {
                    solved: userStats?.mediumProblems?.solved || 0,
                    attempted: userStats?.mediumProblems?.attempted || 0
                },
                hard: {
                    solved: userStats?.hardProblems?.solved || 0,
                    attempted: userStats?.hardProblems?.attempted || 0
                }
            },
            languageBreakdown: {
                c: {
                    solved: userStats?.languageStats?.c?.solved || 0,
                    attempted: userStats?.languageStats?.c?.attempted || 0
                },
                cpp: {
                    solved: userStats?.languageStats?.cpp?.solved || 0,
                    attempted: userStats?.languageStats?.cpp?.attempted || 0
                },
                java: {
                    solved: userStats?.languageStats?.java?.solved || 0,
                    attempted: userStats?.languageStats?.java?.attempted || 0
                },
                python: {
                    solved: userStats?.languageStats?.python?.solved || 0,
                    attempted: userStats?.languageStats?.python?.attempted || 0
                }
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(200).json({
            problemsSolved: 0,
            totalProblems: 0,
            successRate: 0,
            averageTime: 0,
            ranking: 0,
            totalSubmissions: 0,
            timeSpent: 0,
            difficultyBreakdown: {
                easy: { solved: 0, attempted: 0 },
                medium: { solved: 0, attempted: 0 },
                hard: { solved: 0, attempted: 0 }
            },
            languageBreakdown: {
                c: { solved: 0, attempted: 0 },
                cpp: { solved: 0, attempted: 0 },
                java: { solved: 0, attempted: 0 },
                python: { solved: 0, attempted: 0 }
            }
        });
    }
});

module.exports = router;