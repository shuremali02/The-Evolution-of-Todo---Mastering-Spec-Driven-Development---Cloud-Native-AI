# Phase 4: Local Kubernetes Deployment

This directory contains all artifacts for deploying the Todo Chatbot application to a local Kubernetes cluster using AI-assisted DevOps tools.

## Overview

The Todo Chatbot application (Phase 3) has been containerized and deployed to Kubernetes with the following components:

- **Frontend**: Next.js application serving the user interface
- **Backend**: FastAPI application providing the API services and AI chatbot functionality
- **Database**: PostgreSQL for data persistence
- **Orchestration**: Kubernetes (via Minikube) with proper service discovery
- **Packaging**: Helm Charts for deployment management
- **AI-Assisted Operations**: kubectl-ai and Kagent for intelligent Kubernetes operations

## Technology Stack

- **Containerization**: Docker + Docker AI Agent (Gordon) approach
- **Orchestration**: Kubernetes (Minikube)
- **Packaging**: Helm Charts
- **AI DevOps**: kubectl-ai and Kagent for intelligent operations
- **Application**: Phase 3 Todo Chatbot (Next.js + FastAPI + AI features)

## AI-Enhanced DevOps Features

- `docker ai` approach: AI-optimized Dockerfiles for frontend and backend
- `kubectl-ai` commands: Natural language interaction with Kubernetes
- `kagent` analysis: Intelligent cluster monitoring and recommendations

## Directory Structure

```
k8s/
├── manifests/                 # Raw Kubernetes manifests
│   └── todo-app-all.yaml     # Complete application deployment
├── helm-charts/              # Helm chart definitions
│   └── todo-chatbot/         # Todo Chatbot Helm chart
│       ├── Chart.yaml        # Chart metadata
│       ├── values.yaml       # Default configuration values
│       └── templates/        # Kubernetes resource templates
├── scripts/                  # Deployment automation scripts
│   ├── check-tools.sh        # Verify required tools
│   ├── build-test-images.sh  # Build and test Docker images
│   ├── docker-ai-agent.sh    # AI-assisted containerization simulation
│   ├── setup-minikube.sh     # Minikube setup script
│   └── start-and-deploy.sh   # Main deployment script
└── README.md                 # This file
```

## Quick Start

### Prerequisites

1. Docker Desktop with Kubernetes enabled OR Minikube
2. kubectl
3. kubectl-ai (installed)
4. Docker AI Agent approach (simulated with optimized Dockerfiles)

### Deploy the Application

Run the main deployment script:

```bash
cd k8s/scripts
./start-and-deploy.sh
```

This script will:
1. Start Minikube cluster
2. Enable required addons (ingress, metrics-server)
3. Build container images using AI-optimized Dockerfiles
4. Deploy the application to Kubernetes
5. Verify deployment status with kubectl-ai
6. Provide access information

### Manual Deployment Steps

If you prefer to deploy manually:

1. **Start Minikube**:
   ```bash
   minikube start --driver=docker
   minikube addons enable ingress
   ```

2. **Configure Docker context**:
   ```bash
   eval $(minikube docker-env)
   ```

3. **Build images**:
   ```bash
   docker build -t todo-frontend:latest -f ../frontend/Dockerfile ../frontend/.
   docker build -t todo-backend:latest -f ../backend/Dockerfile ../backend/.
   ```

4. **Deploy to Kubernetes**:
   ```bash
   kubectl apply -f ../manifests/todo-app-all.yaml
   ```

5. **Verify deployment**:
   ```bash
   kubectl get pods -n todo-app
   kubectl get svc -n todo-app
   ```

## AI-Assisted Operations

Once deployed, you can use kubectl-ai for natural language Kubernetes operations:

```bash
# Scale the frontend
kubectl-ai "scale deployment todo-frontend to 3 replicas in namespace todo-app"

# Check why pods are failing
kubectl-ai "analyze why pods in todo-app namespace are not ready"

# Get resource usage
kubectl-ai "show memory and CPU usage for all pods in todo-app namespace"

# Update configuration
kubectl-ai "update environment variable NEXT_PUBLIC_API_URL in frontend deployment"
```

## Service Architecture

The deployment includes:

- **Frontend Service**: `todo-frontend-svc` (ClusterIP)
- **Backend Service**: `todo-backend-svc` (ClusterIP)
- **Ingress**: `todo-ingress` (exposes frontend to external traffic)
- **Namespace**: `todo-app` (isolated application environment)

## Health Checks and Monitoring

- **Backend Health Endpoint**: `/health` (monitored by Kubernetes probes)
- **Frontend Health**: Root path `/` (monitored by Kubernetes probes)
- **AI Monitoring**: Use kubectl-ai for intelligent cluster analysis

## Configuration

Customize the deployment by modifying `k8s/helm-charts/todo-chatbot/values.yaml`:

- `frontend.replicaCount`: Number of frontend pod replicas
- `backend.replicaCount`: Number of backend pod replicas
- `frontend.resources`: Resource limits and requests for frontend
- `backend.resources`: Resource limits and requests for backend
- `ingress.enabled`: Whether to enable ingress for external access

## Troubleshooting

### Common Issues

1. **Images not found**: Ensure Docker images are built in Minikube context
2. **Service unavailable**: Check if pods are running and ready
3. **Database connection errors**: Verify database service is running and accessible

### AI-Assisted Debugging

```bash
# Analyze deployment issues
kubectl-ai "describe pods in todo-app namespace and explain any issues"

# Check logs with AI interpretation
kubectl-ai "show logs for backend pods and highlight any errors"

# Performance analysis
kubectl-ai "analyze resource usage in todo-app namespace and suggest optimizations"
```

## Cleanup

To remove the deployment:

```bash
kubectl delete -f ../manifests/todo-app-all.yaml
```

Or to stop the entire Minikube cluster:

```bash
minikube stop
```

## Development Workflow

This Phase 4 implementation follows the Agentic Dev Stack workflow:

1. ✅ **Spec**: Containerization and deployment requirements defined
2. ✅ **Plan**: Kubernetes architecture designed
3. ✅ **Tasks**: Implementation broken into step-by-step tasks
4. ✅ **Implement**: Executed via Claude Code with AI-assisted tools

## Integration with Previous Phases

- **Phase 1**: User authentication system (preserved in containerized deployment)
- **Phase 2**: Task management features (fully functional in Kubernetes)
- **Phase 3**: AI chatbot functionality (maintained in containerized environment)
- **Phase 4**: Kubernetes deployment with AI-assisted operations (current phase)

The application maintains all functionality from previous phases while gaining cloud-native deployment capabilities.