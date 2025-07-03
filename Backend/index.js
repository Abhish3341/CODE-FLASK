require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./database/db');
const authRoutes = require('./routes/auth');
const problemsRoutes = require('./routes/problems');
const submissionsRoutes = require('./routes/submissions');
const compilerRoutes = require('./routes/compilers');
const scoresRoutes = require('./routes/scores');
const dashboardRoutes = require('./routes/dashboard');
const timeTrackingRoutes = require('./routes/timeTracking');
const aiHintRoutes = require('./routes/aiHint');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://codeflask.live',
      'https://www.codeflask.live',
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://codeflask-frontend.vercel.app',
      'https://codeflask.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CodeFlask API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/time', timeTrackingRoutes);
app.use('/api/ai', aiHintRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'CodeFlask API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep the process running instead of crashing
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process running instead of crashing
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not connected'}`);
  console.log(`🌐 CORS allowed origins: ${process.env.FRONTEND_URL || 'http://localhost:5173'}, https://codeflask.live, etc.`);
});