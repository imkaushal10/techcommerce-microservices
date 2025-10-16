# TechCommerce Microservices Platform

DevOps Assignment: Production-ready e-commerce microservices with complete CI/CD, Kubernetes orchestration, auto-scaling, and monitoring.

Student Name: [Your Name]
Course: DevOps Engineering
Date: October 16, 2025

📋 Table of Contents

Architecture Overview
Features
Technology Stack
Quick Start Guide
Design Decisions
Security Approach
Troubleshooting Guide
CI/CD Pipeline
Monitoring & Alerting
Project Structure

🏗️ Architecture Overview
System Architecture Diagram
┌──────────────────────────────────────────────────────────────────┐
│                          External Users                           │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │   (NodePort)    │
                    │   Port: 30000   │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    Frontend Service          │
              │    Node.js 18 + Express      │
              │    Port: 3000                │
              │    Replicas: 2               │
              │    Health Checks: ✓          │
              └──────┬────────────┬──────────┘
                     │            │
         ┌───────────┘            └───────────┐
         ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│   Product API        │          │    Order API         │
│   Python 3.11/Flask  │          │   Python 3.11/Flask  │
│   Port: 5000         │          │   Port: 5000         │
│   Min Replicas: 2    │          │   Replicas: 2        │
│   Max Replicas: 10   │          │   Static Scaling     │
│   Auto-Scale: CPU70% │          │   Health Checks: ✓   │
└──────────────────────┘          └──────────────────────┘
         │                                    │
         └──────────┬─────────────────────────┘
                    ▼
         ┌─────────────────────┐
         │   ConfigMaps &      │
         │   Secrets           │
         │   Environment Vars  │
         └─────────────────────┘
                    │
                    ▼
         ┌─────────────────────────────┐
         │   Monitoring Stack          │
         │   • Prometheus (Port 9090)  │
         │   • Grafana (Port 3000)     │
         │   • 10+ Alert Rules         │
         └─────────────────────────────┘
Component Details
ServiceLanguage/FrameworkPortReplicasAuto-ScaleCPU RequestMemory RequestFrontendNode.js 18 + Express30002No100m128MiProduct APIPython 3.11 + Flask50002-10Yes (70% CPU)100m128MiOrder APIPython 3.11 + Flask50002No100m128MiPrometheusPrometheus 2.4590901No500m512MiGrafanaGrafana 10.030001No250m256Mi
CI/CD Pipeline Flow
┌──────────┐
│   Git    │
│   Push   │
│ to main  │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│   1. Test Stage     │
│   • Frontend (Jest) │
│   • APIs (Pytest)   │
│   • Code Coverage   │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────┐
│   2. Security Scan       │
│   • Trivy (SAST)        │
│   • npm audit           │
│   • Safety (Python)     │
└──────┬───────────────────┘
       │
       ▼
┌───────────────────────────────┐
│   3. Build & Push Images      │
│   • Multi-stage Docker build  │
│   • Tag with SHA & latest     │
│   • Push to Docker Hub        │
│   • Scan images with Trivy    │
└──────┬────────────────────────┘
       │
       ▼
┌────────────────────────┐
│   4. Deploy Staging    │
│   • Automatic deploy   │
│   • Run smoke tests    │
│   • Verify health      │
└──────┬─────────────────┘
       │
       ▼
┌───────────────────────┐
│  5. Manual Approval   │
│  ⏸️  Await approval   │
└──────┬────────────────┘
       │
       ▼
┌──────────────────────────────┐
│   6. Deploy Production       │
│   • Manual gate required     │
│   • Backup current state     │
│   • Rolling update           │
│   • Post-deploy verification │
│   • Auto-rollback on fail    │
└──────────────────────────────┘

✨ Features
Core Functionality

✅ Microservices Architecture: 3 independent services (Frontend, Product API, Order API)
✅ Docker Containerization: Multi-stage builds for optimized images
✅ Kubernetes Orchestration: Complete K8s manifests with best practices
✅ Horizontal Pod Autoscaling: CPU-based auto-scaling (70% threshold)
✅ Health Checks: Liveness and readiness probes for all services
✅ Resource Management: CPU/Memory requests and limits

DevOps Features

✅ CI/CD Pipeline: GitHub Actions with 6 automated stages
✅ Security Scanning: Trivy, npm audit, Safety checks
✅ Environment Management: Staging and Production with Kustomize
✅ Monitoring: Prometheus metrics + Grafana dashboards
✅ Alerting: 10+ alert rules for proactive monitoring
✅ Rollback Capability: Automatic rollback on deployment failures

Security Features

✅ Non-root Containers: All services run as non-root user (UID 1001)
✅ Secret Management: Kubernetes Secrets for sensitive data
✅ Image Scanning: Vulnerability scanning in CI/CD
✅ Network Policies: Service-to-service communication control
✅ RBAC: Role-based access control for Kubernetes resources

🛠️ Technology Stack
Application Layer

Frontend: Node.js 18, Express.js, Axios, Prometheus Client
Backend APIs: Python 3.11, Flask, Flask-CORS
Metrics: prometheus-flask-exporter, prom-client

Infrastructure Layer

Containerization: Docker 20.10+, Multi-stage builds
Orchestration: Kubernetes 1.27+, Minikube
Configuration: Kustomize (built into kubectl)

