output "ecr_repo_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "ecs_cluster" {
  value = aws_ecs_cluster.cluster.name
}

output "ecs_cluster_arn" {
  value = aws_ecs_cluster.cluster.arn
}

output "ecs_service" {
  value = aws_ecs_service.backend_service.name
}

output "ecs_service_arn" {
  value = aws_ecs_service.backend_service.id
}

output "ecs_task_definition_arn" {
  value = aws_ecs_task_definition.task.arn
}

output "ecs_task_exec_role_arn" {
  value = aws_iam_role.ecs_task_exec.arn
}

output "ecs_task_role_arn" {
  value = aws_iam_role.ecs_task_role.arn
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.employees.name
}

output "dynamodb_table_arn" {
  value = aws_dynamodb_table.employees.arn
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "subnet_id" {
  value = aws_subnet.subnet.id
}

output "security_group_id" {
  value = aws_security_group.sg.id
}

output "cloudwatch_log_group_name" {
  value = aws_cloudwatch_log_group.log_group.name
}

output "lambda_ecs_scheduler_name" {
  value = aws_lambda_function.ecs_scheduler.function_name
}

output "lambda_ecs_scheduler_arn" {
  value = aws_lambda_function.ecs_scheduler.arn
}
