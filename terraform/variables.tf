variable "domain" {
  description = "Apex domain name. componentconceptsinc.com is canonical; www redirects to it."
  type        = string
  default     = "componentconceptsinc.com"
}

# GitHub issues OIDC sub claims containing immutable numeric owner and repo IDs
# appended with @, not the plain org/repo slug. Verified against CloudTrail:
# the token presents repo:BigRedDoge@23642952/ComponentConceptsInc@1339580913.
# Do not "simplify" this to org/repo — the trust policy uses StringEquals and
# every assume-role call will fail with AccessDenied.
variable "github_repo" {
  description = "GitHub repository identifier for OIDC sub claims. Includes the numeric org and repo IDs GitHub appends to prevent sub-claim hijacking after renames."
  type        = string
  default     = "BigRedDoge@23642952/ComponentConceptsInc@1339580913"
}
