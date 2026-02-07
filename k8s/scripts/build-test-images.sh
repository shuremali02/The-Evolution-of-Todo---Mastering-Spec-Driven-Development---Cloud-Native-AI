#!/bin/bash

# Script to build and test Docker images for the Todo Chatbot application
# This validates that the Dockerfiles work correctly before Kubernetes deployment

set -e  # Exit on any error

echo "🐳 Building and testing Docker images..."

# Build frontend image
echo "Building frontend image..."
docker build -t todo-frontend:latest -f ../frontend/Dockerfile ../frontend/. || {
    echo "❌ Failed to build frontend image"
    exit 1
}

echo "✅ Frontend image built successfully"

# Build backend image
echo "Building backend image..."
docker build -t todo-backend:latest -f ../backend/Dockerfile ../backend/. || {
    echo "❌ Failed to build backend image"
    exit 1
}

echo "✅ Backend image built successfully"

# Test frontend container briefly
echo "🧪 Testing frontend container..."
docker run -d --name test-frontend -p 3001:3000 todo-frontend:latest || {
    echo "⚠️  Frontend container test failed to start, checking logs..."
    docker logs test-frontend 2>&1 | head -20
    docker rm -f test-frontend 2>/dev/null || true
    exit 1
}

# Give it a moment to start
sleep 5

# Check if the container is running
if docker ps | grep -q test-frontend; then
    echo "✅ Frontend container started successfully"
    docker stop test-frontend
    docker rm test-frontend
else
    echo "❌ Frontend container failed to start properly"
    docker logs test-frontend 2>&1 | head -20
    docker rm -f test-frontend 2>/dev/null || true
    exit 1
fi

# Test backend container briefly
echo "🧪 Testing backend container..."
docker run -d --name test-backend -p 8001:7860 -p 8002:8000 todo-backend:latest || {
    echo "⚠️  Backend container test failed to start, checking logs..."
    docker logs test-backend 2>&1 | head -20
    docker rm -f test-backend 2>/dev/null || true
    exit 1
}

# Give it a moment to start
sleep 10

# Check if the container is running
if docker ps | grep -q test-backend; then
    echo "✅ Backend container started successfully"
    docker stop test-backend
    docker rm test-backend
else
    echo "❌ Backend container failed to start properly"
    docker logs test-backend 2>&1 | head -20
    docker rm -f test-backend 2>/dev/null || true
    exit 1
fi

echo "✅ All Docker images tested successfully!"

# Show image sizes
echo "📊 Image sizes:"
docker images | grep -E "(todo-frontend|todo-backend)"

echo "🎉 Docker images are ready for Kubernetes deployment!"