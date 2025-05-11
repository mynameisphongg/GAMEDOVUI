#!/bin/sh

echo "Starting application..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "MongoDB URI: ${MONGODB_URI:+***}"

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
  if node -e "const mongoose=require('mongoose'); mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,serverSelectionTimeoutMS:5000}).then(()=>process.exit(0)).catch(()=>process.exit(1))"; then
    echo "MongoDB is ready!"
    break
  fi
  echo "Attempt $attempt/$max_attempts: MongoDB not ready, waiting..."
  attempt=$((attempt + 1))
  sleep 2
done

if [ $attempt -gt $max_attempts ]; then
  echo "MongoDB connection failed after $max_attempts attempts"
  exit 1
fi

# Start the application
echo "Starting server..."
exec node server.js 