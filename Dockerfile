# 1. Build frontend
FROM node:18 AS frontend
WORKDIR /app/quiz-game-frontend
COPY quiz-game-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY quiz-game-frontend/ ./
RUN npm run build

# 2. Build backend
FROM node:18 AS backend
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Copy built frontend into backend's static folder
RUN rm -rf ./quiz-game-frontend/build && \
    cp -r /app/quiz-game-frontend/build ./quiz-game-frontend/build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"] 