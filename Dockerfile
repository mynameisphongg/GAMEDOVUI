# Build stage for frontend
FROM node:16.20.0-alpine as frontend-builder
WORKDIR /app/frontend

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy frontend package files
COPY quiz-game-frontend/package*.json ./

# Install frontend dependencies
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY quiz-game-frontend/ ./

# Build frontend
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false
RUN npm run build

# Build stage for backend
FROM node:16.20.0-alpine as backend-builder
WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install -g npm@8.19.4 && \
    npm install --legacy-peer-deps --no-audit --no-fund

# Copy backend source
COPY . .

# Production stage
FROM node:16.20.0-alpine
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache tini curl

# Copy backend files from builder
COPY --from=backend-builder --chown=node:node /app/package*.json ./
COPY --from=backend-builder --chown=node:node /app/node_modules ./node_modules
COPY --from=backend-builder --chown=node:node /app/server.js ./
COPY --from=backend-builder --chown=node:node /app/routes ./routes
COPY --from=backend-builder --chown=node:node /app/models ./models

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

# Create a non-root user and switch to it
USER node

# Create startup script
RUN echo '#!/bin/sh\n\
echo "Starting application..."\n\
echo "Node version: $(node -v)"\n\
echo "NPM version: $(npm -v)"\n\
echo "Environment: $NODE_ENV"\n\
echo "Port: $PORT"\n\
echo "MongoDB URI: ${MONGODB_URI:+***}"\n\
\n\
# Wait for MongoDB to be ready\n\
echo "Waiting for MongoDB..."\n\
max_attempts=30\n\
attempt=1\n\
while [ $attempt -le $max_attempts ]; do\n\
  if node -e "const mongoose=require(\"mongoose\"); mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,serverSelectionTimeoutMS:5000}).then(()=>process.exit(0)).catch(()=>process.exit(1))"; then\n\
    echo "MongoDB is ready!"\n\
    break\n\
  fi\n\
  echo "Attempt $attempt/$max_attempts: MongoDB not ready, waiting..."\n\
  attempt=$((attempt + 1))\n\
  sleep 2\n\
done\n\
\n\
if [ $attempt -gt $max_attempts ]; then\n\
  echo "MongoDB connection failed after $max_attempts attempts"\n\
  exit 1\n\
fi\n\
\n\
# Start the application\n\
echo "Starting server..."\n\
exec node server.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application using the startup script
CMD ["/app/start.sh"] 