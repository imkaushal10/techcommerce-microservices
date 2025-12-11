# Datadog Agent using Official Helm Chart
resource "helm_release" "datadog" {
  name       = "datadog"
  repository = "https://helm.datadoghq.com"
  chart      = "datadog"
  namespace  = kubernetes_namespace.datadog.metadata[0].name
  version    = "3.57.0"
  
  set {
    name  = "datadog.apiKeyExistingSecret"
    value = kubernetes_secret.datadog.metadata[0].name
  }
  
  set {
    name  = "datadog.site"
    value = var.datadog_site
  }
  
  set {
    name  = "datadog.clusterName"
    value = var.cluster_name
  }
  
  set {
    name  = "datadog.logs.enabled"
    value = "true"
  }
  
  set {
    name  = "datadog.logs.containerCollectAll"
    value = "true"
  }
  
  set {
    name  = "datadog.apm.enabled"
    value = "true"
  }
  
  set {
    name  = "datadog.processAgent.enabled"
    value = "true"
  }
  
  # FIX FOR MINIKUBE - Disable kubelet TLS verification
  set {
    name  = "datadog.kubelet.tlsVerify"
    value = "false"
  }
  
  set {
    name  = "agents.containers.agent.resources.requests.cpu"
    value = "200m"
  }
  
  set {
    name  = "agents.containers.agent.resources.requests.memory"
    value = "256Mi"
  }
  
  set {
    name  = "agents.containers.agent.resources.limits.cpu"
    value = "500m"
  }
  
  set {
    name  = "agents.containers.agent.resources.limits.memory"
    value = "512Mi"
  }

  depends_on = [
    kubernetes_namespace.datadog,
    kubernetes_secret.datadog
  ]
}

output "datadog_helm_status" {
  value       = helm_release.datadog.status
  description = "Status of Datadog Helm release"
}

output "datadog_helm_version" {
  value       = helm_release.datadog.version
  description = "Version of Datadog Helm chart deployed"
}
