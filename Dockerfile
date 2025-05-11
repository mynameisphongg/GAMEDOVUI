# Build stage for frontend
FROM node:16.20-alpine as frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY quiz-game-frontend/package*.json ./

# Install frontend dependencies
RUN npm install -g npm@8.19.4 && \
    npm install --legacy-peer-deps

# Copy frontend source
COPY quiz-game-frontend/ ./

# Build frontend
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=false
RUN npm run build

# Production stage
FROM node:16.20-alpine
WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install -g npm@8.19.4 && \
    npm install --legacy-peer-deps

# Copy backend source
COPY . .

# Copy frontend build from builder stage
COPY --from=frontend-builder /app/frontend/build ./quiz-game-frontend/build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"] 