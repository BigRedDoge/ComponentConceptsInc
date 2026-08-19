variable "domain" {
  description = "Apex domain name. componentconceptsinc.com is canonical; www redirects to it."
  type        = string
  default     = "componentconceptsinc.com"
}

variable "github_repo" {
  description = "GitHub repository in org/repo format. Used to scope the OIDC deploy role trust policy."
  type        = string
  default     = "BigRedDoge/ComponentConceptsInc"
}
