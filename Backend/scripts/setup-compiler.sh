#!/bin/bash

echo "🚀 Setting up CodeFlask Compiler Service..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is available"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ../temp
mkdir -p ../docker/compiler-images/{python,node,java,cpp}

# Build custom compiler images
echo "🔨 Building secure compiler images..."
cd ../docker
chmod +x build-compiler-images.sh
./build-compiler-images.sh

# Pull additional base images
echo "📥 Pulling base Docker images..."
docker pull python:3.9-alpine
docker pull node:16-alpine
docker pull openjdk:11-alpine
docker pull gcc:9-alpine

# Test compiler service
echo "🧪 Testing compiler service..."
cd ..
node -e "
const CompilerService = require('./services/CompilerService');
CompilerService.getHealthStatus().then(health => {
  console.log('Compiler Health:', health);
  process.exit(0);
}).catch(err => {
  console.error('Compiler Test Failed:', err);
  process.exit(1);
});
"

echo "✅ Compiler service setup completed!"
echo "🔒 Security features enabled:"
echo "   - Docker containerization"
echo "   - Network isolation"
echo "   - Resource limits"
echo "   - Non-root execution"
echo "   - Read-only filesystems"
echo "   - Code validation"

echo ""
echo "🎯 Next steps:"
echo "1. Start your backend server: npm start"
echo "2. The compiler will automatically use Docker when available"
echo "3. Check /api/compiler/health for status"