#!/bin/sh

echo "=== Environment Check ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI environment variable is not set"
    echo "Please set MONGODB_URI in Railway dashboard"
    exit 1
fi

echo "=== Starting Application ==="
exec node --trace-warnings server.js 