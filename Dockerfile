# Build stage for frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY quiz-game-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY quiz-game-frontend/ ./
RUN npm run build

# Build stage for backend
FROM node:18-alpine as backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
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