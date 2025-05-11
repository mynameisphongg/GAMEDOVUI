const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Log startup information
console.log('=== Application Startup ===');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? '***' : 'Not set');

// Enable better error logging
process.on('unhandledRejection', (reason, promise) => {
    console.error('=== Unhandled Rejection ===');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
});

process.on('uncaughtException', (error) => {
    console.error('=== Uncaught Exception ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    // Don't exit on uncaught exception to allow for recovery
});

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('=== Missing Environment Variables ===');
    console.error('Missing variables:', missingEnvVars);
    console.error('Please set these variables in Railway dashboard');
    process.exit(1);
}

const app = express();

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

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
            }
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
            }
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

let server;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

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
        process.exit(1);
    }

    isConnecting = true;
    connectionAttempts++;
    const MONGODB_URI = process.env.MONGODB_URI;
    
    try {
        console.log(`=== MongoDB Connection Attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS} ===`);
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            retryWrites: true,
            w: 'majority'
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
    connectWithRetry();
});

function startServer() {
    try {
        const PORT = process.env.PORT || 3000;
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log('=== Server Started Successfully ===');
            console.log(`Server is running on port ${PORT}`);
            console.log('Environment:', process.env.NODE_ENV);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('=== Server Error ===');
            console.error('Error:', error);
            console.error('Stack:', error.stack);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use`);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('=== Server Start Error ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGTERM', () => {
    console.log('=== SIGTERM Received ===');
    console.log('Closing server...');
    if (server) {
        server.close(() => {
            console.log('Server closed');
            mongoose.connection.close(false, () => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    } else {
        process.exit(0);
    }
});

// Start MongoDB connection
console.log('=== Starting Application ===');
connectWithRetry();
