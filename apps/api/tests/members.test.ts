import { beforeEach, describe, expect, it, vi } from 'vitest';

import { memberSk, workspacePk } from '../src/keys';

vi.mock('../src/members', () => ({
  listMembers: vi.fn(),
  getMember: vi.fn(),
  updateMemberProfile: vi.fn(),
  updateMemberRole: vi.fn(),
  removeMember: vi.fn(),
  inviteMember: vi.fn(),
}));

vi.mock('../src/auth', () => ({
  authenticate: vi.fn().mockResolvedValue({ userId: 'test-user', mode: 'test' as const }),
  AuthError: class AuthError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthError';
    }
  },
}));

import { handleMembersRequest } from '../src/handlers/members';
import {
  getMember,
  inviteMember,
  listMembers,
  removeMember,
  updateMemberProfile,
  updateMemberRole,
} from '../src/members';

import type { MemberProfile } from '@buildrlab/shared';
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const testHeaders = { 'x-test-user': 'test-user' };

const asResult = (value: unknown): APIGatewayProxyStructuredResultV2 =>
  value as APIGatewayProxyStructuredResultV2;

const fakeMember: MemberProfile = {
  userId: 'user-1',
  email: 'alice@example.com',
  displayName: 'Alice',
  role: 'member',
  status: 'active',
  joinedAt: '2025-01-01T00:00:00.000Z',
  workspaceId: 'ws-1',
};

describe('key helpers', () => {
  it('builds workspace key', () => {
    expect(workspacePk('ws-1')).toBe('WORKSPACE#ws-1');
  });

  it('builds member key', () => {
    expect(memberSk('user-1')).toBe('MEMBER#user-1');
  });
});

describe('handleMembersRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET list members returns 200', async () => {
    vi.mocked(listMembers).mockResolvedValue([fakeMember]);

    const result = asResult(await handleMembersRequest({
      method: 'GET',
      path: '/api/workspaces/ws-1/members',
      headers: testHeaders,
    }));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body as string);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].userId).toBe('user-1');
  });

  it('GET single member returns 200', async () => {
    vi.mocked(getMember).mockResolvedValue(fakeMember);

    const result = asResult(await handleMembersRequest({
      method: 'GET',
      path: '/api/workspaces/ws-1/members/user-1',
      headers: testHeaders,
    }));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body as string);
    expect(body.data.userId).toBe('user-1');
  });

  it('PUT profile update returns 200', async () => {
    const updated = { ...fakeMember, displayName: 'Alice B' };
    vi.mocked(updateMemberProfile).mockResolvedValue(updated);

    const result = asResult(await handleMembersRequest({
      method: 'PUT',
      path: '/api/workspaces/ws-1/members/user-1/profile',
      headers: testHeaders,
      body: JSON.stringify({ displayName: 'Alice B' }),
    }));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body as string);
    expect(body.data.displayName).toBe('Alice B');
  });

  it('PUT role update returns 200', async () => {
    const updated = { ...fakeMember, role: 'admin' as const };
    vi.mocked(updateMemberRole).mockResolvedValue(updated);

    const result = asResult(await handleMembersRequest({
      method: 'PUT',
      path: '/api/workspaces/ws-1/members/user-1/role',
      headers: testHeaders,
      body: JSON.stringify({ role: 'admin' }),
    }));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body as string);
    expect(body.data.role).toBe('admin');
  });

  it('DELETE member returns 204', async () => {
    vi.mocked(removeMember).mockResolvedValue(undefined);

    const result = asResult(await handleMembersRequest({
      method: 'DELETE',
      path: '/api/workspaces/ws-1/members/user-1',
      headers: testHeaders,
    }));

    expect(result.statusCode).toBe(204);
  });

  it('POST invite returns 201', async () => {
    const invited: MemberProfile = {
      ...fakeMember,
      userId: 'new-user',
      email: 'bob@example.com',
      displayName: 'bob@example.com',
      status: 'invited',
    };
    vi.mocked(inviteMember).mockResolvedValue(invited);

    const result = asResult(await handleMembersRequest({
      method: 'POST',
      path: '/api/workspaces/ws-1/members/invite',
      headers: testHeaders,
      body: JSON.stringify({ email: 'bob@example.com' }),
    }));

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body as string);
    expect(body.data.email).toBe('bob@example.com');
    expect(body.data.status).toBe('invited');
  });

  it('OPTIONS returns 204', async () => {
    const result = asResult(await handleMembersRequest({
      method: 'OPTIONS',
      path: '/api/workspaces/ws-1/members',
      headers: testHeaders,
    }));

    expect(result.statusCode).toBe(204);
  });

  it('unknown route returns 404', async () => {
    const result = asResult(await handleMembersRequest({
      method: 'PATCH',
      path: '/api/workspaces/ws-1/members/user-1',
      headers: testHeaders,
    }));

    expect(result.statusCode).toBe(404);
  });

  it('GET list passes query params to listMembers', async () => {
    vi.mocked(listMembers).mockResolvedValue([]);

    await handleMembersRequest({
      method: 'GET',
      path: '/api/workspaces/ws-1/members',
      headers: testHeaders,
      queryStringParameters: { search: 'alice', role: 'admin' },
    });

    expect(listMembers).toHaveBeenCalledWith('ws-1', { search: 'alice', role: 'admin' });
  });

  it('GET member returns 404 when not found', async () => {
    vi.mocked(getMember).mockResolvedValue(null);

    const result = asResult(await handleMembersRequest({
      method: 'GET',
      path: '/api/workspaces/ws-1/members/nonexistent',
      headers: testHeaders,
    }));

    expect(result.statusCode).toBe(404);
  });
});
