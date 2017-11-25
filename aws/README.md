# AWS

Ensure you have Terraform `0.11.0` installed:

```
brew install terraform
brew install terraform
```

Setup environment:

```
export AWS_CREDENTIALS="aws_credentials=$HOME/.aws/credentials"
```

Quick ref:

```
terraform plan -var $AWS_CREDENTIALS
terraform apply -var $AWS_CREDENTIALS
terraform destroy -var $AWS_CREDENTIALS
```
