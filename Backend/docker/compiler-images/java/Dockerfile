FROM openjdk:11-alpine

# Create non-root user
RUN addgroup -g 1000 coderunner && \
    adduser -D -s /bin/sh -u 1000 -G coderunner coderunner

# Set working directory
WORKDIR /app

# Install security updates
RUN apk update && apk upgrade

# Remove unnecessary packages
RUN apk del --purge wget curl

# Set JVM options for security and resource limits
ENV JAVA_OPTS="-Xmx128m -Xms64m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Switch to non-root user
USER coderunner

# Default command
CMD ["java"]