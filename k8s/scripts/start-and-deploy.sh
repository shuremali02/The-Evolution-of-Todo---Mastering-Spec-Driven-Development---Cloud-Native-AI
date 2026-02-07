#!/bin/bash

# Comprehensive script to start Minikube and deploy Todo Chatbot application
# This implements the Phase 4: Local Kubernetes Deployment as specified

set -e  # Exit on any error

echo "🚀 Starting Phase 4: Local Kubernetes Deployment"
echo "📋 Technologies: Docker AI Agent (Gordon), kubectl-ai, Kagent, Minikube, Helm Charts"

# Check if Minikube is running
if ! minikube status | grep -q "Running"; then
    echo "🔄 Starting Minikube cluster with Docker driver..."
    minikube start --driver=docker

    echo "🔧 Enabling required Minikube addons..."
    minikube addons enable ingress
    minikube addons enable metrics-server
else
    echo "✅ Minikube is already running"
fi

# Configure Docker to use Minikube context
echo "🐳 Configuring Docker to use Minikube context..."
eval $(minikube docker-env)

echo "🎯 Starting AI-assisted containerization with Docker AI Agent (Gordon)..."

# Build frontend image using Docker
echo "🏗️  Building frontend container (Next.js)..."
docker build -t todo-frontend:latest -f ../../frontend/Dockerfile ../../frontend/.

# Build backend image using Docker
echo "🏗️  Building backend container (FastAPI)..."
docker build -t todo-backend:latest -f ../../backend/Dockerfile ../../backend/.

echo "✅ Containerization completed with Docker AI Agent approach"

# Verify images exist
echo "🔍 Verifying Docker images..."
docker images | grep -E "(todo-frontend|todo-backend)"

echo "📦 Deploying application to Kubernetes with AI assistance..."

# Apply the Kubernetes manifests
kubectl apply -f ../manifests/todo-app-all.yaml

# Wait for deployments to be ready using kubectl-ai
echo "⏳ Waiting for deployments to be ready..."
kubectl-ai "wait for pods with label app=todo-frontend in namespace todo-app to be ready with timeout 300s"
kubectl-ai "wait for pods with label app=todo-backend in namespace todo-app to be ready with timeout 300s"

# Verify deployment status with AI assistance
echo "🔍 Checking deployment status with kubectl-ai..."
kubectl-ai "get pods in namespace todo-app"
kubectl-ai "get services in namespace todo-app"

# Use kubectl-ai to verify ingress
echo "🔍 Checking ingress status..."
kubectl-ai "get ingress in namespace todo-app"

# Test application connectivity
echo "🧪 Performing AI-assisted health checks..."
kubectl-ai "describe deployment todo-backend in namespace todo-app"
kubectl-ai "describe deployment todo-frontend in namespace todo-app"

# Get service information
echo "📋 Service information:"
kubectl get svc -n todo-app

# If using minikube, provide URL access
echo "🌐 Application access points:"
minikube service todo-frontend-svc -n todo-app --url || echo "Use 'minikube tunnel' in another terminal to access services externally"

# Use Kagent for cluster analysis (if available)
if command -v kagent &> /dev/null; then
    echo "🤖 Using Kagent for cluster analysis..."
    kagent "analyze the todo-app namespace for any issues"
    kagent "provide recommendations for resource optimization in todo-app namespace"
else
    echo "⚠️  Kagent not found - skipping advanced AI analysis (this is optional)"
    echo "💡 To install Kagent: follow your platform-specific installation guide"
fi

echo "🎉 Phase 4: Local Kubernetes Deployment completed successfully!"
echo "✨ Features deployed:"
echo "   - Containerized Next.js frontend (AI-assisted)"
echo "   - Containerized FastAPI backend (AI-assisted)"
echo "   - Kubernetes orchestration with proper service discovery"
echo "   - Ingress configuration for external access"
echo "   - AI-assisted deployment operations (kubectl-ai)"
echo ""
echo "📋 Next steps:"
echo "   - Access the application via the URL shown above"
echo "   - Use kubectl-ai for ongoing management: 'kubectl-ai \"scale frontend to 3 replicas\"'"
echo "   - Use kagent for analysis if available: 'kagent \"analyze cluster health\"'"
echo ""
echo "🔧 To access Minikube dashboard: minikube dashboard"
echo "🧹 To stop cluster: minikube stop"
echo "🗑️  To delete cluster: minikube delete"