import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { authenticate, AuthError } from '../auth';
import { normalizeHeaders, type HeaderMap } from '../headers';
import {
  getMember,
  inviteMember,
  listMembers,
  removeMember,
  updateMemberProfile,
  updateMemberRole,
} from '../members';
import { empty, json } from '../response';

import type { MemberRole } from '@buildrlab/shared';

const parsePath = (
  path: string,
  pathParameters?: Record<string, string>,
): { workspaceId: string; userId?: string; subResource?: string } | null => {
  const wsId = pathParameters?.workspaceId;
  const uId = pathParameters?.userId;
  if (wsId) {
    return { workspaceId: wsId, userId: uId, subResource: undefined };
  }

  // /api/workspaces/{workspaceId}/members/{userId}/profile
  const match = path.match(
    /^\/api\/workspaces\/([^/]+)\/members(?:\/([^/]+))?(?:\/([^/]+))?$/,
  );
  if (!match?.[1]) return null;

  return {
    workspaceId: match[1],
    userId: match[2] as string | undefined,
    subResource: match[3] as string | undefined,
  };
};

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

export const handleMembersRequest = async (input: {
  method: string;
  path: string;
  headers: HeaderMap;
  body?: string | null;
  pathParameters?: Record<string, string> | null;
  queryStringParameters?: Record<string, string> | null;
  requestId?: string;
}) => {
  if (input.method === 'OPTIONS') {
    return empty(204);
  }

  try {
    const auth = await authenticate(input.headers);
    const parsed = parsePath(input.path, input.pathParameters ?? undefined);

    if (!parsed) {
      return json(404, { error: { message: 'Not found', requestId: input.requestId } });
    }

    const { workspaceId, userId, subResource } = parsed;

    // POST /api/workspaces/{workspaceId}/members/invite
    if (input.method === 'POST' && userId === 'invite' && !subResource) {
      const payload = parseBody(input.body) as { email?: string; role?: MemberRole } | null;
      if (!payload?.email) {
        return json(422, { error: { message: 'Email is required', requestId: input.requestId } });
      }
      const member = await inviteMember(workspaceId, {
        email: payload.email,
        role: payload.role,
      });
      return json(201, { data: member });
    }

    // GET /api/workspaces/{workspaceId}/members
    if (input.method === 'GET' && !userId) {
      const qsp = input.queryStringParameters ?? {};
      const members = await listMembers(workspaceId, {
        search: qsp.search,
        role: qsp.role as MemberRole | undefined,
      });
      return json(200, { data: members });
    }

    // GET /api/workspaces/{workspaceId}/members/{userId}
    if (input.method === 'GET' && userId && !subResource) {
      const member = await getMember(workspaceId, userId);
      if (!member) {
        return json(404, { error: { message: 'Member not found', requestId: input.requestId } });
      }
      return json(200, { data: member });
    }

    // PUT /api/workspaces/{workspaceId}/members/{userId}/profile
    if (input.method === 'PUT' && userId && subResource === 'profile') {
      const payload = parseBody(input.body) as Record<string, unknown> | null;
      if (!payload) {
        return json(422, { error: { message: 'Request body is required', requestId: input.requestId } });
      }
      const member = await updateMemberProfile(workspaceId, userId, {
        displayName: payload.displayName as string | undefined,
        bio: payload.bio as string | undefined,
        location: payload.location as string | undefined,
        website: payload.website as string | undefined,
        skills: payload.skills as string[] | undefined,
      });
      return json(200, { data: member });
    }

    // PUT /api/workspaces/{workspaceId}/members/{userId}/role
    if (input.method === 'PUT' && userId && subResource === 'role') {
      const payload = parseBody(input.body) as { role?: MemberRole } | null;
      if (!payload?.role) {
        return json(422, { error: { message: 'Role is required', requestId: input.requestId } });
      }
      const member = await updateMemberRole(workspaceId, userId, { role: payload.role });
      return json(200, { data: member });
    }

    // DELETE /api/workspaces/{workspaceId}/members/{userId}
    if (input.method === 'DELETE' && userId && !subResource) {
      await removeMember(workspaceId, userId);
      return json(204, { data: null });
    }

    // Use auth context to avoid unused variable
    void auth;

    return json(404, { error: { message: 'Not found', requestId: input.requestId } });
  } catch (error) {
    return handleError(error, input.requestId);
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = normalizeHeaders(event.headers ?? undefined);
  return handleMembersRequest({
    method: event.requestContext.http.method,
    path: event.rawPath ?? '/',
    headers,
    body: event.body,
    pathParameters: (event.pathParameters as Record<string, string> | undefined) ?? undefined,
    queryStringParameters: (event.queryStringParameters as Record<string, string> | undefined) ?? undefined,
    requestId: event.requestContext.requestId,
  });
};
