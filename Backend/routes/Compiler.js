const express = require('express');
const router = express.Router();
const compilerService = require('../services/compilerService');
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const Problem = require('../models/Problems');

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    
    // Validate input
    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Run test cases
    let passedTests = 0;
    const results = [];

    for (const testCase of problem.testCases) {
      const result = await compilerService.compileAndRun(code, language, testCase.input);
      
      if (!result.success) {
        return res.status(400).json({ error: 'Compilation error', details: result.error });
      }

      const passed = result.output.trim() === testCase.output.trim();
      if (passed) passedTests++;

      if (!testCase.isHidden) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: result.output,
          passed,
          executionTime: result.executionTime
        });
      }
    }

    // Create submission record
    const submission = await Submission.create({
      userId: req.user.id,
      problemId,
      language,
      code,
      status: passedTests === problem.testCases.length ? 'Accepted' : 'Wrong Answer',
      testCasesPassed: passedTests,
      totalTestCases: problem.testCases.length,
      runtime: Math.max(...results.map(r => r.executionTime))
    });

    // Update problem statistics
    problem.totalSubmissions += 1;
    if (passedTests === problem.testCases.length) {
      problem.acceptance = ((problem.acceptance * (problem.totalSubmissions - 1) + 100) / problem.totalSubmissions);
    } else {
      problem.acceptance = ((problem.acceptance * (problem.totalSubmissions - 1)) / problem.totalSubmissions);
    }
    await problem.save();

    res.json({
      submissionId: submission._id,
      status: submission.status,
      testCasesPassed: passedTests,
      totalTestCases: problem.testCases.length,
      results: results
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;