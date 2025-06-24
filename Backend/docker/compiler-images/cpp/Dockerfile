FROM gcc:9-alpine

# Create non-root user
RUN addgroup -g 1000 coderunner && \
    adduser -D -s /bin/sh -u 1000 -G coderunner coderunner

# Set working directory
WORKDIR /app

# Install security updates
RUN apk update && apk upgrade

# Remove unnecessary packages
RUN apk del --purge wget curl

# Switch to non-root user
USER coderunner

# Default command
CMD ["g++"]