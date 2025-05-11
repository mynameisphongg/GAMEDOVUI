const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Keep track of application state
let isShuttingDown = false;
let server = null;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Log startup information
console.log('=== Application Startup ===');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Memory usage:', process.memoryUsage());

// Debug environment variables
console.log('=== Environment Variables Debug ===');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log('MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set');
console.log('All environment variables:', Object.keys(process.env));

// Handle process signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('=== Unhandled Rejection ===');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    // Don't exit, just log the error
});

process.on('uncaughtException', (error) => {
    console.error('=== Uncaught Exception ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    // Don't exit, just log the error
});

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    console.error('=== Missing Environment Variables ===');
    console.error('MONGODB_URI is required');
    console.error('Current environment variables:', process.env);
    process.exit(1);
}

const app = express();

// Add request logging middleware
app.use((req, res, next) => {
    if (isShuttingDown) {
        return res.status(503).json({ error: 'Server is shutting down' });
    }
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Increase JSON payload limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
            console.log('CORS blocked request from:', origin);
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

// Add a simple root endpoint
app.get('/', (req, res) => {
    try {
        const response = { 
            status: 'ok', 
            message: 'Server is running',
            mongodb: {
                state: mongoose.connection.readyState,
                host: mongoose.connection.host || 'not connected'
            },
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };
        console.log('Root endpoint response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error in root endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add health check endpoint
app.get('/health', (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const response = { 
            status: dbState === 1 ? 'ok' : 'connecting',
            timestamp: new Date().toISOString(),
            mongodb: {
                state: dbState,
                host: mongoose.connection.host || 'not connected'
            },
            memory: process.memoryUsage(),
            uptime: process.uptime()
        };
        console.log('Health check response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error in health check:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API routes
const questionRoutes = require('./routes/questions');
const playerRoutes = require('./routes/players');

app.use('/api/questions', questionRoutes);
app.use('/api/players', playerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('=== Error Middleware ===');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
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
    try {
        res.sendFile(path.join(__dirname, 'quiz-game-frontend/build', 'index.html'));
    } catch (error) {
        console.error('Error serving React app:', error);
        res.status(500).send('Error serving application');
    }
});

// MongoDB connection with retry logic
const connectWithRetry = async () => {
    if (isConnecting) {
        console.log('Already attempting to connect to MongoDB...');
        return;
    }

    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('=== Max Reconnection Attempts Reached ===');
        console.error('Please check your MongoDB connection settings');
        console.error('Connection attempts:', connectionAttempts);
        // Don't exit, just log the error and keep trying
        setTimeout(() => {
            connectionAttempts = 0;
            connectWithRetry();
        }, 30000); // Try again after 30 seconds
        return;
    }

    isConnecting = true;
    connectionAttempts++;
    
    try {
        console.log(`=== MongoDB Connection Attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS} ===`);
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 5,
            heartbeatFrequencyMS: 2000,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        });
        
        console.log('=== MongoDB Connected Successfully ===');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        // Reset connection attempts on successful connection
        connectionAttempts = 0;
        
        // Start the server only after MongoDB connects
        if (!server) {
            startServer();
        }
    } catch (err) {
        console.error('=== MongoDB Connection Error ===');
        console.error('Error:', err);
        console.error('Stack:', err.stack);
        console.log(`Retrying connection in 5 seconds... (attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        
        // Don't exit on connection error, just retry
        setTimeout(() => {
            isConnecting = false;
            connectWithRetry();
        }, 5000);
    }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('=== MongoDB Connection Error Event ===');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    isConnecting = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('=== MongoDB Disconnected ===');
    console.log('Attempting to reconnect...');
    isConnecting = false;
    if (!isShuttingDown) {
        connectWithRetry();
    }
});

function startServer() {
    try {
        const PORT = process.env.PORT || 3000;
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log('=== Server Started Successfully ===');
            console.log(`Server is running on port ${PORT}`);
            console.log('Environment:', process.env.NODE_ENV);
            console.log('Memory usage:', process.memoryUsage());
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('=== Server Error ===');
            console.error('Error:', error);
            console.error('Stack:', error.stack);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use`);
                // Don't exit, just log the error
            }
        });

        // Handle server close
        server.on('close', () => {
            console.log('=== Server Closed ===');
        });
    } catch (error) {
        console.error('=== Server Start Error ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        // Don't exit, just log the error
    }
}

// Graceful shutdown function
async function gracefulShutdown() {
    console.log('=== Graceful Shutdown Started ===');
    isShuttingDown = true;

    try {
        // Close server first
        if (server) {
            await new Promise((resolve) => {
                server.close(() => {
                    console.log('Server closed');
                    resolve();
                });
            });
        }

        // Then close MongoDB connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close(false);
            console.log('MongoDB connection closed');
        }

        console.log('=== Graceful Shutdown Completed ===');
        process.exit(0);
    } catch (error) {
        console.error('=== Graceful Shutdown Error ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Start MongoDB connection
console.log('=== Starting Application ===');
connectWithRetry();
