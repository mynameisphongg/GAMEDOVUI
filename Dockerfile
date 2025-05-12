# 1. Build frontend
FROM node:16.20.0 AS frontend
WORKDIR /app/quiz-game-frontend
COPY quiz-game-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY quiz-game-frontend/ ./
RUN npm run build

# 2. Build backend
FROM node:16.20.0 AS backend
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Copy built frontend from frontend stage to backend's static folder
COPY --from=frontend /app/quiz-game-frontend/build ./quiz-game-frontend/build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]