const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);

        // Add connection options for better reliability
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            family: 4, // Use IPv4, skip trying IPv6
            connectTimeoutMS: 10000, // Connection timeout
            socketTimeoutMS: 45000, // Socket timeout
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 2, // Minimum number of connections in the pool
            retryWrites: true, // Retry write operations
            retryReads: true, // Retry read operations
            autoIndex: process.env.NODE_ENV !== 'production' // Don't build indexes in production
        };

        // Log the MongoDB URI (without credentials)
        const uriForLogging = process.env.MONGODB_URI 
            ? process.env.MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@') 
            : 'mongodb://127.0.0.1:27017/codeflask';
        console.log(`Attempting to connect to MongoDB: ${uriForLogging}`);

        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeflask', options);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Add connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        
        // Don't exit the process, just log the error
        console.log('Will continue running with limited functionality');
        
        // Return null to indicate connection failure
        return null;
    }
};

module.exports = connectDB;