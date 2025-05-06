const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required fields' });
    }

    // Map your language ID to Piston-supported language names
    const languageMap = {
      cpp: 'cpp',
      python: 'python3',
      javascript: 'javascript',
      java: 'java'
    };

    const pistonLang = languageMap[language.toLowerCase()];
    if (!pistonLang) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: pistonLang,
      source: code,
      stdin: input || ''
    });

    const output = response.data.output || '';
    const executionTime = response.data?.runtime || 0;

    res.json({
      success: true,
      output,
      executionTime,
      memoryUsed: null // Piston doesn't return this
    });
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: 'Failed to compile/execute code' });
  }
});

module.exports = router;
