#!/bin/bash

# Script to setup Minikube and deploy the Todo Chatbot application
# This script handles the complete setup from Minikube start to application deployment

set -e  # Exit on any error

echo "🚀 Setting up Minikube for Todo Chatbot deployment..."

# Check if Minikube is installed
if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube is not installed"
    echo "Please install Minikube first:"
    echo "  Linux: curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube"
    echo "  macOS: brew install minikube"
    echo "  Windows: choco install minikube"
    exit 1
fi

# Start Minikube with Docker driver
echo "🔄 Starting Minikube with Docker driver..."
minikube start --driver=docker

# Enable ingress addon
echo "🔧 Enabling ingress addon..."
minikube addons enable ingress

# Wait for ingress controller to be ready
echo "⏳ Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Configure Docker to use Minikube context
echo "🐳 Configuring Docker to use Minikube context..."
eval $(minikube docker-env)

# Build Docker images in Minikube context
echo "🏗️  Building Docker images in Minikube context..."

# Build frontend image
echo "Building frontend image..."
docker build -t todo-frontend:latest -f ../../frontend/Dockerfile ../../frontend/. || {
    echo "❌ Failed to build frontend image"
    exit 1
}

# Build backend image
echo "Building backend image..."
docker build -t todo-backend:latest -f ../../backend/Dockerfile ../../backend/. || {
    echo "❌ Failed to build backend image"
    exit 1
}

echo "✅ Docker images built successfully in Minikube context"

# Apply the Kubernetes manifests
echo "📦 Deploying application to Minikube..."
kubectl apply -f ../manifests/todo-app-all.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=ready pod -l app=todo-frontend -n todo-app --timeout=300s
kubectl wait --for=condition=ready pod -l app=todo-backend -n todo-app --timeout=300s

# Get the ingress URL
echo "🌐 Ingress URL:"
minikube service todo-frontend-svc -n todo-app --url

# Display service information
echo "📋 Service status:"
kubectl get svc -n todo-app

echo "🎉 Minikube setup and deployment completed successfully!"
echo "💡 Access the application at the URL shown above"
echo "🔧 To access the dashboard, run: minikube dashboard"
echo "🧹 To stop Minikube: minikube stop"
echo "🗑️  To delete the cluster: minikube delete"