const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const CompilerService = require('../services/CompilerService');

// Execute code endpoint
router.post('/execute', authMiddleware, async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: 'Code and language are required'
      });
    }

    // Validate supported languages
    const supportedLanguages = ['c', 'cpp', 'java', 'python'];
    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        error: `Unsupported language: ${language}. Supported languages: ${supportedLanguages.join(', ')}`
      });
    }

    console.log(`Executing ${language} code for user ${req.user.id}`);
    
    const result = await CompilerService.executeCode(code, language, input);

    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
      language,
      executionMethod: result.executionMethod
    });

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      error: error.message || 'Code execution failed'
    });
  }
});

// Health check endpoint
router.get('/health', authMiddleware, async (req, res) => {
  try {
    const health = await CompilerService.getHealthStatus();
    
    res.json({
      status: health.status,
      docker: health.dockerAvailable ? 'available' : 'unavailable',
      supportedLanguages: health.supportedLanguages,
      message: health.dockerAvailable 
        ? 'Compiler service is running with Docker containerization'
        : 'Compiler service is running in fallback mode (native execution)',
      security: health.dockerAvailable ? 'high' : 'medium'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      message: 'Unable to check compiler service status'
    });
  }
});

// Get supported languages
router.get('/languages', authMiddleware, async (req, res) => {
  try {
    const health = await CompilerService.getHealthStatus();
    
    res.json({
      languages: health.supportedLanguages.map(lang => ({
        name: lang,
        displayName: lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1),
        dockerSupport: health.dockerAvailable,
        securityLevel: health.dockerAvailable ? 'high' : 'medium'
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get supported languages'
    });
  }
});

module.exports = router;