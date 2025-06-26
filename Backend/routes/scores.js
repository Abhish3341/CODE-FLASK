const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Score = require('../models/Score');
const Problem = require('../models/Problems');
const Submission = require('../models/Submission');

// Get user's score for a specific problem
router.get('/problem/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    const score = await Score.findOne({ userId, problemId })
      .populate('problemId', 'title difficulty category');

    if (!score) {
      return res.json({
        score: 0,
        clickedHint: false,
        clickedSolution: false,
        wrongAttempts: 0,
        passed: false,
        exists: false
      });
    }

    res.json({
      ...score.toObject(),
      exists: true
    });
  } catch (error) {
    console.error('Error fetching problem score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
});

// Record hint usage
router.post('/hint/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Find or create score record
    let score = await Score.findOne({ userId, problemId });
    
    if (!score) {
      score = new Score({
        userId,
        problemId,
        problemTitle: problem.title,
        language: req.body.language || 'python'
      });
    }

    // Update hint usage
    score.clickedHint = true;
    score.updateScore();
    await score.save();

    console.log(`💡 User ${userId} used hint for problem ${problemId}`);

    res.json({
      message: 'Hint usage recorded',
      score: score.finalScore,
      penaltyApplied: 30
    });
  } catch (error) {
    console.error('Error recording hint usage:', error);
    res.status(500).json({ error: 'Failed to record hint usage' });
  }
});

// Record solution viewing
router.post('/solution/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Find or create score record
    let score = await Score.findOne({ userId, problemId });
    
    if (!score) {
      score = new Score({
        userId,
        problemId,
        problemTitle: problem.title,
        language: req.body.language || 'python'
      });
    }

    // Update solution viewing
    score.clickedSolution = true;
    score.updateScore(); // This will set score to 0
    await score.save();

    console.log(`🔓 User ${userId} viewed solution for problem ${problemId} - Score reset to 0`);

    res.json({
      message: 'Solution viewing recorded - Score reset to 0',
      score: score.finalScore,
      penaltyApplied: 100
    });
  } catch (error) {
    console.error('Error recording solution viewing:', error);
    res.status(500).json({ error: 'Failed to record solution viewing' });
  }
});

