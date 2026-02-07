# Quickstart Guide: Local Kubernetes Deployment

## Overview
This guide provides instructions for quickly setting up and deploying the Todo Chatbot application to a local Kubernetes cluster using Minikube, Docker AI Agent (Gordon), and Helm charts.

## Prerequisites

### System Requirements
- Docker Desktop (version 4.53+ with Docker AI Agent enabled)
- kubectl
- Helm (version 3.x)
- Minikube
- kubectl-ai and Kagent plugins
- Node.js 18+ (for local development)
- Python 3.11+ (for backend development)

### Enable Docker AI Agent (Gordon)
1. Open Docker Desktop settings
2. Navigate to "Features in development" or "Beta features"
3. Enable "Docker AI Agent" (Gordon)
4. Restart Docker Desktop

### Enable Minikube Docker Driver
```bash
minikube config set driver docker
```

## Environment Setup

### 1. Start Minikube Cluster
```bash
minikube start
minikube status
```

### 2. Configure Docker to Use Minikube Context
```bash
eval $(minikube docker-env)
```

### 3. Verify Kubernetes Setup
```bash
kubectl cluster-info
kubectl get nodes
helm version
```

## Containerization with Docker AI Agent

### 1. Generate Frontend Dockerfile
```bash
# Navigate to frontend directory
cd frontend

# Use Docker AI Agent (Gordon) to create Dockerfile
docker ai "create optimized Dockerfile for Next.js 14+ application with production build"
```

### 2. Generate Backend Dockerfile
```bash
# Navigate to backend directory
cd ../backend

# Use Docker AI Agent (Gordon) to create Dockerfile
docker ai "create optimized Dockerfile for FastAPI Python 3.11 application with production dependencies"
```

### 3. Build Container Images
```bash
# Build frontend image
docker build -t todo-frontend:latest -f frontend/Dockerfile frontend/.

# Build backend image
docker build -t todo-backend:latest -f backend/Dockerfile backend/.
```

### 4. Verify Images
```bash
docker images | grep todo-
```

## Create Helm Chart

### 1. Initialize Helm Chart
```bash
mkdir -p k8s/helm-charts/todo-chatbot
cd k8s/helm-charts/todo-chatbot

helm create todo-chatbot
```

### 2. Use kubectl-ai to Generate Chart Templates
```bash
# Generate deployment templates using AI assistance
kubectl-ai "generate Kubernetes deployment for Todo Chatbot frontend with 2 replicas, health checks, and environment configuration"

kubectl-ai "generate Kubernetes deployment for Todo Chatbot backend with 2 replicas, health checks, and environment configuration"

kubectl-ai "generate Kubernetes services to expose frontend and backend applications"

kubectl-ai "generate ingress configuration for Todo Chatbot frontend"
```

### 3. Configure Values
Edit `values.yaml` to include:
```yaml
frontend:
  image:
    repository: todo-frontend
    tag: latest
  replicas: 2
  service:
    port: 3000

backend:
  image:
    repository: todo-backend
    tag: latest
  replicas: 2
  service:
    port: 8000

ingress:
  enabled: true
  hosts:
    - host: todo.local
      paths:
        - path: /
          pathType: Prefix
```

## Deploy to Minikube

### 1. Install Helm Chart
```bash
# Navigate to the chart directory
cd k8s/helm-charts/todo-chatbot

# Install the chart to Minikube
helm install todo-chatbot . --namespace todo-app --create-namespace
```

### 2. Verify Deployment
```bash
# Check if pods are running
kubectl get pods -n todo-app

# Check services
kubectl get svc -n todo-app

# Check ingress
kubectl get ingress -n todo-app
```

### 3. Get Application URL
```bash
minikube service todo-chatbot-frontend-svc -n todo-app --url
```

## Access the Application

### 1. Enable Ingress Addon (if needed)
```bash
minikube addons enable ingress
minikube addons list | grep ingress
```

### 2. Access Frontend
```bash
# If ingress is configured
minikube tunnel  # Run in separate terminal

# Then access at http://todo.local or use the service URL
```

### 3. Test the Application
```bash
# Access frontend
curl $(minikube service todo-chatbot-frontend-svc -n todo-app --url)

# Test backend API
curl $(minikube service todo-chatbot-backend-svc -n todo-app --url)/api/v1/health
```

## Monitor with AI Tools

### 1. Analyze Cluster Health
```bash
kagent "analyze the todo-app namespace for any issues"
```

### 2. Check Deployment Status
```bash
kubectl-ai "check if the todo-chatbot deployment is healthy"
```

### 3. Scale Application
```bash
kubectl-ai "scale the frontend deployment to 3 replicas"
kubectl-ai "show the current resource usage for the todo-app namespace"
```

## Troubleshooting

### Common Issues and Solutions

1. **Images not found in Minikube**:
   - Ensure you ran `eval $(minikube docker-env)` before building images
   - Verify images exist with `docker images`

2. **Minikube tunnel not working**:
   - Run `minikube tunnel` as sudo on some systems
   - Check if ingress controller is running: `kubectl get pods -n kube-system | grep ingress`

3. **Application not responding**:
   - Check pod status: `kubectl get pods -n todo-app`
   - Check logs: `kubectl logs -n todo-app deployment/todo-chatbot-frontend`
   - Verify service exposure: `kubectl get svc -n todo-app`

4. **Environment variables not set**:
   - Verify ConfigMaps and Secrets: `kubectl get cm,secret -n todo-app`
   - Check deployment environment: `kubectl describe deployment todo-chatbot-frontend -n todo-app`

### Use AI Tools for Diagnostics
```bash
kubectl-ai "analyze why pods in todo-app namespace are failing"
kagent "provide recommendations for resource optimization in todo-app namespace"
```

## Cleanup

### 1. Uninstall Helm Release
```bash
helm uninstall todo-chatbot -n todo-app
```

### 2. Stop Minikube
```bash
minikube stop
```

### 3. Remove Docker Images (optional)
```bash
docker rmi todo-frontend:latest todo-backend:latest
```

## Next Steps

1. Customize the Helm chart values for your specific requirements
2. Add database deployment to the chart
3. Configure persistent volumes for data storage
4. Set up monitoring and logging solutions
5. Implement CI/CD pipeline for automated deployments