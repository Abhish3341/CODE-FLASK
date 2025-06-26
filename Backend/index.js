require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db');
const cors = require('cors');

const app = express();

// Connect to MongoDB first
connectDB().then(() => {
    console.log('Database connected successfully');
}).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/compiler', require('./routes/compiler'));
app.use('/api/scores', require('./routes/scores')); // Add scores route

// 404 handler - Changed to app.use to handle all HTTP methods
app.use('*', (req, res) => {
    console.log('404 for path:', req.path);
    res.status(404).json({ error: `Route ${req.path} not found` });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});