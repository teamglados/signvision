provider "aws" {
  profile = "nardeas"
  shared_credentials_file = "${var.aws_credentials}"
  region = "${var.region}"
}

resource "aws_key_pair" "deployer" {
  key_name = "deployer-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDNLRLyKyYwoC8JZJ8FfWjNvbl9SbeJ6ob7vcMe6w8i73FgmthRWTmbm0u2qyJTQMsdgWUKfHeVUDniXkNdckCCEzxQ0CFUsuW4GLnWhT6tXiultdJJelQZ99eGdHUVNmdEzsu7WROusT2H5vupPrSICrpmwevBDzm7rwvKVrL0oJ79F3/nv1QA4zIdcrsX54zN5Yw1usLExy3/WhMfLBXlLS+hyqnn688RSW1K4pLVkkD4Cl5jVs4Eshhb2i9be0d9v4xBdZOQiigPzoI/3b/TylvlAmwr8IsFXH/wq38X7qFH5FLGOXNEdD9rtnRMbw52iD5XtxBpvV/PGnnN5Wxn urbanski.andreas@gmail.com"
}

resource "aws_ecs_cluster" "main" {
  name = "${var.ecs_cluster_name}"
}

resource "aws_launch_configuration" "ecs" {
  name = "ECS ${var.ecs_cluster_name}"
  iam_instance_profile = "${aws_iam_instance_profile.ecs.name}"
  image_id = "${lookup(var.amis, var.region)}"
  instance_type = "${var.instance_type}"
  key_name = "${aws_key_pair.deployer.key_name}"
  security_groups = ["${aws_security_group.ecs.id}"]
  user_data = "#!/bin/bash\necho ECS_CLUSTER='${var.ecs_cluster_name}' > /etc/ecs/ecs.config"
  associate_public_ip_address = true
}

resource "aws_autoscaling_group" "ecs" {
  name = "ECS ${var.ecs_cluster_name}"
  availability_zones = ["${var.availability_zone}"]
  min_size = 1
  max_size = 1
  desired_capacity = 1
  health_check_type = "EC2"
  launch_configuration = "${aws_launch_configuration.ecs.name}"
  vpc_zone_identifier = ["${aws_subnet.main.id}"]
}

resource "aws_ecs_task_definition" "glados-server" {
  family = "glados-server"
  container_definitions = "${file("task-definitions/glados-server.json")}"
}
