import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import type { MemberProfile, UpdateProfilePayload } from '@buildrlab/shared';

import { authenticate, AuthError } from '../auth.js';
import { normalizeHeaders, type HeaderMap } from '../headers.js';
import { empty, json } from '../response.js';

const profileStore = new Map<string, Partial<MemberProfile>>();

const parseBody = (body?: string | null): unknown => {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    throw new Error('Invalid JSON');
  }
};

const handleError = (error: unknown, requestId?: string) => {
  if (error instanceof AuthError) {
    return json(401, { error: { message: error.message, requestId } });
  }
  const message = error instanceof Error ? error.message : 'Unexpected error';
  return json(400, { error: { message, requestId } });
};

const buildProfile = (userId: string) => {
  const stored = profileStore.get(userId) ?? {};
  return {
    userId,
    displayName: stored.displayName ?? 'New Member',
    bio: stored.bio ?? null,
    avatarUrl: stored.avatarUrl ?? null,
    role: 'member' as const,
    joinedAt: new Date().toISOString(),
    projectCount: 0,
  };
};

export const handleProfileRequest = async (input: {
  method: string;
  path: string;
  headers: HeaderMap;
  body?: string | null;
  requestId?: string;
}) => {
  if (input.method === 'OPTIONS') {
    return empty(204);
  }

  try {
    const auth = await authenticate(input.headers);

    if (input.method === 'GET' && input.path === '/profile') {
      return json(200, { data: buildProfile(auth.userId) });
    }

    if (input.method === 'PUT' && input.path === '/profile') {
      const payload = parseBody(input.body) as UpdateProfilePayload | null;
      const updates: Partial<MemberProfile> = {};
      if (typeof payload?.displayName === 'string') {
        updates.displayName = payload.displayName;
      }
      if (typeof payload?.bio === 'string') {
        updates.bio = payload.bio;
      }
      if (typeof payload?.avatarUrl === 'string') {
        updates.avatarUrl = payload.avatarUrl;
      }

      const existing = profileStore.get(auth.userId) ?? {};
      profileStore.set(auth.userId, { ...existing, ...updates });
      return json(200, { data: buildProfile(auth.userId) });
    }

    return json(404, { error: { message: 'Not found', requestId: input.requestId } });
  } catch (error) {
    return handleError(error, input.requestId);
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = normalizeHeaders(event.headers ?? undefined);
  return handleProfileRequest({
    method: event.requestContext.http.method,
    path: event.rawPath ?? '/',
    headers,
    body: event.body,
    requestId: event.requestContext.requestId,
  });
};
