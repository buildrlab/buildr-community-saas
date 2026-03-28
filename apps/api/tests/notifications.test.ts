import { describe, it, expect } from 'vitest';
import { handleNotificationsRequest } from '../src/handlers/notifications';

const testHeaders = { 'x-test-user': 'test-user-notif' };

describe('handleNotificationsRequest', () => {
  describe('GET /notifications', () => {
    it('returns pre-seeded notifications for new user', async () => {
      const result = await handleNotificationsRequest({
        method: 'GET',
        path: '/notifications',
        headers: testHeaders,
      });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body ?? '{}');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
    });

    it('returns notifications with correct shape', async () => {
      const result = await handleNotificationsRequest({
        method: 'GET',
        path: '/notifications',
        headers: testHeaders,
      });
      const body = JSON.parse(result.body ?? '{}');
      const first = body.data[0];
      expect(typeof first.id).toBe('string');
      expect(typeof first.title).toBe('string');
      expect(typeof first.read).toBe('boolean');
    });

    it('returns 401 without auth', async () => {
      const result = await handleNotificationsRequest({
        method: 'GET',
        path: '/notifications',
        headers: {},
      });
      expect(result.statusCode).toBe(401);
    });
  });

  describe('PUT /notifications/read-all', () => {
    it('marks all notifications as read', async () => {
      const result = await handleNotificationsRequest({
        method: 'PUT',
        path: '/notifications/read-all',
        headers: testHeaders,
      });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body ?? '{}');
      expect(Array.isArray(body.data)).toBe(true);
      body.data.forEach((n: { read: boolean }) => {
        expect(n.read).toBe(true);
      });
    });
  });

  describe('PUT /notifications/:id/read', () => {
    it('marks a specific notification as read', async () => {
      // Get notifications first to find an ID
      const listResult = await handleNotificationsRequest({
        method: 'GET',
        path: '/notifications',
        headers: testHeaders,
      });
      const { data } = JSON.parse(listResult.body ?? '{}');
      const id = data[0]?.id as string;

      const result = await handleNotificationsRequest({
        method: 'PUT',
        path: `/notifications/${id}/read`,
        headers: testHeaders,
      });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body ?? '{}');
      expect(body.data.read).toBe(true);
      expect(body.data.id).toBe(id);
    });

    it('returns 404 for non-existent notification', async () => {
      const result = await handleNotificationsRequest({
        method: 'PUT',
        path: '/notifications/non-existent-id/read',
        headers: testHeaders,
      });
      expect(result.statusCode).toBe(404);
    });
  });

  describe('OPTIONS', () => {
    it('returns 204 for preflight', async () => {
      const result = await handleNotificationsRequest({
        method: 'OPTIONS',
        path: '/notifications',
        headers: {},
      });
      expect(result.statusCode).toBe(204);
    });
  });
});
