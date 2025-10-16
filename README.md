![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-brightgreen) ![CI/CD](https://img.shields.io/badge/GitHub%20Actions-Automated-blueviolet) ![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%26%20Grafana-orange)

# TechCommerce Microservices Platform

**DevOps Assignment:** Production-ready e-commerce microservices with CI/CD, Kubernetes orchestration, auto-scaling, and monitoring
**Student Name:** Kaushal Bhattarai
**Course:** COMP 488

---

## 📋 Table of Contents

* [Architecture Overview](#architecture-overview)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Quick Start Guide](#quick-start-guide)
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

```
External Users
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
│ Port: 5000   │  │ Port: 5000  │
│ Min 2, Max 10│  │ Replicas 2  │
│ AutoScale:70%│  │ Health ✓    │
└──────┬───────┘  └─────────────┘
       ▼
┌─────────────────────┐
│ ConfigMaps & Secrets│
│ Environment Vars    │
└─────────────────────┘
       ▼
┌─────────────────────────────┐
│ Monitoring Stack             │
│ • Prometheus (9090)          │
│ • Grafana (3000)             │
│ • 10+ Alert Rules            │
└─────────────────────────────┘
```

### Component Details

| Service     | Language/Framework   | Port | Replicas | Auto-Scale    | CPU Request | Memory Request |
| ----------- | -------------------- | ---- | -------- | ------------- | ----------- | -------------- |
| Frontend    | Node.js 18 + Express | 3000 | 2        | No            | 100m        | 128Mi          |
| Product API | Python 3.11 + Flask  | 5000 | 2-10     | Yes (CPU 70%) | 100m        | 128Mi          |
| Order API   | Python 3.11 + Flask  | 5000 | 2        | No            | 100m        | 128Mi          |
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
* ✅ Alerting: 10+ alert rules
* ✅ Rollback Capability on deployment failure

### Security Features

* ✅ Non-root Containers (UID 1001)
* ✅ Kubernetes Secrets for sensitive data
* ✅ Image Scanning in CI/CD
* ✅ Network Policies for service communication
* ✅ Kubernetes RBAC

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

### CI/CD

* **Version Control:** Git, GitHub
* **CI/CD Platform:** GitHub Actions
* **Container Registry:** Docker Hub
* **Security Scanning:** Trivy, npm audit, Safety

### Monitoring & Observability

* **Metrics:** Prometheus 2.45
* **Visualization:** Grafana 10.0
* **Alerting:** Prometheus AlertManager

</details>

<details>
<summary><strong>🚀 Quick Start Guide</strong></summary>

### Prerequisites

```bash
docker --version          # 20.10+
kubectl version --client  # 1.27+
minikube version          # 1.30+
git --version             # 2.30+
node --version            # 18+
python --version          # 3.11+
```

**Accounts Needed:**

* GitHub: [Sign Up](https://github.com/signup)
* Docker Hub: [Sign Up](https://hub.docker.com/signup)

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

8. **Import Grafana Dashboard**

* Open Grafana: `http://$(minikube ip):30030`
* Username: `admin`, Password: `admin123`
* Import Dashboard ID: `315`

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
* **Monitoring**
  Prometheus + Grafana for metrics & alerts
* **Docker**
  Multi-stage builds for efficiency & security

</details>

<details>
<summary><strong>🔒 Security Approach</strong></summary>

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

</details>

<details>
<summary><strong>🧰 Troubleshooting Guide</strong></summary>

| Issue                             | Symptom                                            | Fix                                                                     |
| --------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| Kubernetes Cluster Not Connecting | `dial tcp [::1]:8080: connect: connection refused` | `kubectl config current-context` & restart Minikube                     |
| Pods CrashLoopBackOff             | Pod fails repeatedly                               | `kubectl describe pod <pod> -n techcommerce` & `kubectl logs <pod>`     |
| Deployment Rollout Timeout        | `kubectl rollout status --timeout=5m` fails        | Check events: `kubectl get events -n techcommerce` & rollback if needed |
| Image Pull Failures               | ErrImagePull                                       | Ensure image exists & update Docker secrets                             |
| Minikube Access Issues            | Service not reachable in browser                   | `minikube service list` & use correct URL                               |

</details>

<details>
<summary><strong>CI/CD Pipeline</strong></summary>

```
Git Push → Test → Security Scan → Build & Push → Deploy Staging → Manual Approval → Deploy Production
```

**Pipeline Stages:**

1. Test: Jest (Frontend), Pytest (APIs)
2. Security Scan: Trivy, npm audit, Safety
3. Build & Push Docker Images: Multi-stage, tag with SHA & latest
4. Deploy Staging: Auto deploy + smoke tests
5. Manual Approval: Production gate
6. Deploy Production: Rolling update, backup, auto-rollback

</details>

<details>
<summary><strong>📊 Monitoring & Alerting</strong></summary>

* **Metrics**  
  Prometheus (Port 9090)
* **Visualization**  
  Grafana (Port 3000)
* **Alerting**  
  10+ Prometheus alert rules
* **Health Checks**  
  Liveness & readiness probes

</details>

<details>
<summary><strong>📂 Project Structure</strong></summary>

```bash

techcommerce-microservices/
├── frontend/ # Frontend service (Node.js + Express)
├── product-api/ # Product API service (Python + Flask)
├── order-api/ # Order API service (Python + Flask)
├── k8s/ # Kubernetes manifests
│ ├── base/ # Base configs
│ ├── staging/ # Staging overlays
│ └── production/ # Production overlays
├── monitoring/ # Monitoring stack
│ ├── prometheus/ # Prometheus configs & alert rules
│ └── grafana/ # Grafana dashboards
└── .github/workflows/ # GitHub Actions CI/CD workflows
```

</details>

<details>
<summary><strong>📚 Reflection & Future Improvements</strong></summary>

### Reflection

* Gained hands-on experience with production-grade microservices, CI/CD, Kubernetes, and monitoring.
* Reinforced automation, scalability, observability, and security.

### Challenges

* Configuring `kubectl` contexts, Docker Hub authentication, Kustomize overlays, and monitoring setup in Minikube.

### Future Improvements

| Area            | Improvement                      | Benefit                                     |
| --------------- | -------------------------------- | ------------------------------------------- |
| CI/CD           | GitOps with ArgoCD/FluxCD        | Fully automated, declarative deployments    |
| Security        | OPA Gatekeeper, image signing    | Policy enforcement & supply chain integrity |
| Infrastructure  | Managed Kubernetes (EKS/GKE/AKS) | Real-world scalability & HA                 |
| Testing         | Integration tests                | Validates inter-service communication       |
| Monitoring      | AlertManager notifications       | Faster incident response                    |
| CI Optimization | Self-hosted runners, caching     | Faster pipeline execution                   |

### Final Thoughts

This project demonstrates the complete DevOps lifecycle: from local development to automated CI/CD and Kubernetes orchestration. The TechCommerce platform is **scalable, resilient, and production-ready**, following real-world cloud-native architecture and DevOps best practices.
