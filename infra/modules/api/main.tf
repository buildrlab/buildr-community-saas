data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "lambda" {
  name = "${var.name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "lambda" {
  name = "${var.name}-lambda-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Query", "dynamodb:GetItem", "dynamodb:UpdateItem"]
        Resource = var.table_arn
      }
    ]
  })
}

resource "aws_lambda_function" "projects" {
  function_name = "${var.name}-projects"
  role          = aws_iam_role.lambda.arn
  runtime       = "nodejs20.x"
  handler       = "handlers/projects.handler"
  filename      = var.lambda_projects_zip
  source_code_hash = filebase64sha256(var.lambda_projects_zip)

  environment {
    variables = {
      AWS_REGION         = data.aws_region.current.name
      DDB_TABLE_NAME     = var.table_name
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      COGNITO_ISSUER      = var.cognito_issuer
      COGNITO_JWKS_URI    = var.cognito_jwks_uri
      ALLOW_TEST_MODE     = var.allow_test_mode ? "true" : "false"
    }
  }

  tags = var.tags
}

resource "aws_lambda_function" "health" {
  function_name = "${var.name}-health"
  role          = aws_iam_role.lambda.arn
  runtime       = "nodejs20.x"
  handler       = "handlers/health.handler"
  filename      = var.lambda_health_zip
  source_code_hash = filebase64sha256(var.lambda_health_zip)

  environment {
    variables = {
      AWS_REGION = data.aws_region.current.name
    }
  }

  tags = var.tags
}

resource "aws_apigatewayv2_api" "http" {
  name          = "${var.name}-http"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.cors_allow_origins
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["authorization", "content-type", "x-test-user"]
  }

  tags = var.tags
}

resource "aws_apigatewayv2_integration" "projects" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.projects.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "health" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.health.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "projects_get" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /projects"
  target    = "integrations/${aws_apigatewayv2_integration.projects.id}"
}

resource "aws_apigatewayv2_route" "projects_post" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /projects"
  target    = "integrations/${aws_apigatewayv2_integration.projects.id}"
}

resource "aws_apigatewayv2_route" "projects_delete" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "DELETE /projects/{projectId}"
  target    = "integrations/${aws_apigatewayv2_integration.projects.id}"
}

resource "aws_apigatewayv2_route" "health" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /health"
  target    = "integrations/${aws_apigatewayv2_integration.health.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  tags = var.tags
}

resource "aws_lambda_permission" "projects" {
  statement_id  = "AllowExecutionFromAPIGatewayProjects"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.projects.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

resource "aws_lambda_permission" "health" {
  statement_id  = "AllowExecutionFromAPIGatewayHealth"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.health.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
