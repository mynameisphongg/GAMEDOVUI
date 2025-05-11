# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY quiz-game-frontend/package*.json ./quiz-game-frontend/

# Install dependencies
RUN npm install
RUN cd quiz-game-frontend && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd quiz-game-frontend && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built frontend and server files
COPY --from=builder /app/quiz-game-frontend/build ./quiz-game-frontend/build
COPY server.js ./
COPY routes ./routes

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"] 