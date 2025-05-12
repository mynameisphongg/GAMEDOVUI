#!/bin/sh

# Exit on any error
set -e

# Function to handle cleanup
cleanup() {
    echo "=== Cleanup Started ==="
    if [ -n "$NODE_PID" ]; then
        echo "Sending SIGTERM to Node process $NODE_PID"
        kill -TERM "$NODE_PID" 2>/dev/null || true
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

echo "=== Application Startup ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "=== Environment Check ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "MongoDB URI: ${MONGODB_URI:+***}"

# Check if required files exist
echo "=== Checking Required Files ==="
if [ ! -f "server.js" ]; then
    echo "Error: server.js not found"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Check MongoDB URI
if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI environment variable is not set"
    echo "Please set MONGODB_URI in Railway dashboard"
    exit 1
fi

# Wait for MongoDB to be ready
echo "=== Waiting for MongoDB ==="
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Testing MongoDB connection..."
    
    # Test MongoDB connection with timeout
    if node -e "
        const mongoose = require('mongoose');
        const timeout = setTimeout(() => {
            console.error('MongoDB connection timeout');
            process.exit(1);
        }, 5000);
        
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 2000,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        })
        .then(() => {
            clearTimeout(timeout);
            console.log('MongoDB connection successful');
            process.exit(0);
        })
        .catch(err => {
            clearTimeout(timeout);
            console.error('MongoDB connection error:', err.message);
            process.exit(1);
        });
    "; then
        echo "MongoDB is ready!"
        break
    fi
    
    echo "MongoDB not ready, waiting..."
    attempt=$((attempt + 1))
    sleep 2
done

if [ $attempt -gt $max_attempts ]; then
    echo "MongoDB connection failed after $max_attempts attempts"
    exit 1
fi

# Start the application with proper error handling
echo "=== Starting Server ==="
NODE_ENV=production node --trace-warnings server.js &
NODE_PID=$!

# Wait for the server to be ready
echo "Waiting for server to be ready..."
max_wait=30
wait_attempt=1
while [ $wait_attempt -le $max_wait ]; do
    if curl -s http://localhost:$PORT/health > /dev/null; then
        echo "Server is ready!"
        break
    fi
    echo "Server not ready yet, waiting... ($wait_attempt/$max_wait)"
    wait_attempt=$((wait_attempt + 1))
    sleep 2
done

if [ $wait_attempt -gt $max_wait ]; then
    echo "Server failed to start within $max_wait attempts"
    exit 1
fi

# Keep the script running and monitor the Node process
while kill -0 $NODE_PID 2>/dev/null; do
    sleep 1
done

# If we get here, the Node process has died
echo "Node process died unexpectedly"
exit 1
