const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please set these variables in Railway dashboard');
    process.exit(1);
}

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    'https://gamedovuinpn.up.railway.app',
    'https://gamedovuinp.up.railway.app',
    'https://gamedovui-production.up.railway.app',
    'http://localhost:3000',
    'http://localhost:5001'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add CORS headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// MongoDB connection with retry logic
const connectWithRetry = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', MONGODB_URI ? '***' : 'Not set');
        console.log('Environment:', process.env.NODE_ENV || 'development');
        
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
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
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
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        mongodb: {
            state: dbState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        }
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
