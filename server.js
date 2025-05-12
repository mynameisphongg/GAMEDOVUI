const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
let server = null;
let isShuttingDown = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Middleware
app.use((req, res, next) => {
    if (isShuttingDown) return res.status(503).json({ error: 'Server is shutting down' });
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5001',
    'https://dovuinnp.up.railway.app',
    'https://gamedovui-production.up.railway.app',
    'https://*.up.railway.app'  // Allow all Railway subdomains
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(allowed => origin.match(allowed))) {
            callback(null, true);
        } else {
            console.log('CORS blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        dbState: mongoose.connection.readyState,
        connectionAttempts
    };
    
    if (mongoose.connection.readyState !== 1) {
        health.status = 'degraded';
        health.dbState = 'disconnected';
    }
    
    res.status(mongoose.connection.readyState === 1 ? 200 : 503).json(health);
});

// API Routes
const questionRoutes = require('./routes/questions');
const playerRoutes = require('./routes/players');
app.use('/api/questions', questionRoutes);
app.use('/api/players', playerRoutes);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'quiz-game-frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz-game-frontend/build/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// MongoDB connection with retry
async function connectWithRetry() {
    if (!process.env.MONGODB_URI) {
        console.error('❌ Missing MONGODB_URI in environment variables');
        process.exit(1);
    }

    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('❌ Max DB connection attempts reached');
        process.exit(1);
    }

    connectionAttempts++;
    try {
        console.log(`🔌 Connecting to MongoDB (attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 2000,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        });
        console.log('✅ Connected to MongoDB');
        
        if (!server) {
            startServer();
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
            console.log(`Retrying in 5 seconds... (${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.error('Max reconnection attempts reached. Exiting...');
            process.exit(1);
        }
    }
}

function startServer() {
    server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
        console.error('❌ Server error:', err.message);
        if (err.code === 'EADDRINUSE') {
            console.log('Port is in use, retrying in 5 seconds...');
            setTimeout(() => {
                server.close();
                startServer();
            }, 5000);
        }
    });
}

async function gracefulShutdown() {
    console.log('🛑 Graceful shutdown initiated...');
    isShuttingDown = true;

    if (server) {
        await new Promise((resolve) => {
            server.close(() => {
                console.log('Server closed');
                resolve();
            });
        });
    }

    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }

    process.exit(0);
}

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    gracefulShutdown();
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

// Start the application
connectWithRetry();
