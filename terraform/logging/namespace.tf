# Kubernetes namespace for Datadog
resource "kubernetes_namespace" "datadog" {
  metadata {
    name = "datadog"
    
    labels = {
      name = "datadog"
    }
  }
}
