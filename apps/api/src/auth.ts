import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

import { config } from './config';
import { getHeader, type HeaderMap } from './headers';

export type AuthContext = {
  userId: string;
  mode: 'jwt' | 'test';
  claims?: JWTPayload;
};

const jwks = config.cognitoJwksUri ? createRemoteJWKSet(new URL(config.cognitoJwksUri)) : null;

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authenticate = async (headers: HeaderMap): Promise<AuthContext> => {
  const testUser = getHeader(headers, 'x-test-user');
  if (config.allowTestMode && testUser) {
    return { userId: testUser, mode: 'test' };
  }

  const authHeader = getHeader(headers, 'authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing bearer token');
  }
  if (!config.cognitoIssuer || !jwks) {
    throw new AuthError('Cognito issuer not configured');
  }

  const token = authHeader.slice('Bearer '.length);
  const { payload } = await jwtVerify(token, jwks, {
    issuer: config.cognitoIssuer,
  });

  const sub = payload.sub;
  if (!sub || typeof sub !== 'string') {
    throw new AuthError('Invalid token subject');
  }

  return { userId: sub, mode: 'jwt', claims: payload };
};
