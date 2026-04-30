FROM node:18-alpine

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
