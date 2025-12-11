# Terraform configuration
terraform {
  required_version = ">= 1.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
}

# Kubernetes provider
provider "kubernetes" {
  config_path = "~/.kube/config"
}

# Helm provider
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}
