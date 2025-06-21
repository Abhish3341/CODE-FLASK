# Simple Compiler Setup Commands

Run these commands one by one in your PowerShell terminal:

## 1. Check Docker Status
```powershell
docker --version
docker info
```

## 2. Create Required Directories
```powershell
mkdir -p temp
mkdir -p services
mkdir -p docker/compiler-images/python
mkdir -p docker/compiler-images/node
mkdir -p docker/compiler-images/java
mkdir -p docker/compiler-images/cpp
```

## 3. Pull Required Docker Images
```powershell
docker pull python:3.9-alpine
docker pull node:16-alpine
docker pull openjdk:11-alpine
docker pull gcc:9-alpine
```

## 4. Test Docker
```powershell
docker run --rm python:3.9-alpine python --version
docker run --rm node:16-alpine node --version
docker run --rm openjdk:11-alpine java -version
docker run --rm gcc:9-alpine gcc --version
```

## 5. Start Your Backend
```powershell
npm start
```

## 6. Test Compiler Endpoint
Open another terminal and run:
```powershell
curl -X GET http://localhost:8000/api/compiler/health -H "Authorization: Bearer YOUR_TOKEN"
```

That's it! Your compiler service should now be working.