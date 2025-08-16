resource "aws_ecs_cluster" "cluster" {
  name = "empresa-cluster"
  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}

resource "aws_ecs_task_definition" "task" {
  family                   = "crud-aws-nodejs-nextjs"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_exec.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([
    {
      name         = "crud-aws-nodejs-nextjs",
      image        = "${aws_ecr_repository.backend.repository_url}:latest",
      essential    = true,
      portMappings = [{ containerPort = 3000, hostPort = 3000 }],
      environment = [
        { name = "TABLE_NAME", value = aws_dynamodb_table.employees.name },
        { name = "AWS_REGION", value = "sa-east-1" }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "/ecs/empresa",
          "awslogs-region"        = "sa-east-1",
          "awslogs-stream-prefix" = "ecs"
        }
      },
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }
    }
  ])
  lifecycle {
    create_before_destroy = true
  }
  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/ecs/empresa"
  retention_in_days = 14
  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}
