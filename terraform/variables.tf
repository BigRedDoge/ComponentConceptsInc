variable "domain" {
  description = "Apex domain name. componentconceptsinc.com is canonical; www redirects to it."
  type        = string
  default     = "componentconceptsinc.com"
}

variable "github_repo" {
  description = "GitHub repository identifier for OIDC sub claims. Includes numeric org and repo IDs that GitHub appends to prevent sub-claim hijacking after renames."
  type        = string
  default     = "BigRedDoge@23642952/ComponentConceptsInc@1339580913"
}
