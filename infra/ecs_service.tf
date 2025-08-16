# Application Load Balancer (ALB)

resource "aws_security_group" "alb_sg" {
  name        = "empresa-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "backend_alb" {
  name               = "empresa-backend-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.subnet.id, aws_subnet.subnet2.id]
}

resource "aws_lb_target_group" "backend_tg" {
  name        = "empresa-backend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "backend_listener" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}


# ECS Service

resource "aws_ecs_service" "backend_service" {
  name            = "empresa-service-alb"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.subnet.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "crud-aws-nodejs-nextjs"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener.backend_listener, aws_iam_role_policy_attachment.exec_attach
  ]

  deployment_controller {
    type = "ECS"
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60

  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}
