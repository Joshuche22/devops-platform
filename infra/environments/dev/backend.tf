terraform {
  backend "s3" {
    bucket         = "devops-platform-tfstate-dev"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-2"
    encrypt        = true
    dynamodb_table = "devops-platform-tfstate-lock"
  }
}
