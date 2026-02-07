#!/bin/bash

# Deployment script for Todo Chatbot application
# This script automates the deployment of the Todo Chatbot application to Kubernetes

set -e  # Exit on any error

echo "🚀 Starting Todo Chatbot Kubernetes Deployment..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ docker is not installed or not in PATH"
    exit 1
fi

# Build Docker images
echo "🐳 Building Docker images..."

# Build frontend image
echo "Building frontend image..."
docker build -t todo-frontend:latest -f ../frontend/Dockerfile ../frontend/.

# Build backend image
echo "Building backend image..."
docker build -t todo-backend:latest -f ../backend/Dockerfile ../backend/.

echo "✅ Docker images built successfully"

# Check if minikube is available and running
if command -v minikube &> /dev/null; then
    if minikube status | grep -q "Running"; then
        echo "✅ Minikube is running, configuring Docker to use Minikube context"
        eval $(minikube docker-env)

        # Rebuild images in minikube context
        echo "🔄 Rebuilding images in Minikube context..."
        docker build -t todo-frontend:latest -f ../frontend/Dockerfile ../frontend/.
        docker build -t todo-backend:latest -f ../backend/Dockerfile ../backend/.
    else
        echo "⚠️  Minikube is installed but not running. Please start Minikube with: minikube start"
        echo "Then run this script again."
        exit 1
    fi
else
    echo "⚠️  Minikube not found. Using regular Docker context."
fi

# Create namespace if it doesn't exist
echo "🔧 Creating namespace if it doesn't exist..."
kubectl create namespace todo-app --dry-run=client -o yaml | kubectl apply -f -

# Deploy using kubectl directly since Helm may not be available
echo "📦 Deploying application with kubectl..."

# Apply all manifests
kubectl apply -f ../helm-charts/todo-chatbot/templates/ -n todo-app

echo "✅ Application deployed successfully!"

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/todo-chatbot-frontend -n todo-app --timeout=300s
kubectl rollout status deployment/todo-chatbot-backend -n todo-app --timeout=300s

# Get service information
echo "📋 Service information:"
kubectl get svc -n todo-app

# If using minikube, provide URL
if command -v minikube &> /dev/null && minikube status | grep -q "Running"; then
    echo "🌐 Access the application at:"
    minikube service todo-chatbot-frontend-svc -n todo-app --url
fi

echo "🎉 Deployment completed successfully!"
echo "💡 To access the application, check the service URLs above"
echo "🔧 To troubleshoot, use: kubectl get pods -n todo-app"