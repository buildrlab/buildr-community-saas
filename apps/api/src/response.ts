import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const baseHeaders = {
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization,content-type,x-test-user',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

export const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: baseHeaders,
  body: JSON.stringify(body),
});

export const empty = (statusCode: number): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: baseHeaders,
  body: '',
});
