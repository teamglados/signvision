resource "aws_elb" "test-http" {
  name = "test-http-elb"
  security_groups = ["${aws_security_group.load_balancers.id}"]
  subnets = ["${aws_subnet.main.id}"]

  connection_draining = true
  cross_zone_load_balancing = true

  listener {
    lb_protocol = "http"
    lb_port = 80
    instance_protocol = "http"
    instance_port = 3000
  }
  health_check {
    healthy_threshold = 3
    unhealthy_threshold = 2
    target = "TCP:3000"
    interval = 15
    timeout = 10
  }
}

resource "aws_ecs_task_definition" "test-http" {
  family = "test-http"
  container_definitions = "${file("task-definitions/test-http.json")}"
}

resource "aws_ecs_service" "test-http" {
  name = "test-http"
  cluster = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.test-http.family}:${aws_ecs_task_definition.test-http.revision}"
  iam_role = "${aws_iam_role.ecs_service_role.arn}"
  desired_count = 2
  depends_on = ["aws_iam_role_policy.ecs_service_role_policy"]

  load_balancer {
    elb_name = "${aws_elb.test-http.id}"
    container_name = "test-http"
    container_port = 3000
  }
}
