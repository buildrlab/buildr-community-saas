export const config = {
  region: process.env.AWS_REGION ?? 'us-east-1',
  tableName: process.env.DDB_TABLE_NAME ?? 'buildrlab-main',
  allowTestMode: process.env.ALLOW_TEST_MODE === 'true',
  testUser: process.env.TEST_USER ?? 'dev-user',
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  cognitoIssuer:
    process.env.COGNITO_ISSUER ??
    (process.env.AWS_REGION && process.env.COGNITO_USER_POOL_ID
      ? `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
      : undefined),
  cognitoJwksUri:
    process.env.COGNITO_JWKS_URI ??
    (process.env.AWS_REGION && process.env.COGNITO_USER_POOL_ID
      ? `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
      : undefined),
};
