provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "cars_db" {
  name         = "AutoVerwaltungDB-luka"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Kennzeichen"

  attribute {
    name = "Kennzeichen"
    type = "S"
  }
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "auto-verwaltung-frontend-lukajovanic-2026-002"
}

resource "aws_s3_bucket_website_configuration" "frontend_config" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_public_access" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.frontend_bucket.id

  depends_on = [aws_s3_bucket_public_access_block.frontend_public_access]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_lambda_function" "backend" {
  filename         = "backend_code.zip"
  function_name    = "AutoAPI-luka"
  role             = "arn:aws:iam::905418083278:role/LabRole"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("backend_code.zip")
}

output "bucket_name" {
  value = aws_s3_bucket.frontend_bucket.bucket
}

output "website_url" {
  value = aws_s3_bucket_website_configuration.frontend_config.website_endpoint
}