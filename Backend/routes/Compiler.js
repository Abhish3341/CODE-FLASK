const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { code, language, input } = req.body;
    
    // Validate required fields
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required fields' });
    }

    // For now, just return the input as output (mock implementation)
    const result = {
      success: true,
      output: input || 'No input provided',
      executionTime: 100, // mock execution time in ms
      memoryUsed: 1024 // mock memory usage in KB
    };

    res.json(result);
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;