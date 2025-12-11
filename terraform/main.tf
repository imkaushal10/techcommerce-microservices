terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

# Include logging module
module "logging" {
  source = "./logging"

  datadog_api_key = var.datadog_api_key
  datadog_app_key = var.datadog_app_key
  datadog_site    = var.datadog_site
  cluster_name    = var.cluster_name
}

# Variables for main.tf
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
  description = "Datadog site"
  type        = string
  default     = "datadoghq.com"
}

variable "cluster_name" {
  description = "Kubernetes cluster name"
  type        = string
  default     = "local-k8s-cluster"
}

# Outputs
output "datadog_dashboard_url" {
  value       = module.logging.datadog_site_url
  description = "URL to access your Datadog dashboard"
}

output "datadog_namespace" {
  value       = module.logging.datadog_agent_namespace
  description = "Namespace where Datadog is running"
}