# execution role (pull image, logs)
resource "aws_iam_role" "ecs_task_exec" {
  name = "ecsTaskExecutionRole-empresa"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
  description = "Role for ECS tasks to pull images and write logs"
  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}

resource "aws_iam_role_policy_attachment" "exec_attach" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "exec_logs_attach" {
  role       = aws_iam_role.ecs_task_exec.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# task role for app (access to DynamoDB)
resource "aws_iam_role" "ecs_task_role" {
  name               = "ecsTaskRole-empresa"
  assume_role_policy = aws_iam_role.ecs_task_exec.assume_role_policy
  description        = "Role for ECS tasks to access DynamoDB"
  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}

resource "aws_iam_policy" "dynamodb_policy" {
  name        = "empresa-dynamodb-policy"
  description = "Policy to allow CRUD operations on EmployeesTable"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource = aws_dynamodb_table.employees.arn
      }
    ]
  })
  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}

resource "aws_iam_role_policy_attachment" "task_dynamodb_attach" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.dynamodb_policy.arn
}

