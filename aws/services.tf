resource "aws_elb" "glados-elb" {
  name = "glados-elb"
  security_groups = ["${aws_security_group.load_balancers.id}"]
  subnets = ["${aws_subnet.main.id}"]

  connection_draining = true
  cross_zone_load_balancing = true

  # WebSocket route
  listener {
    lb_protocol = "tcp"
    lb_port = 80
    instance_protocol = "tcp"
    instance_port = 3000
  }

  # Static route
  listener {
    lb_protocol = "http"
    lb_port = 8000
    instance_protocol = "http"
    instance_port = 8000
  }

  # Healthcheck definition
  health_check {
    healthy_threshold = 2
    unhealthy_threshold = 10
    target = "TCP:3000"
    interval = 10
    timeout = 5
  }
}

resource "aws_ecs_service" "glados-server" {
  name = "glados-server"
  cluster = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.glados-server.family}:${aws_ecs_task_definition.glados-server.revision}"
  iam_role = "${aws_iam_role.ecs_service_role.arn}"
  desired_count = 1
  depends_on = ["aws_iam_role_policy.ecs_service_role_policy"]

  load_balancer {
    elb_name = "${aws_elb.glados-elb.id}"
    container_name = "glados-server"
    container_port = 3000
  }
}

# resource "aws_s3_bucket" "glados-bucket" {
#   bucket = "glados-bucket"
# }
