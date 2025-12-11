# Create secret with Datadog API keys
resource "kubernetes_secret" "datadog" {
  metadata {
    name      = "datadog-secret"
    namespace = kubernetes_namespace.datadog.metadata[0].name
  }
  
  data = {
    api-key = var.datadog_api_key
    app-key = var.datadog_app_key
  }
  
  type = "Opaque"
}
