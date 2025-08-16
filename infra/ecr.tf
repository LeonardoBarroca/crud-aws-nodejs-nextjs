resource "aws_ecr_repository" "backend" {
  name                 = "crud-aws-nodejs-nextjs"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project     = "crud-aws-nodejs-nextjs"
    Environment = "dev"
    Owner       = "barro"
  }
}
