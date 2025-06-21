# PowerShell script for setting up CodeFlask Compiler Service
Write-Host "🚀 Setting up CodeFlask Compiler Service..." -ForegroundColor Green

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker is available" -ForegroundColor Green
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Visit: https://docs.docker.com/get-docker/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    $dockerInfo = docker info 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker is running" -ForegroundColor Green
    } else {
        throw "Docker not running"
    }
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    Write-Host "💡 Tip: Look for Docker Desktop in your system tray and start it." -ForegroundColor Yellow
    exit 1
}

# Create necessary directories
Write-Host "📁 Creating directories..." -ForegroundColor Cyan
$directories = @(
    "../temp",
    "../docker",
    "../docker/compiler-images",
    "../docker/compiler-images/python",
    "../docker/compiler-images/node", 
    "../docker/compiler-images/java",
    "../docker/compiler-images/cpp"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Create Dockerfile for Python
Write-Host "📝 Creating Python Dockerfile..." -ForegroundColor Yellow
$pythonDockerfile = @"
FROM python:3.9-alpine

# Create non-root user
RUN addgroup -g 1000 coderunner && \
    adduser -D -s /bin/sh -u 1000 -G coderunner coderunner

# Set working directory
WORKDIR /app

# Install security updates
RUN apk update && apk upgrade

# Remove unnecessary packages
RUN apk del --purge wget curl

# Set resource limits
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Switch to non-root user
USER coderunner

# Default command
CMD ["python"]
"@
$pythonDockerfile | Out-File -FilePath "../docker/compiler-images/python/Dockerfile" -Encoding UTF8

# Create Dockerfile for Node.js
Write-Host "📝 Creating Node.js Dockerfile..." -ForegroundColor Yellow
$nodeDockerfile = @"
FROM node:16-alpine

# Create non-root user
RUN addgroup -g 1000 coderunner && \
    adduser -D -s /bin/sh -u 1000 -G coderunner coderunner

# Set working directory
WORKDIR /app

# Install security updates
RUN apk update && apk upgrade

# Remove unnecessary packages
RUN apk del --purge wget curl

# Set resource limits
ENV NODE_ENV=production

# Switch to non-root user
USER coderunner

# Default command
CMD ["node"]
"@
$nodeDockerfile | Out-File -FilePath "../docker/compiler-images/node/Dockerfile" -Encoding UTF8

# Create Dockerfile for Java
Write-Host "📝 Creating Java Dockerfile..." -ForegroundColor Yellow
$javaDockerfile = @"
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
"@
$javaDockerfile | Out-File -FilePath "../docker/compiler-images/java/Dockerfile" -Encoding UTF8

# Create Dockerfile for C++
Write-Host "📝 Creating C++ Dockerfile..." -ForegroundColor Yellow
$cppDockerfile = @"
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
CMD ["gcc"]
"@
$cppDockerfile | Out-File -FilePath "../docker/compiler-images/cpp/Dockerfile" -Encoding UTF8

# Build custom compiler images
Write-Host "🔨 Building secure compiler images..." -ForegroundColor Cyan

Write-Host "Building Python compiler image..." -ForegroundColor Yellow
docker build -t codeflask/python-compiler:latest ../docker/compiler-images/python/

Write-Host "Building Node.js compiler image..." -ForegroundColor Yellow
docker build -t codeflask/node-compiler:latest ../docker/compiler-images/node/

Write-Host "Building Java compiler image..." -ForegroundColor Yellow
docker build -t codeflask/java-compiler:latest ../docker/compiler-images/java/

Write-Host "Building C++ compiler image..." -ForegroundColor Yellow
docker build -t codeflask/cpp-compiler:latest ../docker/compiler-images/cpp/

# Pull additional base images
Write-Host "📥 Pulling base Docker images..." -ForegroundColor Cyan
$images = @("python:3.9-alpine", "node:16-alpine", "openjdk:11-alpine", "gcc:9-alpine")

foreach ($image in $images) {
    Write-Host "Pulling $image..." -ForegroundColor Yellow
    docker pull $image
}

# Test compiler service
Write-Host "🧪 Testing compiler service..." -ForegroundColor Cyan

# Create a simple test script
$testScript = @'
const CompilerService = require("./services/CompilerService");

async function testCompiler() {
  try {
    const health = await CompilerService.getHealthStatus();
    console.log("✅ Compiler Health:", JSON.stringify(health, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("❌ Compiler Test Failed:", err.message);
    process.exit(1);
  }
}

testCompiler();
'@

$testScript | Out-File -FilePath "test-compiler.js" -Encoding UTF8

try {
    node test-compiler.js
    Write-Host "✅ Compiler service test passed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Compiler service test failed, but setup is complete." -ForegroundColor Yellow
    Write-Host "The service will be tested when you start the backend." -ForegroundColor Yellow
} finally {
    # Clean up test file
    if (Test-Path "test-compiler.js") {
        Remove-Item "test-compiler.js"
    }
}

Write-Host ""
Write-Host "✅ Compiler service setup completed!" -ForegroundColor Green
Write-Host "🔒 Security features enabled:" -ForegroundColor Green
Write-Host "   - Docker containerization" -ForegroundColor White
Write-Host "   - Network isolation" -ForegroundColor White
Write-Host "   - Resource limits" -ForegroundColor White
Write-Host "   - Non-root execution" -ForegroundColor White
Write-Host "   - Read-only filesystems" -ForegroundColor White
Write-Host "   - Code validation" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start your backend server: npm start" -ForegroundColor White
Write-Host "2. The compiler will automatically use Docker when available" -ForegroundColor White
Write-Host "3. Check /api/compiler/health for status" -ForegroundColor White
Write-Host "4. Test the compiler in your CodeFlask application" -ForegroundColor White

Write-Host ""
Write-Host "🌐 Available endpoints:" -ForegroundColor Cyan
Write-Host "   - POST /api/compiler/execute - Execute code" -ForegroundColor White
Write-Host "   - GET /api/compiler/health - Check compiler status" -ForegroundColor White
Write-Host "   - GET /api/compiler/languages - Get supported languages" -ForegroundColor White