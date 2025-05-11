const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: [
    'https://gamedovuinp.up.railway.app',
    'https://gamedovui-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// MongoDB connection with retry logic
const connectWithRetry = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz_game';
    
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Initial connection attempt
connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    connectWithRetry();
});

// Add health check endpoint
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const health = {
        status: dbState === 1 ? 'healthy' : 'unhealthy',
        database: dbState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    };
    res.json(health);
});

// API routes
const questionRoutes = require('./routes/questions');
const playerRoutes = require('./routes/players');

app.use('/api/questions', questionRoutes);
app.use('/api/players', playerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'quiz-game-frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz-game-frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI:', process.env.MONGODB_URI ? '***' : 'Not set');
});
