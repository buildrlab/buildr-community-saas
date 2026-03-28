import { describe, it, expect, beforeEach } from 'vitest';
import { handleProfileRequest } from '../src/handlers/profile';

// Use test mode headers
const testHeaders = { 'x-test-user': 'test-user-1' };

describe('handleProfileRequest', () => {
  describe('GET /profile', () => {
    it('returns a profile for authenticated user', async () => {
      const result = await handleProfileRequest({
        method: 'GET',
        path: '/profile',
        headers: testHeaders,
      });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body ?? '{}');
      expect(body.data.userId).toBe('test-user-1');
      expect(typeof body.data.displayName).toBe('string');
      expect(body.data.role).toBe('member');
    });

    it('returns 401 without auth headers', async () => {
      const result = await handleProfileRequest({
        method: 'GET',
        path: '/profile',
        headers: {},
      });
      expect(result.statusCode).toBe(401);
    });
  });

  describe('PUT /profile', () => {
    it('updates displayName', async () => {
      const result = await handleProfileRequest({
        method: 'PUT',
        path: '/profile',
        headers: testHeaders,
        body: JSON.stringify({ displayName: 'Updated Name' }),
      });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body ?? '{}');
      expect(body.data.displayName).toBe('Updated Name');
    });

    it('updates bio', async () => {
      const result = await handleProfileRequest({
        method: 'PUT',
        path: '/profile',
        headers: testHeaders,
        body: JSON.stringify({ bio: 'A short bio' }),
      });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body ?? '{}');
      expect(body.data.bio).toBe('A short bio');
    });

    it('returns 401 without auth', async () => {
      const result = await handleProfileRequest({
        method: 'PUT',
        path: '/profile',
        headers: {},
        body: JSON.stringify({ displayName: 'Hacker' }),
      });
      expect(result.statusCode).toBe(401);
    });

    it('returns 400 for invalid JSON body', async () => {
      const result = await handleProfileRequest({
        method: 'PUT',
        path: '/profile',
        headers: testHeaders,
        body: 'not-json',
      });
      expect(result.statusCode).toBe(400);
    });
  });

  describe('OPTIONS', () => {
    it('returns 204 for preflight', async () => {
      const result = await handleProfileRequest({
        method: 'OPTIONS',
        path: '/profile',
        headers: {},
      });
      expect(result.statusCode).toBe(204);
    });
  });
});
