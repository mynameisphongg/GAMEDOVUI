# Build stage for frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend

# Copy package files first to leverage Docker cache
COPY quiz-game-frontend/package*.json ./

# Install dependencies with specific flags
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the frontend code
COPY quiz-game-frontend/ ./

# Set environment variables for build
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Build the frontend
RUN npm run build || (echo "Build failed. Check the logs above for errors." && exit 1)

# Build stage for backend
FROM node:18-alpine as backend-builder
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the backend code
COPY . .

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/server.js ./
COPY --from=backend-builder /app/routes ./routes
COPY --from=backend-builder /app/models ./models

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"] 