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

# Start the application with proper error handling
echo "=== Starting Server ==="
NODE_ENV=production node --trace-warnings --max-old-space-size=512 server.js &
NODE_PID=$!

# Wait for the server to be ready
echo "Waiting for server to be ready..."
max_wait=120
wait_attempt=1
while [ $wait_attempt -le $max_wait ]; do
    if curl -s http://localhost:$PORT/health > /dev/null; then
        health_status=$(curl -s http://localhost:$PORT/health)
        if echo "$health_status" | grep -q '"status":"ok"'; then
            echo "Server is healthy and ready!"
            break
        fi
        echo "Server is starting, status: $health_status"
    else
        echo "Server not responding, attempt $wait_attempt/$max_wait"
    fi
    
    if [ $wait_attempt -eq $max_wait ]; then
        echo "Server failed to become healthy within $max_wait attempts"
        echo "Last health check response:"
        curl -s http://localhost:$PORT/health || echo "No response from server"
        exit 1
    fi
    
    wait_attempt=$((wait_attempt + 1))
    sleep 5
done

# Keep the script running and monitor the Node process
echo "Server is running, monitoring process..."
while kill -0 $NODE_PID 2>/dev/null; do
    # Check server health every 30 seconds
    if ! curl -s http://localhost:$PORT/health > /dev/null; then
        echo "Server health check failed!"
        exit 1
    fi
    sleep 30
done

# If we get here, the Node process has died
echo "Node process died unexpectedly"
exit 1
