variable "name" {
  type        = string
  description = "Prefix for API resources"
}

variable "table_name" {
  type        = string
  description = "DynamoDB table name"
}

variable "table_arn" {
  type        = string
  description = "DynamoDB table ARN"
}

variable "lambda_projects_zip" {
  type        = string
  description = "Path to zipped projects lambda"
}

variable "lambda_health_zip" {
  type        = string
  description = "Path to zipped health lambda"
}

variable "cognito_user_pool_id" {
  type        = string
  description = "Cognito user pool id"
}

variable "cognito_issuer" {
  type        = string
  description = "Cognito issuer URL"
}

variable "cognito_jwks_uri" {
  type        = string
  description = "Cognito JWKS URI"
}

variable "allow_test_mode" {
  type        = bool
  description = "Enable X-Test-User bypass"
  default     = false
}

variable "cors_allow_origins" {
  type        = list(string)
  description = "Allowed CORS origins"
  default     = ["*"]
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}
