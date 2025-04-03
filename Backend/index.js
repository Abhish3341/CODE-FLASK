require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db'); // Update path to match your structure
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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});