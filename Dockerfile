FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies and build
RUN npm install
RUN cd quiz-game-frontend && npm install && npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"] 