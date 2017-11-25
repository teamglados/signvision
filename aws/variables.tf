variable "aws_credentials" {
  default = "/root/.aws/credentials"
}

variable "region" {
  description = "AWS region to create resources in"
  default = "eu-central-1"
}

variable "availability_zone" {
  description = "Availability zone"
  default = "eu-central-1a"
}

variable "ecs_cluster_name" {
  description = "Name of the Amazon ECS cluster"
  default = "test"
}

variable "amis" {
  description = "AMI to spawn. Defaults to the AWS ECS optimized images"
  default = {
    us-east-1 = "ami-cb2305a1"
    us-west-1 = "ami-bdafdbdd"
    us-west-2 = "ami-ec75908c"
    eu-west-1 = "ami-13f84d60"
    eu-central-1 =  "ami-c3253caf"
    ap-northeast-1 = "ami-e9724c87"
    ap-southeast-1 = "ami-5f31fd3c"
    ap-southeast-2 = "ami-83af8ae0"
  }
}

variable "autoscale_min" {
  default = "1"
  description = "Minimum autoscale (number of EC2)"
}

variable "autoscale_max" {
  default = "1"
  description = "Maximum autoscale (number of EC2)"
}

variable "autoscale_desired" {
  default = "1"
  description = "Desired autoscale (number of EC2)"
}

variable "instance_type" {
  default = "t2.micro"
}
