#!/bin/bash

echo "🐳 Building secure compiler Docker images..."

# Build Python image
echo "Building Python compiler image..."
docker build -t codeflask/python-compiler:latest ./compiler-images/python/

# Build Node.js image
echo "Building Node.js compiler image..."
docker build -t codeflask/node-compiler:latest ./compiler-images/node/

# Build Java image
echo "Building Java compiler image..."
docker build -t codeflask/java-compiler:latest ./compiler-images/java/

# Build C++ image
echo "Building C++ compiler image..."
docker build -t codeflask/cpp-compiler:latest ./compiler-images/cpp/

echo "✅ All compiler images built successfully!"
echo "📋 Available images:"
docker images | grep codeflask