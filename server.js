const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
let server = null;
let isShuttingDown = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Middleware: Logging
app.use((req, res, next) => {
    if (isShuttingDown) return res.status(503).json({ error: 'Server is shutting down' });
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware: Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware: CORS
app.use(cors({
    origin: '*',  // Cho phép tất cả các nguồn
    credentials: true
}));

// Additional CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Cho phép tất cả các nguồn
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});


// Additional CORS headers
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

// Routes
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        dbState: mongoose.connection.readyState
    });
});
app.get('/health', (req, res) => {
    res.json({
        status: mongoose.connection.readyState === 1 ? 'ok' : 'not connected',
        dbState: mongoose.connection.readyState,
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// API Routes
const questionRoutes = require('./routes/questions');
const playerRoutes = require('./routes/players');
app.use('/api/questions', questionRoutes);
app.use('/api/players', playerRoutes);

// Serve static React app
app.use(express.static(path.join(__dirname, 'quiz-game-frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz-game-frontend/build/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// MongoDB connection with retry
async function connectWithRetry() {
    if (!process.env.MONGODB_URI) {
        console.error('❌ Missing MONGODB_URI in environment variables.');
        process.exit(1);
    }

    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('❌ Max DB connection attempts reached.');
        return;
    }

    connectionAttempts++;
    try {
        console.log(`🔌 Connecting to MongoDB (attempt ${connectionAttempts})...`);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        if (!server) startServer();
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        setTimeout(connectWithRetry, 5000);
    }
}

function startServer() {
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
        console.error('❌ Server error:', err.message);
    });
}

async function gracefulShutdown() {
    console.log('🛑 Graceful shutdown...');
    isShuttingDown = true;

    if (server) {
        await new Promise((resolve) => server.close(resolve));
        console.log('Server closed.');
    }

    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }

    process.exit(0);
}

// Handle shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

// Start connection
connectWithRetry();
