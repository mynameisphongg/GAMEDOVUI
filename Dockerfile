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

# Install production dependencies and create necessary directories
RUN apk add --no-cache tini curl && \
    mkdir -p /app/quiz-game-frontend/build && \
    chown -R node:node /app

# Copy backend files from builder
COPY --from=backend-builder --chown=node:node /app/package*.json ./
COPY --from=backend-builder --chown=node:node /app/node_modules ./node_modules
COPY --from=backend-builder --chown=node:node /app/server.js ./
COPY --from=backend-builder --chown=node:node /app/routes ./routes
COPY --from=backend-builder --chown=node:node /app/models ./models

# Copy frontend build from frontend builder
COPY --from=frontend-builder --chown=node:node /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

# Create a non-root user and switch to it
USER node

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application with proper error handling
CMD ["sh", "-c", "echo 'Starting application...' && node server.js"] 