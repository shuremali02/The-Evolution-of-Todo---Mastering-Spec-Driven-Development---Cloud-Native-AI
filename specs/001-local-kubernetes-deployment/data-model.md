# Data Model: Local Kubernetes Deployment

## Overview
This document outlines the data structures and entities involved in the Kubernetes deployment of the Todo Chatbot application. Since this phase focuses on infrastructure, the primary data models relate to deployment configurations rather than application data.

## Container Configuration Entities

### Docker Image Configuration
**Definition**: Configuration parameters for building Docker images for frontend and backend applications

**Fields**:
- image_name: Name of the Docker image
- base_image: Base image to use for the container
- build_context: Directory path for build context
- environment_variables: List of environment variables for container runtime
- ports: Port mappings for the container
- volumes: Volume mounts for persistent storage
- dependencies: List of dependencies to install in the container

**Relationships**: One image configuration per application component (frontend, backend)

### Runtime Configuration
**Definition**: Runtime parameters for containers in Kubernetes

**Fields**:
- container_memory_limit: Maximum memory allocation for container
- container_cpu_limit: Maximum CPU allocation for container
- container_memory_request: Requested memory for container scheduling
- container_cpu_request: Requested CPU for container scheduling
- health_check_endpoint: Endpoint for container health checks
- startup_probe: Configuration for container startup verification
- readiness_probe: Configuration for container readiness checks
- liveness_probe: Configuration for container liveness checks

## Kubernetes Resource Entities

### Deployment Configuration
**Definition**: Kubernetes Deployment resource configuration for application components

**Fields**:
- replicas: Number of desired pod replicas
- selector_labels: Labels to match pods to this deployment
- template_labels: Labels applied to pods in this deployment
- container_configs: List of container configurations for the pod
- init_containers: Optional initialization containers
- security_context: Security configuration for the pod
- tolerations: Node tolerations for scheduling
- node_selector: Node selection constraints

**Relationships**: One deployment per application component (frontend, backend)

### Service Configuration
**Definition**: Kubernetes Service resource for network access to application components

**Fields**:
- service_type: Type of service (ClusterIP, NodePort, LoadBalancer)
- port_mappings: List of port mappings (external:internal)
- selector_labels: Labels to match pods to this service
- session_affinity: Session affinity configuration
- external_traffic_policy: Traffic routing policy for LoadBalancer services

**Relationships**: One service per application component that needs network access

### Ingress Configuration
**Definition**: Kubernetes Ingress resource for external access to frontend

**Fields**:
- hostname: Hostname for external access
- path_prefixes: URL path prefixes to route to backend
- tls_configuration: TLS certificate configuration
- load_balancer_annotations: Annotations for load balancer configuration
- rate_limiting: Rate limiting configuration

**Relationships**: One ingress for frontend component

### ConfigMap Configuration
**Definition**: Kubernetes ConfigMap for non-sensitive configuration

**Fields**:
- config_data: Key-value pairs of configuration data
- application_scoped: Boolean indicating if config is application-specific
- mount_paths: Paths where config should be mounted in containers

**Relationships**: Multiple ConfigMaps may exist for different configuration purposes

### Secret Configuration
**Definition**: Kubernetes Secret for sensitive configuration data

**Fields**:
- secret_data: Base64-encoded key-value pairs of sensitive data
- secret_type: Type of secret (generic, TLS, etc.)
- access_permissions: Permissions for accessing the secret

**Relationships**: Secrets linked to specific deployments that require sensitive data

## Helm Chart Entities

### Chart Metadata
**Definition**: Metadata information for Helm charts

**Fields**:
- chart_name: Name of the Helm chart
- chart_version: Version of the Helm chart
- app_version: Version of the application
- description: Description of the chart
- dependencies: List of dependent charts
- maintainers: List of chart maintainers

### Value Parameters
**Definition**: Configurable parameters for Helm chart deployment

**Fields**:
- parameter_name: Name of the parameter
- parameter_type: Type of parameter (string, int, bool, etc.)
- default_value: Default value for the parameter
- description: Description of what the parameter controls
- required: Whether the parameter is required

**Relationships**: Values provide customizable configuration for all Kubernetes resources

## State Transitions

### Container State Transitions
**States**: Pending → Running → Terminated
**Transitions**:
- Healthy container: Pending → Running (success)
- Failed container: Pending → Terminated (failure)
- Container restart: Running → Terminated → Pending (restart)

### Pod State Transitions
**States**: Pending → Running → Succeeded | Failed
**Transitions**:
- Healthy pod: Pending → Running (success)
- Failed pod: Pending → Failed (init failure) | Running → Failed (runtime failure)

### Deployment State Transitions
**States**: Active → Updating → Rollback → Stable
**Transitions**:
- Normal deployment: Active → Updating → Stable
- Rollback required: Active → Rollback → Stable

## Validation Rules

### Docker Configuration Validation
- Base image must exist in registry
- Ports must be within valid range (1-65535)
- Memory/CPU requests must not exceed limits
- Required environment variables must be defined

### Kubernetes Resource Validation
- Label selectors must match pod labels
- Service ports must be unique within namespace
- Resource limits must be positive integers
- Image names must follow Docker image naming convention

### Helm Chart Validation
- Chart version must follow semantic versioning
- Required parameters must have default values
- Template syntax must be valid
- Dependencies must be available in repositories

## Integration Points

### With Existing Application Data
- User authentication data preserved through JWT mechanism
- Task data remains in PostgreSQL database with persistent volume claims
- Conversation history preserved through database persistence
- User isolation maintained through existing application logic

### With CI/CD Pipeline
- Container images built and pushed to registry
- Helm charts packaged and stored in chart repository
- Kubernetes deployments triggered through CI/CD workflows
- Health checks integrated into deployment validation