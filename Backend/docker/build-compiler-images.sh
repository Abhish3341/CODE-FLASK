#!/bin/bash

echo "🐳 Building secure compiler Docker images..."

# Build C image
echo "Building C compiler image..."
docker build -t codeflask/c-compiler:latest ./compiler-images/c/

# Build C++ image
echo "Building C++ compiler image..."
docker build -t codeflask/cpp-compiler:latest ./compiler-images/cpp/

# Build Java image
echo "Building Java compiler image..."
docker build -t codeflask/java-compiler:latest ./compiler-images/java/

# Build Python image
echo "Building Python compiler image..."
docker build -t codeflask/python-compiler:latest ./compiler-images/python/

echo "✅ All compiler images built successfully!"
echo "📋 Available images:"
docker images | grep codeflask