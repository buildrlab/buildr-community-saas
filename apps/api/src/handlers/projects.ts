import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { authenticate, AuthError } from '../auth';
import { normalizeHeaders, type HeaderMap } from '../headers';
import { createProject, deleteProject, listProjects } from '../projects';
import { empty, json } from '../response';

const parseProjectId = (path: string, pathParameters?: Record<string, string>): string | null => {
  const fromParams = pathParameters?.projectId ?? pathParameters?.id;
  if (fromParams) return fromParams;
  const match = path.match(/^\/projects\/(.+)$/);
  return match?.[1] ?? null;
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

export const handleProjectsRequest = async (input: {
  method: string;
  path: string;
  headers: HeaderMap;
  body?: string | null;
  pathParameters?: Record<string, string> | null;
  requestId?: string;
}) => {
  if (input.method === 'OPTIONS') {
    return empty(204);
  }

  try {
    const auth = await authenticate(input.headers);

    if (input.method === 'GET' && input.path === '/projects') {
      const projects = await listProjects(auth.userId);
      return json(200, { data: projects });
    }

    if (input.method === 'POST' && input.path === '/projects') {
      const payload = parseBody(input.body) as { name?: string } | null;
      if (!payload?.name) {
        return json(422, { error: { message: 'Project name is required', requestId: input.requestId } });
      }
      const project = await createProject(auth.userId, { name: payload.name });
      return json(201, { data: project });
    }

    if (input.method === 'DELETE' && input.path.startsWith('/projects/')) {
      const projectId = parseProjectId(input.path, input.pathParameters ?? undefined);
      if (!projectId) {
        return json(422, { error: { message: 'Project id is required', requestId: input.requestId } });
      }
      await deleteProject(auth.userId, projectId);
      return json(204, { data: null });
    }

    return json(404, { error: { message: 'Not found', requestId: input.requestId } });
  } catch (error) {
    return handleError(error, input.requestId);
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = normalizeHeaders(event.headers ?? undefined);
  return handleProjectsRequest({
    method: event.requestContext.http.method,
    path: event.rawPath ?? '/',
    headers,
    body: event.body,
    pathParameters: (event.pathParameters as Record<string, string> | undefined) ?? undefined,
    requestId: event.requestContext.requestId,
  });
};
