terraform {
  backend "s3" {
    bucket       = "cci-tfstate-090357280973"
    key          = "site/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
