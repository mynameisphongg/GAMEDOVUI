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
RUN apk add --no-cache tini curl

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install --legacy-peer-deps

# Copy backend source
COPY . .

# Copy frontend build from frontend builder
COPY --from=frontend-builder /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Make sure start.sh is executable
RUN chmod +x start.sh

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Expose port
EXPOSE 3000

# Start the application using the startup script
CMD ["./start.sh"] 