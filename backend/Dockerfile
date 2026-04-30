FROM node:18-alpine

WORKDIR /app

# Copy dependency files from the backend subdirectory
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend source
COPY backend/ .

EXPOSE 3000

CMD ["node", "server.js"]
