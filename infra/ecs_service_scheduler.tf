resource "aws_lambda_function" "ecs_scheduler" {
  filename         = "${path.module}/ecs_scheduler.zip"
  function_name    = "ecs-scheduler"
  role             = aws_iam_role.lambda_ecs_scheduler.arn
  handler          = "ecs_scheduler.lambda_handler"
  runtime          = "python3.9"
  source_code_hash = filebase64sha256("${path.module}/ecs_scheduler.zip")
  environment {
    variables = {
      CLUSTER_NAME  = aws_ecs_cluster.cluster.name
      SERVICE_NAME  = aws_ecs_service.backend_service.name
      DESIRED_COUNT = "1"
    }
  }
}

resource "aws_cloudwatch_event_rule" "ecs_start_rule" {
  name                = "ecs-start-schedule"
  schedule_expression = "cron(38 0 ? * MON-FRI *)"
}

resource "aws_cloudwatch_event_rule" "ecs_stop_rule" {
  name                = "ecs-stop-schedule"
  schedule_expression = "cron(48 0 ? * MON-FRI *)"
}

resource "aws_cloudwatch_event_target" "ecs_start_target" {
  rule      = aws_cloudwatch_event_rule.ecs_start_rule.name
  target_id = "ecs-start"
  arn       = aws_lambda_function.ecs_scheduler.arn
  input = jsonencode({
    desired_count = 1,
    cluster_name  = aws_ecs_cluster.cluster.name,
    service_name  = aws_ecs_service.backend_service.name
  })
}

resource "aws_cloudwatch_event_target" "ecs_stop_target" {
  rule      = aws_cloudwatch_event_rule.ecs_stop_rule.name
  target_id = "ecs-stop"
  arn       = aws_lambda_function.ecs_scheduler.arn
  input = jsonencode({
    desired_count = 0,
    cluster_name  = aws_ecs_cluster.cluster.name,
    service_name  = aws_ecs_service.backend_service.name
  })
}

resource "aws_lambda_permission" "allow_events_start" {
  statement_id  = "AllowExecutionFromEventBridgeStart"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_scheduler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.ecs_start_rule.arn
}

resource "aws_lambda_permission" "allow_events_stop" {
  statement_id  = "AllowExecutionFromEventBridgeStop"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ecs_scheduler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.ecs_stop_rule.arn
}