// Update score on submission
router.post('/submission/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    const { passed, language, submissionId, timeSpent } = req.body;

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Find or create score record
    let score = await Score.findOne({ userId, problemId });
    
    if (!score) {
      score = new Score({
        userId,
        problemId,
        problemTitle: problem.title,
        language: language || 'python'
      });
    }

    // Update submission data
    if (!passed) {
      score.wrongAttempts += 1;
    } else {
      score.passed = true;
    }

    if (submissionId) {
      score.submissionId = submissionId;
    }

    if (timeSpent) {
      score.timeSpent = timeSpent;
    }

    score.language = language || score.language;
    score.updateScore();
    await score.save();

    const message = passed 
      ? `🎯 You scored ${score.finalScore}/100!`
      : `❌ Wrong attempt recorded. Current score: ${score.finalScore}/100`;

    console.log(`📊 Score updated for user ${userId}, problem ${problemId}: ${score.finalScore}/100`);

    res.json({
      message,
      score: score.finalScore,
      wrongAttempts: score.wrongAttempts,
      passed: score.passed,
      clickedHint: score.clickedHint,
      clickedSolution: score.clickedSolution
    });
  } catch (error) {
    console.error('Error updating submission score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Get user's overall score summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const scores = await Score.find({ userId })
      .populate('problemId', 'title difficulty category')
      .sort({ submittedAt: -1 });

    const summary = {
      totalProblems: scores.length,
      solvedProblems: scores.filter(s => s.passed).length,
      averageScore: 0,
      totalScore: 0,
      hintsUsed: scores.filter(s => s.clickedHint).length,
      solutionsViewed: scores.filter(s => s.clickedSolution).length,
      difficultyBreakdown: {
        easy: { solved: 0, attempted: 0, avgScore: 0 },
        medium: { solved: 0, attempted: 0, avgScore: 0 },
        hard: { solved: 0, attempted: 0, avgScore: 0 }
      },
      languageBreakdown: {
        c: { solved: 0, attempted: 0, avgScore: 0 },
        cpp: { solved: 0, attempted: 0, avgScore: 0 },
        java: { solved: 0, attempted: 0, avgScore: 0 },
        python: { solved: 0, attempted: 0, avgScore: 0 }
      },
      recentScores: scores.slice(0, 10)
    };

    // Calculate totals and averages
    const passedScores = scores.filter(s => s.passed);
    if (passedScores.length > 0) {
      summary.totalScore = passedScores.reduce((sum, s) => sum + s.finalScore, 0);
      summary.averageScore = Math.round(summary.totalScore / passedScores.length);
    }

    // Calculate difficulty breakdown
    scores.forEach(score => {
      if (score.problemId && score.problemId.difficulty) {
        const difficulty = score.problemId.difficulty.toLowerCase();
        if (summary.difficultyBreakdown[difficulty]) {
          summary.difficultyBreakdown[difficulty].attempted++;
          if (score.passed) {
            summary.difficultyBreakdown[difficulty].solved++;
          }
        }
      }
    });

    // Calculate average scores for each difficulty
    Object.keys(summary.difficultyBreakdown).forEach(difficulty => {
      const difficultyScores = scores.filter(s => 
        s.problemId && 
        s.problemId.difficulty && 
        s.problemId.difficulty.toLowerCase() === difficulty && 
        s.passed
      );
      if (difficultyScores.length > 0) {
        summary.difficultyBreakdown[difficulty].avgScore = Math.round(
          difficultyScores.reduce((sum, s) => sum + s.finalScore, 0) / difficultyScores.length
        );
      }
    });

    // Calculate language breakdown
    scores.forEach(score => {
      if (summary.languageBreakdown[score.language]) {
        summary.languageBreakdown[score.language].attempted++;
        if (score.passed) {
          summary.languageBreakdown[score.language].solved++;
        }
      }
    });

    // Calculate average scores for each language
    Object.keys(summary.languageBreakdown).forEach(language => {
      const languageScores = scores.filter(s => s.language === language && s.passed);
      if (languageScores.length > 0) {
        summary.languageBreakdown[language].avgScore = Math.round(
          languageScores.reduce((sum, s) => sum + s.finalScore, 0) / languageScores.length
        );
      }
    });

    res.json(summary);
  } catch (error) {
    console.error('Error fetching score summary:', error);
    res.status(500).json({ error: 'Failed to fetch score summary' });
  }
});

// Get leaderboard for a specific problem
router.get('/leaderboard/:problemId', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const topScores = await Score.find({ 
      problemId, 
      passed: true 
    })
    .populate('userId', 'firstname lastname')
    .sort({ finalScore: -1, submittedAt: 1 })
    .limit(limit);

    const leaderboard = topScores.map((score, index) => ({
      rank: index + 1,
      user: {
        name: `${score.userId.firstname} ${score.userId.lastname}`,
        id: score.userId._id
      },
      score: score.finalScore,
      language: score.language,
      timeSpent: score.timeSpent,
      submittedAt: score.submittedAt,
      usedHint: score.clickedHint
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get global leaderboard
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Aggregate user scores
    const userScores = await Score.aggregate([
      { $match: { passed: true } },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$finalScore' },
          averageScore: { $avg: '$finalScore' },
          problemsSolved: { $sum: 1 },
          hintsUsed: { $sum: { $cond: ['$clickedHint', 1, 0] } },
          solutionsViewed: { $sum: { $cond: ['$clickedSolution', 1, 0] } }
        }
      },
      { $sort: { averageScore: -1, totalScore: -1, problemsSolved: -1 } },
      { $limit: limit }
    ]);

    // Populate user details
    const populatedScores = await Score.populate(userScores, {
      path: '_id',
      select: 'firstname lastname',
      model: 'User'
    });

    const leaderboard = populatedScores.map((userScore, index) => ({
      rank: index + 1,
      user: {
        name: `${userScore._id.firstname} ${userScore._id.lastname}`,
        id: userScore._id._id
      },
      averageScore: Math.round(userScore.averageScore),
      totalScore: userScore.totalScore,
      problemsSolved: userScore.problemsSolved,
      hintsUsed: userScore.hintsUsed,
      solutionsViewed: userScore.solutionsViewed
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;