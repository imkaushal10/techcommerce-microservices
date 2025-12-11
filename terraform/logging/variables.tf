variable "datadog_api_key" {
  description = "Datadog API Key"
  type        = string
  sensitive   = true
}

variable "datadog_app_key" {
  description = "Datadog Application Key"
  type        = string
  sensitive   = true
}

variable "datadog_site" {
  description = "Datadog site (e.g., datadoghq.com or us5.datadoghq.com)"
  type        = string
  default     = "datadoghq.com"
}

variable "namespace" {
  description = "Kubernetes namespace for Datadog agent"
  type        = string
  default     = "datadog"
}

variable "cluster_name" {
  description = "Name of your Kubernetes cluster"
  type        = string
  default     = "local-k8s-cluster"
}