# Production Checklist

Complete this checklist before launching to production.

## Environment Configuration

- [ ] Set `AWS_REGION` env var (e.g., `us-east-1`)
- [ ] Configure Cognito: `COGNITO_USER_POOL_ID` and `COGNITO_CLIENT_ID`
- [ ] Set `NEXT_PUBLIC_API_URL` to your production API Gateway URL
- [ ] Disable test mode: `ALLOW_TEST_MODE=false` and unset `TEST_USER`
- [ ] Verify `NEXT_PUBLIC_TEST_MODE=false` in Next.js env

## Infrastructure

- [ ] DynamoDB tables provisioned via Terraform
- [ ] Lambda functions deployed with correct IAM roles
- [ ] API Gateway configured with CORS for your production domain
- [ ] CloudFront distribution pointing to S3 for Next.js static export
- [ ] Route53 DNS configured for your custom domain
- [ ] SSL/TLS certificate issued (ACM)
- [ ] S3 bucket policy blocks public access (CloudFront only)

## Security

- [ ] `ALLOW_TEST_MODE=false` in production environment
- [ ] API keys stored in AWS Secrets Manager, not plaintext env vars
- [ ] CORS `allowedOrigins` restricted to production domain
- [ ] Lambda IAM roles follow least-privilege principle
- [ ] DynamoDB encryption at rest enabled
- [ ] CloudWatch log groups have retention policy set (minimum 30 days)

## CI/CD

- [ ] GitHub Actions secrets configured: `AWS_ROLE_ARN`, `AWS_REGION`
- [ ] OIDC trust relationship set up between GitHub and AWS
- [ ] Deployment pipeline only deploys from `main` branch
- [ ] Preview deployments use separate dev account (not prod AWS account)

## Monitoring & Alerts

- [ ] CloudWatch alarms for Lambda errors (threshold: > 5 errors/5min)
- [ ] CloudWatch alarms for 5xx API Gateway responses
- [ ] X-Ray tracing enabled on Lambda functions
- [ ] SNS notification topic configured for critical alerts
- [ ] Budget alerts in AWS Cost Explorer

## Before Go-Live

- [ ] Load test the API with realistic traffic patterns
- [ ] Test auth flow end-to-end in production environment
- [ ] Verify all CRUD operations work with real Cognito tokens
- [ ] Run E2E tests against production URL (`BASE_URL=https://yourapp.com pnpm test:e2e`)
- [ ] Check Core Web Vitals with PageSpeed Insights
- [ ] Verify no test-mode endpoints are accessible in production
