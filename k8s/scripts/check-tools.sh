#!/bin/bash

# Script to check if required tools are installed for Kubernetes deployment

echo "🔍 Checking required tools for Kubernetes deployment..."

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker: Not found"
    echo "   Please install Docker Desktop or Docker Engine"
fi

# Check kubectl
if command -v kubectl &> /dev/null; then
    echo "✅ kubectl: $(kubectl version --client --short 2>/dev/null || echo 'installed')"
else
    echo "❌ kubectl: Not found"
    echo "   Please install kubectl"
fi

# Check Helm
if command -v helm &> /dev/null; then
    echo "✅ Helm: $(helm version --short 2>/dev/null || echo 'installed')"
else
    echo "⚠️  Helm: Not found"
    echo "   Helm is optional but recommended for easier deployment management"
fi

# Check Minikube
if command -v minikube &> /dev/null; then
    echo "✅ Minikube: $(minikube version --short 2>/dev/null || echo 'installed')"
else
    echo "⚠️  Minikube: Not found"
    echo "   Consider installing Minikube for local Kubernetes development"
fi

# Check if kubectl can connect to cluster
if command -v kubectl &> /dev/null; then
    if kubectl cluster-info &> /dev/null; then
        echo "✅ Kubernetes cluster: Reachable"
        echo "   $(kubectl config current-context 2>/dev/null || echo 'Context info not available')"
    else
        echo "⚠️  Kubernetes cluster: Not reachable"
        echo "   Make sure a cluster is running (Minikube, Docker Desktop, etc.)"
    fi
fi

# Summary
echo ""
echo "📋 Summary:"
echo "- Essential: Docker, kubectl"
echo "- Recommended: Helm, Minikube"
echo ""
echo "💡 If using Minikube, start it with: minikube start"
echo "💡 If using Docker Desktop, ensure Kubernetes is enabled in settings"