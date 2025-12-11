![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-brightgreen) ![CI/CD](https://img.shields.io/badge/GitHub%20Actions-Automated-blueviolet) ![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%26%20Grafana-orange) ![Datadog](https://img.shields.io/badge/Logging-Datadog-632CA6) ![Ngrok](https://img.shields.io/badge/Tunneling-Ngrok-1F1E37)

# TechCommerce Microservices Platform

**DevOps Assignment:** Production-ready e-commerce microservices with CI/CD, Kubernetes orchestration, auto-scaling, monitoring, centralized logging, and secure external access
**Student Name:** Kaushal Bhattarai
**Course:** COMP 488

---

## 📋 Table of Contents

* [Architecture Overview](#architecture-overview)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Quick Start Guide](#quick-start-guide)
* [Ngrok Tunneling Setup](#ngrok-tunneling-setup)
* [Logging Infrastructure (IaC)](#logging-infrastructure-iac)
* [Design Decisions](#design-decisions)
* [Security Approach](#security-approach)
* [Troubleshooting Guide](#troubleshooting-guide)
* [CI/CD Pipeline](#cicd-pipeline)
* [Monitoring & Alerting](#monitoring--alerting)
* [Project Structure](#project-structure)
* [Reflection & Future Improvements](#reflection--future-improvements)

<details>
<summary><strong>🏗️ Architecture Overview</strong></summary>

### System Architecture

``` bash
External Users (Internet)
      │
      ▼
┌─────────────────┐
│  Ngrok Tunnel   │ (Public HTTPS URLs)
│  Frontend: 3000 │ → https://abc123.ngrok.app
│  Product: 5003  │ → https://def456.ngrok.app
│  Order: 5004    │ → https://ghi789.ngrok.app
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load Balancer  │ (NodePort: 30000)
└────────┬────────┘
         ▼
┌──────────────────────────────┐
│      Frontend Service        │
│  Node.js 18 + Express        │
│  Port: 3000                  │
│  Replicas: 2                 │
│  Health Checks: ✓            │
└──────┬────────────┬──────────┘
       │            │
       ▼            ▼
┌──────────────┐  ┌──────────────┐
│ Product API  │  │ Order API    │
│ Python 3.11  │  │ Python 3.11 │
│ Port: 5005   │  │ Port: 5003  │
│ Min 2, Max 10│  │ Replicas 2  │
│ AutoScale:70%│  │ Health ✓    │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └─────────┬───────┘
                 ▼
┌────────────────────────────────┐
│    Datadog Agent (DaemonSet)   │
│  Collecting logs from all pods │
│  Sending to Datadog Cloud      │
└────────┬───────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Datadog Cloud Platform       │
│ • Log Explorer               │
│ • Real-time Log Streaming    │
│ • Log Analytics              │
│ • Custom Dashboards          │
└─────────────────────────────┘

```

### Component Details

| Service     | Language/Framework   | Port | Replicas | Auto-Scale    | CPU Request | Memory Request |
| ----------- | -------------------- | ---- | -------- | ------------- | ----------- | -------------- |
| Frontend    | Node.js 18 + Express | 3000 | 2        | No            | 100m        | 128Mi          |
| Product API | Python 3.11 + Flask  | 5003 | 2-10     | Yes (CPU 70%) | 100m        | 128Mi          |
| Order API   | Python 3.11 + Flask  | 5004 | 2        | No            | 100m        | 128Mi          |
| Datadog Agent | Datadog 7.51      | -    | Per Node | No            | 200m        | 256Mi          |
| Prometheus  | Prometheus 2.45      | 9090 | 1        | No            | 500m        | 512Mi          |
| Grafana     | Grafana 10.0         | 3000 | 1        | No            | 250m        | 256Mi          |

</details>

<details>
<summary><strong>✨ Features</strong></summary>

### Core Functionality

* ✅ Microservices Architecture: Frontend, Product API, Order API
* ✅ Docker Containerization: Multi-stage builds
* ✅ Kubernetes Orchestration: Replicas and HPA
* ✅ Horizontal Pod Autoscaling (CPU 70%)
* ✅ Health Checks: Liveness and readiness probes
* ✅ Resource Management: CPU & Memory requests/limits

### DevOps Features

* ✅ CI/CD Pipeline: GitHub Actions with automated stages
* ✅ Security Scanning: Trivy, npm audit, Safety
* ✅ Environment Management: Staging & Production via Kustomize
* ✅ Monitoring: Prometheus + Grafana dashboards
* ✅ Centralized Logging: Datadog with Infrastructure as Code
* ✅ Alerting: 10+ alert rules
* ✅ Rollback Capability on deployment failure

### Infrastructure Features

* ✅ **External Access:** Ngrok secure tunnels for all services
* ✅ **Logging as IaC:** Terraform + Helm + Datadog
* ✅ **Automated Log Collection:** From all Kubernetes containers
* ✅ **Real-time Log Streaming:** To Datadog Cloud
* ✅ **Log Analytics:** Search, filter, and analyze across all services

### Security Features

* ✅ Non-root Containers (UID 1001)
* ✅ Kubernetes Secrets for sensitive data
* ✅ Image Scanning in CI/CD
* ✅ Network Policies for service communication
* ✅ Kubernetes RBAC
* ✅ Secure Ngrok tunnels with authentication

</details>

<details>
<summary><strong>🛠️ Technology Stack</strong></summary>

### Application Layer

* **Frontend:** Node.js 18, Express.js, Axios, Prometheus Client
* **Backend APIs:** Python 3.11, Flask, Flask-CORS, prometheus-flask-exporter

### Infrastructure Layer

* **Containerization:** Docker 20.10+, Multi-stage builds
* **Orchestration:** Kubernetes 1.27+, Minikube
* **Configuration:** Kustomize
* **Infrastructure as Code:** Terraform 1.0+
* **Package Management:** Helm 3.11+

### External Access

* **Tunneling:** Ngrok (Secure HTTPS tunnels)
* **Domain Management:** Ngrok public URLs

### Logging & Observability

* **Log Collection:** Datadog Agent (deployed via Helm)
* **Log Management:** Datadog Cloud Platform
* **Metrics:** Prometheus 2.45
* **Visualization:** Grafana 10.0
* **Alerting:** Prometheus AlertManager

### CI/CD

* **Version Control:** Git, GitHub
* **CI/CD Platform:** GitHub Actions
* **Container Registry:** Docker Hub
* **Security Scanning:** Trivy, npm audit, Safety

</details>

<details>
<summary><strong>🚀 Quick Start Guide</strong></summary>

### Prerequisites

```bash
docker --version          # 20.10+
kubectl version --client  # 1.27+
minikube version          # 1.30+
terraform version         # 1.0+
git --version             # 2.30+
node --version            # 18+
python --version          # 3.11+
ngrok version             # 3.0+
```

**Accounts Needed:**

* GitHub: [Sign Up](https://github.com/signup)
* Docker Hub: [Sign Up](https://hub.docker.com/signup)
* Datadog: [Sign Up](https://www.datadoghq.com/)
* Ngrok: [Sign Up](https://ngrok.com/signup)

### Installation Steps

1. **Clone Repository**

```bash
git clone https://github.com/YOUR_USERNAME/techcommerce-microservices.git
cd techcommerce-microservices
```

2. **Start Kubernetes Cluster**

```bash
minikube start --cpus=4 --memory=8192
minikube addons enable metrics-server
minikube addons enable ingress
kubectl get nodes
```

3. **Build Docker Images**

```bash
eval $(minikube docker-env)
docker build -t techcommerce-frontend:latest ./frontend
docker build -t techcommerce-product-api:latest ./product-api
docker build -t techcommerce-order-api:latest ./order-api
docker images | grep techcommerce
```

4. **Deploy to Kubernetes**

```bash
kubectl apply -f k8s/base/
kubectl get pods -n techcommerce -w
```

5. **Verify Deployment**

```bash
kubectl get all -n techcommerce
kubectl run test --rm -i --restart=Never \
  --image=curlimages/curl -n techcommerce -- \
  curl -s http://frontend-service:3000/health
```

6. **Access Services**

```bash
minikube service frontend-service -n techcommerce --url
echo "Frontend: http://$(minikube ip):30000"
```

7. **Deploy Monitoring Stack**

```bash
kubectl create namespace monitoring
kubectl apply -f monitoring/prometheus/
kubectl apply -f monitoring/grafana/
kubectl get pods -n monitoring -w
```

8. **Deploy Logging Infrastructure (Datadog)**

```bash
# Navigate to logging infrastructure
cd infrastructure/logging

# Configure your Datadog credentials
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Datadog API keys

# Deploy Datadog Agent
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars" -auto-approve

# Verify deployment
kubectl get pods -n datadog
```

9. **Setup Ngrok Tunnels**

```bash
# Authenticate Ngrok
ngrok config add-authtoken YOUR_NGROK_TOKEN

# Start tunnels (see Ngrok section below)
ngrok http 3000 --region us  # Frontend
ngrok http 5003 --region us  # Product API
ngrok http 5004 --region us  # Order API
```

10. **Import Grafana Dashboard**

* Open Grafana: `http://$(minikube ip):30030`
* Username: `admin`, Password: `admin123`
* Import Dashboard ID: `315`

</details>

<details>
<summary><strong>🌐 Ngrok Tunneling Setup</strong></summary>

### Why Ngrok?

Ngrok provides secure, encrypted tunnels to expose local services to the internet without:
- Port forwarding configuration
- Firewall modifications
- Static IP requirements
- DNS setup

**Use Cases:**
- Demo applications to clients/stakeholders
- Webhook testing (payment gateways, webhooks)
- Mobile app development with local backend
- Share work-in-progress with remote teams

### Prerequisites

1. **Install Ngrok:**

```bash
# macOS
brew install ngrok/ngrok/ngrok

# Windows (using Chocolatey)
choco install ngrok

# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok

# Verify installation
ngrok version
```

2. **Get Ngrok Auth Token:**

- Sign up at: https://ngrok.com/signup
- Go to: https://dashboard.ngrok.com/get-started/your-authtoken
- Copy your auth token

3. **Configure Ngrok:**

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Tunneling Individual Services

#### Tunnel Each Service Separately

**Terminal 1 - Frontend:**
```bash
ngrok http 3000 --region us --log=stdout
# Output: Forwarding https://abc123.ngrok.app -> http://localhost:3000
```

**Terminal 2 - Product API:**
```bash
ngrok http 5003 --region us --log=stdout
# Output: Forwarding https://def456.ngrok.app -> http://localhost:5003
```

**Terminal 3 - Order API:**

```bash
ngrok http 5004 --region us --log=stdout
# Output: Forwarding https://ghi789.ngrok.app -> http://localhost:5004
```

### Accessing Your Services

Once tunnels are running, you'll get public URLs:

```
Frontend:    https://abc123.ngrok.app
Product API: https://def456.ngrok.app/products
Order API:   https://ghi789.ngrok.app/orders
```

**Example API Calls:**

```bash
# Get products from public URL
curl https://def456.ngrok.app/products

# Create order from public URL
curl -X POST https://ghi789.ngrok.app/orders \
  -H "Content-Type: application/json" \
  -d '{"product_id": "123", "quantity": 2}'

# Access frontend
open https://abc123.ngrok.app
```

### Ngrok Dashboard

Monitor your tunnels at: https://dashboard.ngrok.com/endpoints/status

Features:
- Real-time request inspection
- Request/response logs
- Traffic replay
- Connection statistics

### Security Best Practices

1. **Enable Basic Auth (Free tier):**

-Free Tier used for the academic purpose of this project

```bash
ngrok http 3000 --basic-auth="username:password"
```

### Troubleshooting Ngrok

| Issue | Solution |
|-------|----------|
| "Tunnel not found" | Check if service is running on specified port |
| "Account limit reached" | Free tier allows 1 agent with 2 tunnels - upgrade or use config file |
| "ERR_NGROK_108" | Auth token invalid - reconfigure with correct token |
| Slow tunnel | Choose closer region: `--region us/eu/ap/au/sa/jp/in` |

### Ngrok Pricing Tiers

| Feature | Free | Basic ($8/mo) | Pro ($20/mo) |
|---------|------|---------------|--------------|
| Tunnels per agent | 2 | 10 | 20 |
| Custom domains | ❌ | ✅ | ✅ |
| IP whitelisting | ❌ | ❌ | ✅ |
| OAuth | ❌ | ❌ | ✅ |

**For this project:** Free tier is sufficient for development/demo purposes.

</details>

<details>
<summary><strong>📊 Logging Infrastructure (IaC)</strong></summary>

### Overview

This project implements **centralized logging** for all Kubernetes workloads using:
- **Datadog** for log aggregation and analysis
- **Terraform** for infrastructure as code
- **Helm** for Kubernetes package management

All container logs are automatically collected and streamed to Datadog Cloud in real-time.

### Architecture

``` bash
┌─────────────────────────────────────────────────────┐
│           Kubernetes Cluster (Minikube)             │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Frontend  │  │Product   │  │Order     │         │
│  │Pod       │  │API Pod   │  │API Pod   │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │             │             │                 │
│       └──────┬──────┴──────┬──────┘                │
│              │             │                        │
│        ┌─────▼─────────────▼─────┐                 │
│        │   Datadog Agent          │                 │
│        │   (DaemonSet)            │                 │
│        │   - Log Collection       │                 │
│        │   - Metrics Collection   │                 │
│        │   - APM (optional)       │                 │
│        └──────────┬───────────────┘                 │
│                   │                                  │
└───────────────────┼──────────────────────────────────┘
                    │
                    │ HTTPS (443)
                    ▼
         ┌──────────────────────┐
         │   Datadog Cloud      │
         │   (us5.datadoghq.com)│
         │                      │
         │  • Log Explorer      │
         │  • Dashboards        │
         │  • Alerts            │
         │  • Analytics         │
         └──────────────────────┘
```

### Prerequisites

1. **Datadog Account:**
   - Sign up: https://www.datadoghq.com/
   - Note your Datadog site (e.g., `us5.datadoghq.com`)

2. **Get API Keys:**
   - API Key: https://app.datadoghq.com/organization-settings/api-keys
   - Application Key: https://app.datadoghq.com/organization-settings/application-keys

3. **Required Tools:**

```bash
terraform version  # 1.0+
kubectl version    # 1.27+
```

### Quick Setup

#### Step 1: Navigate to Infrastructure Directory

```bash
cd infrastructure/logging
```

#### Step 2: Configure Credentials

Create `terraform.tfvars`:

```hcl
datadog_api_key = "your-32-character-api-key-here"
datadog_app_key = "your-40-character-app-key-here"
datadog_site    = "us5.datadoghq.com"  # Or your actual site
cluster_name    = "techcommerce-cluster"
```

**⚠️ Security:** Add to `.gitignore`:
```bash
echo "infrastructure/logging/terraform.tfvars" >> .gitignore
```

#### Step 3: Deploy Datadog Agent

```bash
# Initialize Terraform
terraform init

# Review planned changes
terraform plan -var-file="terraform.tfvars"

# Deploy (takes 2-3 minutes)
terraform apply -var-file="terraform.tfvars" -auto-approve
```

#### Step 4: Verify Deployment

```bash
# Check pods are running (should see 3/3 Running)
kubectl get pods -n datadog

# Verify logs agent started
kubectl logs -n datadog -l app=datadog -c agent | grep "logs-agent started"

# Check log collection status
AGENT_POD=$(kubectl get pods -n datadog -l app=datadog -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n datadog $AGENT_POD -c agent -- agent status | grep -A 10 "Logs Agent"
```

**Expected Output:**
``` bash
Logs Agent
==========
  Reliable: Sending compressed logs in HTTPS to agent-http-intake.logs.us5.datadoghq.com
  LogsProcessed: 15234
  LogsSent: 15234
```

#### Step 5: Access Datadog UI

1. Go to: `https://[your-site].datadoghq.com/logs`
2. Time range: "Past 15 minutes"
3. Search: `source:kubernetes`

You should see logs from all your microservices!

### Infrastructure Files

``` bash
infrastructure/logging/
├── datadog-helm.tf      # Helm release configuration
├── namespace.tf         # Datadog namespace
├── providers.tf         # Terraform & Kubernetes providers
├── secrets.tf           # Kubernetes secret for API keys
├── variables.tf         # Input variables
└── terraform.tfvars     # Your credentials (git-ignored)
```

### Key Features Enabled

| Feature | Description | Status |
|---------|-------------|--------|
| Log Collection | Automatic collection from all containers | ✅ Enabled |
| Container Discovery | Auto-discover new pods/containers | ✅ Enabled |
| Log Enrichment | Kubernetes labels, pod names, namespaces | ✅ Enabled |
| APM | Application Performance Monitoring | ✅ Enabled |
| Process Monitoring | CPU, memory, process metrics | ✅ Enabled |
| Metrics Collection | Infrastructure & custom metrics | ✅ Enabled |

### Using Datadog for Log Analysis

#### Basic Log Queries

``` bash
# All logs from TechCommerce namespace
kube_namespace:techcommerce

# Frontend service logs only
service:frontend

# Error logs across all services
status:error

# Order API errors in last hour
service:order-api status:error
```

#### Create Log Monitors

1. Go to **Monitors → New Monitor → Logs**
2. Define query: `service:order-api status:error`
3. Set threshold: Alert if count > 10 in 5 minutes
4. Configure notifications
5. Save monitor

#### Custom Dashboards

1. Go to **Dashboards → New Dashboard**
2. Add widgets:
   - Log Stream (real-time logs)
   - Top List (error count by service)
   - Timeseries (log volume over time)
3. Save and share

### Maintenance

#### Update Datadog Agent

```bash
cd infrastructure/logging

# Update version in datadog-helm.tf
# version = "3.58.0"  # New version

terraform apply -var-file="terraform.tfvars" -auto-approve
```

#### Check Agent Status

```bash
kubectl exec -n datadog -l app=datadog -c agent -- agent status
```

#### Restart Agent

```bash
kubectl rollout restart daemonset datadog -n datadog
```

#### Remove Datadog

```bash
cd infrastructure/logging
terraform destroy -var-file="terraform.tfvars" -auto-approve
```

### Troubleshooting

See detailed troubleshooting guide: `infrastructure/logging/TROUBLESHOOTING.md`

**Common Issues:**

| Issue | Quick Fix |
|-------|-----------|
| 403 API Key Error | Verify API key is correct and matches Datadog site |
| LogsProcessed: 0 | Check kubelet connectivity (Minikube needs `tlsVerify: false`) |
| Pods not starting | Verify secret key names use hyphens: `api-key` not `api_key` |
| No logs in UI | Wait 2-3 minutes, check correct Datadog site URL |

### Cost Optimization

Datadog offers:
- **Free Trial:** 14 days full access
- **Free Tier:** Limited (5 hosts, 1-day retention)
- **Pro Tier:** $15/host/month (15-month retention)

**For this project:**
- Development: Use free trial or free tier
- Production: Consider log sampling or filtering to reduce costs

### Infrastructure as Code Benefits

✅ **Reproducible:** Deploy to any cluster with same config  
✅ **Version Controlled:** Track infrastructure changes in Git  
✅ **Automated:** No manual Datadog agent installation  
✅ **Consistent:** Same setup across dev/staging/prod  
✅ **Documented:** Configuration is self-documenting  

</details>

<details>
<summary><strong>🧩 Design Decisions</strong></summary>

* **Microservices Architecture**
  Independent scalability & fault isolation
* **Kubernetes**
  Self-healing, auto-scaling, declarative deployments
* **Kustomize**
  Environment-specific overlays
* **GitHub Actions CI/CD**
  Automated testing, scanning, building, deployment
* **Monitoring Stack**
  Prometheus + Grafana for metrics & visualization
* **Centralized Logging**
  Datadog for log aggregation, search, and analytics
* **Infrastructure as Code**
  Terraform for reproducible, version-controlled infrastructure
* **Secure Tunneling**
  Ngrok for safe external access without firewall configuration
* **Docker Multi-stage Builds**
  Smaller images, improved security

</details>

<details>
<summary><strong>🔒 Security Approach</strong></summary>

### Application Security

* **Secret Management**  
  Kubernetes Secrets, no hard-coded credentials
* **RBAC**  
  Minimum permissions for services & CI/CD pipelines
* **Non-Root Containers**  
  UID 1001, least privilege principle
* **Image Scanning**  
  Trivy in CI/CD pipeline
* **Network Policies**  
  Explicit allowed service communication
* **Supply Chain Security**  
  Signed commits and scoped tokens

### Infrastructure Security

* **Datadog API Keys**
  Stored in Kubernetes Secrets, never committed to Git
* **Terraform State**
  Contains sensitive data, excluded from version control
* **Ngrok Tunnels**
  HTTPS encryption, optional authentication
* **Service Isolation**
  Each microservice in separate container with resource limits

### Best Practices Implemented

✅ Secrets in environment variables, not code  
✅ Least privilege access (RBAC, non-root)  
✅ Security scanning in CI/CD  
✅ Infrastructure as Code for audit trail  
✅ Encrypted communication (HTTPS via Ngrok)  
✅ No hardcoded credentials  

</details>

<details>
<summary><strong>🧰 Troubleshooting Guide</strong></summary>

### Kubernetes Issues

| Issue                             | Symptom                                            | Fix                                                                     |
| --------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| Cluster Not Connecting | `dial tcp [::1]:8080: connect: connection refused` | `kubectl config current-context` & restart Minikube                     |
| Pods CrashLoopBackOff             | Pod fails repeatedly                               | `kubectl describe pod <pod> -n techcommerce` & `kubectl logs <pod>`     |
| Deployment Rollout Timeout        | `kubectl rollout status --timeout=5m` fails        | Check events: `kubectl get events -n techcommerce` & rollback if needed |
| Image Pull Failures               | ErrImagePull                                       | Ensure image exists & update Docker secrets                             |
| Minikube Access Issues            | Service not reachable in browser                   | `minikube service list` & use correct URL                               |

### Datadog Logging Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| 403 API Key Error | `API key is invalid` in logs | Re-copy API key from Datadog UI, verify Datadog site matches |
| No Logs Collected | `LogsProcessed: 0` | Check kubelet connection, add `tlsVerify: false` for Minikube |
| Pods Not Starting | `Init:CreateContainerConfigError` | Verify secret uses `api-key` (hyphen) not `api_key` (underscore) |
| Logs Not in UI | Pods running but no logs visible | Wait 2-3 min, check correct Datadog site, verify time range |

### Ngrok Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Tunnel Not Starting | `ERR_NGROK_108` | Verify auth token: `ngrok config add-authtoken TOKEN` |
| Connection Refused | `tunnel not found` | Ensure service is running on specified port |
| Slow Performance | High latency | Choose closer region: `--region us/eu/ap` |
| Account Limit | "tunnel limit reached" | Free tier = 1 agent with 2 tunnels, upgrade or use config file |

</details>

<details>
<summary><strong>🔄 CI/CD Pipeline</strong></summary>

``` bash
Git Push → Test → Security Scan → Build & Push → Deploy Staging → Manual Approval → Deploy Production
```

**Pipeline Stages:**

1. **Test:** Jest (Frontend), Pytest (APIs)
2. **Security Scan:** Trivy, npm audit, Safety
3. **Build & Push Docker Images:** Multi-stage, tag with SHA & latest
4. **Deploy Staging:** Auto deploy + smoke tests
5. **Manual Approval:** Production gate
6. **Deploy Production:** Rolling update, backup, auto-rollback

**Pipeline Features:**
- ✅ Automated testing on every push
- ✅ Security vulnerability scanning
- ✅ Multi-stage Docker builds
- ✅ Environment-specific deployments
- ✅ Rollback on failure
- ✅ Deployment notifications

</details>

<details>
<summary><strong>📊 Monitoring & Alerting</strong></summary>

### Metrics Collection

**Datadog** (Cloud)
- Log aggregation from all services
- Real-time log streaming
- Log-based metrics and alerts
- APM traces (optional)

### Visualization

**Datadog Dashboards**
- Log analytics
- Service-level metrics
- Infrastructure overview

### Alerting

**Datadog Monitors**
- Log-based alerts (error rates, patterns)
- APM alerts (latency, error rates)
- Custom metric alerts

### Health Checks

- **Liveness Probes:** Restart unhealthy containers
- **Readiness Probes:** Remove from load balancer if not ready
- **Startup Probes:** Allow slow-starting containers

</details>

<details>
<summary><strong>📂 Project Structure</strong></summary>

```bash
techcommerce-microservices/
├── frontend/                    # Frontend service (Node.js + Express)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── product-api/                 # Product API service (Python + Flask)
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── order-api/                   # Order API service (Python + Flask)
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── k8s/                         # Kubernetes manifests
│   ├── base/                    # Base configs
│   ├── staging/                 # Staging overlays
│   └── production/              # Production overlays
├── terraform/                   # Infrastructure as Code
│   └── logging/                 # Datadog logging setup
│       ├── datadog-helm.tf      # Helm release config
│       ├── namespace.tf         # Kubernetes namespace
│       ├── providers.tf         # Terraform providers
│       ├── secrets.tf           # API key secrets
│       ├── variables.tf         # Input variables
│       ├── terraform.tfvars     # Credentials (git-ignored)
│      
├── monitoring/                  # Monitoring stack
│   ├── prometheus/              # Prometheus configs & alert rules
│   └── grafana/                 # Grafana dashboards
├── .github/workflows/           # GitHub Actions CI/CD workflows
└── README.md                    # This file
```

</details>

<details>
<summary><strong>📚 Reflection & Future Improvements</strong></summary>

### Reflection

This project demonstrates a **complete, production-ready DevOps pipeline** for microservices:

**What I Built:**
- ✅ Microservices architecture with 3 independently scalable services
- ✅ Full CI/CD automation with GitHub Actions
- ✅ Kubernetes orchestration with auto-scaling
- ✅ Centralized logging infrastructure as code (Terraform + Datadog)
- ✅ Secure external access via Ngrok tunnels
- ✅ Comprehensive monitoring (Prometheus + Grafana + Datadog)
- ✅ Security scanning and best practices

**Skills Demonstrated:**
1. **Infrastructure as Code:** Terraform for reproducible deployments
2. **Container Orchestration:** Kubernetes, Helm, Kustomize
3. **CI/CD:** Automated pipelines with testing and deployment
4. **Observability:** Metrics (Prometheus), Logs (Datadog), Dashboards (Grafana)
5. **Security:** Secrets management, RBAC, image scanning
6. **Cloud-Native Patterns:** Health checks, resource limits, auto-scaling

### Challenges Overcome

| Challenge | Solution |
|-----------|----------|
| Datadog 403 API Key Errors | Secret key naming (hyphens vs underscores), site matching |
| Kubelet Connection on Minikube | Disabled TLS verification for local development |
| Log Collection Not Working | Fixed kubelet connectivity, verified log agent configuration |
| Ngrok Tunnel Limits | Used configuration file for multiple tunnels |
| Resource Constraints | Tuned CPU/memory limits based on actual usage |

### Key Learnings

1. **Infrastructure as Code is Essential**
   - Reproducible environments across dev/staging/prod
   - Version-controlled infrastructure changes
   - Easier debugging and troubleshooting

2. **Observability is Critical**
   - Centralized logging saved hours of debugging
   - Real-time metrics enable proactive issue resolution
   - Dashboards provide instant system health visibility

3. **Automation Reduces Errors**
   - CI/CD catches issues before production
   - Automated deployments ensure consistency
   - Security scanning prevents vulnerabilities

4. **Security Must Be Built-In**
   - Secrets management from day one
   - Non-root containers by default
   - Regular security scanning in pipeline

### Future Improvements

| Area | Improvement | Benefit |
| --------------- | -------------------------------- | ------------------------------------------- |
| **CI/CD**           | GitOps with ArgoCD/FluxCD        | Fully automated, declarative deployments    |
| **Security**        | OPA Gatekeeper, image signing (Cosign)    | Policy enforcement & supply chain integrity |
| **Infrastructure**  | Managed Kubernetes (EKS/GKE/AKS) | Real-world scalability & HA                 |
| **Testing**         | Integration & E2E tests                | Validates inter-service communication       |
| **Logging**      | Log sampling & archiving       | Cost optimization for high-volume logs    |
| **Monitoring**      | Distributed tracing (Jaeger)               | End-to-end request visibility                   |
| **Networking** | Service mesh (Istio/Linkerd) | Advanced traffic management & security |
| **CI Optimization** | Self-hosted runners, caching     | Faster pipeline execution                   |
| **Disaster Recovery** | Automated backups, multi-region | Business continuity |

### Production Readiness Checklist

This project is ready for production deployment with these considerations:

**✅ Already Implemented:**
- Kubernetes orchestration with health checks
- Auto-scaling for traffic spikes
- Centralized logging and monitoring
- CI/CD pipeline with security scanning
- Infrastructure as Code
- Secrets management
- Resource limits and requests

### Final Thoughts

This TechCommerce platform demonstrates **enterprise-grade DevOps practices**:

1. **Scalable:** Auto-scales based on demand
2. **Resilient:** Self-healing with Kubernetes
3. **Observable:** Complete visibility through logs and metrics
4. **Secure:** Multiple security layers and best practices
5. **Automated:** CI/CD pipeline handles testing and deployment
6. **Maintainable:** Infrastructure as Code ensures consistency

The project showcases the **complete DevOps lifecycle**: from local development with Ngrok tunnels, through automated CI/CD, to production-ready Kubernetes deployment with comprehensive observability via Datadog and Prometheus.

**This is not just a demo—it's a blueprint for building modern, cloud-native applications.**

</details>

---

**Built by Kaushal Bhattarai**  
**Course:** COMP 488 - DevOps Engineering