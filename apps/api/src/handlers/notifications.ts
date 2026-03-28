import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import type { Notification } from '@buildrlab/shared';

import { authenticate, AuthError } from '../auth.js';
import { normalizeHeaders, type HeaderMap } from '../headers.js';
import { empty, json } from '../response.js';

const notificationStore = new Map<string, Notification[]>();

const seedNotifications = (userId: string): Notification[] => [
  {
    id: `notif-${userId}-1`,
    userId,
    type: 'member_joined',
    title: 'Welcome to BuildrLab Community!',
    message: 'Your account is set up. Start by creating a project.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: `notif-${userId}-2`,
    userId,
    type: 'system',
    title: 'Platform update',
    message: 'New features are available: member profiles and notification centre.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const getNotificationsForUser = (userId: string): Notification[] => {
  if (!notificationStore.has(userId)) {
    notificationStore.set(userId, seedNotifications(userId));
  }
  return notificationStore.get(userId) ?? [];
};

const handleError = (error: unknown, requestId?: string) => {
  if (error instanceof AuthError) {
    return json(401, { error: { message: error.message, requestId } });
  }
  const message = error instanceof Error ? error.message : 'Unexpected error';
  return json(400, { error: { message, requestId } });
};

export const handleNotificationsRequest = async (input: {
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
    const notifications = getNotificationsForUser(auth.userId);

    if (input.method === 'GET' && input.path === '/notifications') {
      return json(200, { data: notifications });
    }

    // PUT /notifications/read-all
    if (input.method === 'PUT' && input.path === '/notifications/read-all') {
      const updated = notifications.map((n) => ({ ...n, read: true }));
      notificationStore.set(auth.userId, updated);
      return json(200, { data: updated });
    }

    // PUT /notifications/:id/read
    const readMatch = input.path.match(/^\/notifications\/(.+)\/read$/);
    if (input.method === 'PUT' && readMatch) {
      const notifId = readMatch[1];
      const updated = notifications.map((n) =>
        n.id === notifId ? { ...n, read: true } : n,
      );
      notificationStore.set(auth.userId, updated);
      const target = updated.find((n) => n.id === notifId);
      if (!target) {
        return json(404, { error: { message: 'Notification not found', requestId: input.requestId } });
      }
      return json(200, { data: target });
    }

    return json(404, { error: { message: 'Not found', requestId: input.requestId } });
  } catch (error) {
    return handleError(error, input.requestId);
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const headers = normalizeHeaders(event.headers ?? undefined);
  return handleNotificationsRequest({
    method: event.requestContext.http.method,
    path: event.rawPath ?? '/',
    headers,
    body: event.body,
    pathParameters: event.pathParameters ?? null,
    requestId: event.requestContext.requestId,
  });
};
