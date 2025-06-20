#!/bin/bash

echo "🚀 Starting Docker-based database seeding..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.seed.yml down

# Build and run the seed service
echo "🔨 Building and running seed service..."
docker-compose -f docker-compose.seed.yml up --build

# Clean up
echo "🧹 Cleaning up..."
docker-compose -f docker-compose.seed.yml down

echo "✅ Database seeding completed!"
echo "📊 You should now see 50 problems in your application."