CI/CD

Version Control: Git, GitHub
CI/CD Platform: GitHub Actions
Container Registry: Docker Hub
Security Scanning: Trivy, npm audit, Safety

Monitoring & Observability

Metrics: Prometheus 2.45
Visualization: Grafana 10.0
Alerting: Prometheus AlertManager rules

🚀 Quick Start Guide
Prerequisites
Required Software:
bash# Verify installations
docker --version          # Need: 20.10+
kubectl version --client  # Need: 1.27+
minikube version         # Need: 1.30+
git --version            # Need: 2.30+
node --version           # Need: 18+
python --version         # Need: 3.11+
Installation Links:

Docker Desktop: https://www.docker.com/products/docker-desktop
kubectl: https://kubernetes.io/docs/tasks/tools/
Minikube: https://minikube.sigs.k8s.io/docs/start/
Node.js: https://nodejs.org/
Python: https://www.python.org/downloads/

Accounts Needed:

GitHub account: https://github.com/signup
Docker Hub account: https://hub.docker.com/signup

Installation Steps:

Step 1: Clone Repository
bashgit clone https://github.com/YOUR_USERNAME/techcommerce-microservices.git
cd techcommerce-microservices
Step 2: Start Kubernetes Cluster (2 minutes)
bash# Start minikube with sufficient resources
minikube start --cpus=4 --memory=8192

# Enable required addons

minikube addons enable metrics-server
minikube addons enable ingress

# Verify cluster is running

kubectl get nodes

# Should show: STATUS = Ready

Step 3: Build Docker Images
bash# Use minikube's Docker daemon (important!)
eval $(minikube docker-env)

# Build all three services

docker build -t techcommerce-frontend:latest ./frontend
docker build -t techcommerce-product-api:latest ./product-api
docker build -t techcommerce-order-api:latest ./order-api

# Verify images are built

docker images | grep techcommerce
Step 4: Deploy to Kubernetes
bash# Create namespace and deploy all resources
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/secret.yaml
kubectl apply -f k8s/base/frontend-deployment.yaml
kubectl apply -f k8s/base/frontend-service.yaml
kubectl apply -f k8s/base/product-api-deployment.yaml
kubectl apply -f k8s/base/product-api-service.yaml
kubectl apply -f k8s/base/product-api-hpa.yaml
kubectl apply -f k8s/base/order-api-deployment.yaml
kubectl apply -f k8s/base/order-api-service.yaml

# Watch pods start up (Ctrl+C to exit)

kubectl get pods -n techcommerce -w

# Wait until all pods show STATUS = Running and READY = 1/1 or 2/2

Step 5: Verify Deployment (2 minutes)
bash# Check all resources
kubectl get all -n techcommerce

# Expected output

# - 6 pods running (2 frontend, 2 product-api, 2 order-api)

# - 3 services

# - 3 deployments

# - 1 HPA

# Test health endpoints

kubectl run test --rm -i --restart=Never \
  --image=curlimages/curl -n techcommerce -- \
  curl -s http://frontend-service:3000/health

# Should return: {"status":"healthy","service":"frontend"}

Step 6: Access Services (1 minute)
bash# Get the frontend URL
minikube service frontend-service -n techcommerce --url

# Or get the direct URL

echo "Frontend: http://$(minikube ip):30000"

# Test in browser or curl

curl http://$(minikube ip):30000
curl http://$(minikube ip):30000/health
curl http://$(minikube ip):30000/products
Step 7: Deploy Monitoring Stack (3 minutes)
bash# Create monitoring namespace
kubectl create namespace monitoring

# Deploy Prometheus

kubectl apply -f monitoring/prometheus/prometheus-config.yaml
kubectl apply -f monitoring/prometheus/alert-rules.yaml
kubectl apply -f monitoring/prometheus/prometheus-deployment.yaml

# Deploy Grafana

kubectl apply -f monitoring/grafana/grafana-deployment.yaml

# Wait for pods to be ready

kubectl get pods -n monitoring -w

# Get access URLs

echo "Prometheus: http://$(minikube ip):30090"
echo "Grafana: http://$(minikube ip):30030"

# Grafana credentials

# Username: admin

# Password: admin123

Step 8: Import Grafana Dashboard (2 minutes)
bash# Open Grafana in browser
open http://$(minikube ip):30030  # Mac

# OR

start http://$(minikube ip):30030  # Windows

# Login with admin/admin123

# Go to: Dashboards → Import

# Enter Dashboard ID: 315

# Select Prometheus data source

# Click Import

Testing the Application
bash# Test Frontend
curl http://$(minikube ip):30000/
curl http://$(minikube ip):30000/health
curl http://$(minikube ip):30000/products

# Test from inside cluster

kubectl run -it --rm test --image=curlimages/curl \
  --restart=Never -n techcommerce -- sh

# Inside the pod

curl http://frontend-service:3000/health
curl http://product-api-service:5000/api/products
curl http://order-api-service:5000/api/orders
exit

# Test auto-scaling (generate load)

kubectl run -it load-generator --rm --image=busybox \
  --restart=Never -n techcommerce -- sh

# Inside the pod

while true; do wget -q -O- http://product-api-service:5000/api/products; done

# In another terminal, watch HPA scale up

kubectl get hpa -n techcommerce -w