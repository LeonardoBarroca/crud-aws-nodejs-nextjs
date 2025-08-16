resource "aws_dynamodb_table" "employees" {
  name         = "EmployeesTable"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}
