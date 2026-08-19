terraform {
  backend "s3" {
    # TODO(sean): after running terraform/bootstrap, paste the state_bucket_name
    # output here, then run: terraform init -migrate-state
    bucket       = "cci-tfstate-REPLACE_WITH_ACCOUNT_ID"
    key          = "site/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
