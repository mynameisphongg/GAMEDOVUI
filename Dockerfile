# Build stage for frontend
FROM node:16.20.0-alpine as frontend-builder
WORKDIR /app/frontend

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy frontend package files
COPY quiz-game-frontend/package*.json ./

# Install frontend dependencies with specific version
RUN npm install -g npm@8.19.4 && \
    npm cache clean --force && \
    npm install --legacy-peer-deps --no-audit --no-fund

# Copy frontend source
COPY quiz-game-frontend/ ./

# Set build environment
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false
ENV NPM_CONFIG_LOGLEVEL=verbose

# Build frontend with error handling
RUN npm run build || (echo "Frontend build failed. Check the logs above for errors." && exit 1)

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
COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/server.js ./
COPY --from=backend-builder /app/routes ./routes
COPY --from=backend-builder /app/models ./models

# Copy frontend build from frontend builder
COPY --from=frontend-builder /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a script to check environment variables and start the app
RUN echo '#!/bin/sh\n\
echo "Checking environment variables..."\n\
if [ -z "$MONGODB_URI" ]; then\n\
    echo "Error: MONGODB_URI environment variable is not set"\n\
    echo "Please set MONGODB_URI in Railway dashboard"\n\
    exit 1\n\
fi\n\
\n\
echo "Starting application..."\n\
echo "Node version: $(node -v)"\n\
echo "NPM version: $(npm -v)"\n\
echo "Environment: $NODE_ENV"\n\
echo "MongoDB URI: ${MONGODB_URI:0:20}..."\n\
\n\
# Start the application in the background\n\
node server.js &\n\
APP_PID=$!\n\
\n\
# Wait for the application to start\n\
echo "Waiting for application to start..."\n\
for i in $(seq 1 30); do\n\
    if curl -s http://localhost:3000/health > /dev/null; then\n\
        echo "Application is healthy!"\n\
        wait $APP_PID\n\
        exit 0\n\
    fi\n\
    echo "Attempt $i: Application not ready yet..."\n\
    sleep 2\n\
done\n\
\n\
echo "Application failed to start within 60 seconds"\n\
kill $APP_PID\n\
exit 1\n\
' > /app/start.sh && chmod +x /app/start.sh

# Add healthcheck with curl
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Expose port
EXPOSE 3000

# Start the application
CMD ["/app/start.sh"] 