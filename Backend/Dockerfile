# Dockerfile for CodeFlask Backend
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create temp directory for code execution
RUN mkdir -p temp

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]