variable "name" {
  type        = string
  description = "Cognito user pool name"
}

variable "domain_prefix" {
  type        = string
  description = "Cognito hosted UI domain prefix"
}

variable "callback_urls" {
  type        = list(string)
  description = "Allowed callback URLs"
}

variable "logout_urls" {
  type        = list(string)
  description = "Allowed logout URLs"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}
