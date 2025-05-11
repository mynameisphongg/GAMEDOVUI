const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Enable better error logging
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit on uncaught exception to allow for recovery
});

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

// Add a simple root endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        mongodb: {
            state: mongoose.connection.readyState,
            host: mongoose.connection.host || 'not connected'
        }
    });
});

// Add health check endpoint
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    res.json({ 
        status: dbState === 1 ? 'ok' : 'connecting',
        timestamp: new Date().toISOString(),
        mongodb: {
            state: dbState,
            host: mongoose.connection.host || 'not connected'
        }
    });
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
        console.error('Max reconnection attempts reached. Please check your MongoDB connection.');
        process.exit(1);
    }

    isConnecting = true;
    connectionAttempts++;
    const MONGODB_URI = process.env.MONGODB_URI;
    
    try {
        console.log(`Attempting to connect to MongoDB (attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            retryWrites: true,
            w: 'majority'
        });
        
        console.log('Connected to MongoDB successfully');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        // Reset connection attempts on successful connection
        connectionAttempts = 0;
        
        // Start the server only after MongoDB connects
        if (!server) {
            startServer();
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log(`Retrying connection in 5 seconds... (attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(() => {
            isConnecting = false;
            connectWithRetry();
        }, 5000);
    }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    isConnecting = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    isConnecting = false;
    connectWithRetry();
});

function startServer() {
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Environment:', process.env.NODE_ENV);
    });

    // Handle server errors
    server.on('error', (error) => {
        console.error('Server error:', error);
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        }
    });
}

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
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
connectWithRetry();
