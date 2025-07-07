FROM node:18-slim

RUN npm install --omit=dev
RUN apt-get update && apt-get install -y \
# Copy app source
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p temp

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start the app
CMD ["node", "index.js"]