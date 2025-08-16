terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "sa-east-1"
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "crud-aws-nodejs-nextjs"
      Environment = "dev"
      Owner       = "barro"
    }
  }
}
