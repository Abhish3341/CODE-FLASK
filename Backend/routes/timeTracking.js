const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const TimeTrackingService = require('../services/TimeTrackingService');

// Start a new session
router.post('/session/start', authMiddleware, async (req, res) => {
  try {
    const { sessionType = 'manual' } = req.body;
    const session = await TimeTrackingService.startSession(req.user.id, sessionType);
    
    res.json({
      success: true,
      session: {
        id: session._id,
        startTime: session.startTime,
        sessionType: session.sessionType
      }
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// End current session
router.post('/session/end', authMiddleware, async (req, res) => {
  try {
    const session = await TimeTrackingService.endActiveSession(req.user.id);
    
    res.json({
      success: true,
      session: session ? {
        id: session._id,
        duration: session.duration,
        endTime: session.endTime
      } : null
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Update session activity (heartbeat)
router.post('/session/activity', authMiddleware, async (req, res) => {
  try {
    await TimeTrackingService.updateSessionActivity(req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating session activity:', error);
    res.status(500).json({ error: 'Failed to update session activity' });
  }
});

// Get session statistics
router.get('/session/stats', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const stats = await TimeTrackingService.getSessionStats(req.user.id, parseInt(days));
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting session stats:', error);
    res.status(500).json({ error: 'Failed to get session stats' });
  }
});

// Start problem time tracking
router.post('/problem/start', authMiddleware, async (req, res) => {
  try {
    const { problemId, problemTitle, language } = req.body;
    
    if (!problemId || !problemTitle || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const problemTime = await TimeTrackingService.startProblemTime(
      req.user.id, 
      problemId, 
      problemTitle, 
      language
    );
    
    res.json({
      success: true,
      problemTime: {
        id: problemTime._id,
        openedAt: problemTime.openedAt,
        timeTaken: problemTime.timeTaken
      }
    });
  } catch (error) {
    console.error('Error starting problem time:', error);
    res.status(500).json({ error: 'Failed to start problem time tracking' });
  }
});

// Record problem run
router.post('/problem/run', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.body;
    
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required' });
    }
    
    const problemTime = await TimeTrackingService.recordProblemRun(req.user.id, problemId);
    
    res.json({
      success: true,
      runs: problemTime?.runs || 0
    });
  } catch (error) {
    console.error('Error recording problem run:', error);
    res.status(500).json({ error: 'Failed to record problem run' });
  }
});

// Record problem submission
router.post('/problem/submit', authMiddleware, async (req, res) => {
  try {
    const { problemId, isCorrect = false } = req.body;
    
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required' });
    }
    
    const problemTime = await TimeTrackingService.recordProblemSubmission(
      req.user.id, 
      problemId, 
      isCorrect
    );
    
    res.json({
      success: true,
      problemTime: problemTime ? {
        timeTaken: problemTime.timeTaken,
        attempts: problemTime.attempts,
        isSolved: problemTime.isSolved
      } : null
    });
  } catch (error) {
    console.error('Error recording problem submission:', error);
    res.status(500).json({ error: 'Failed to record problem submission' });
  }
});

// Get problem time statistics
router.get('/problem/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await TimeTrackingService.getProblemTimeStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Error getting problem time stats:', error);
    res.status(500).json({ error: 'Failed to get problem time stats' });
  }
});

// Get dashboard time statistics
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await TimeTrackingService.getDashboardTimeStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard time stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard time stats' });
  }
});

module.exports = router;