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

# Production stage
FROM node:16.20.0-alpine
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache tini curl bash

# Create app user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy backend source
COPY . .

# Copy frontend build from frontend builder
COPY --from=frontend-builder /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

# Make start.sh executable and set proper permissions
RUN chmod +x start.sh && \
    chown -R appuser:appgroup /app && \
    chmod -R 755 /app

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Switch to non-root user
USER appuser

# Add healthcheck with more lenient settings
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Expose port
EXPOSE ${PORT}

# Start the application using the startup script
CMD ["./start.sh"]
