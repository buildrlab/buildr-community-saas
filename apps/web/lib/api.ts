import type {
  MemberProfile,
  MemberProfileUpdateInput,
  MemberRole,
  MemberRoleUpdateInput,
  Project,
} from '@buildrlab/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const toJson = async (response: Response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const listProjects = async (headers: Record<string, string>): Promise<Project[]> => {
  const response = await fetch(`${apiUrl}/projects`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to load projects');
  }
  return payload.data ?? [];
};

export const createProject = async (
  headers: Record<string, string>,
  name: string,
): Promise<Project> => {
  const response = await fetch(`${apiUrl}/projects`, {
    method: 'POST',
    headers: {
      ...headers,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to create project');
  }
  return payload.data;
};

export const removeProject = async (
  headers: Record<string, string>,
  projectId: string,
): Promise<void> => {
  const response = await fetch(`${apiUrl}/projects/${projectId}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok && response.status !== 204) {
    const payload = await toJson(response);
    throw new Error(payload?.error?.message ?? 'Failed to delete project');
  }
};

// ── Members ───────────────────────────────────────────────────────────

export const listMembers = async (
  headers: Record<string, string>,
  workspaceId: string,
  params?: { search?: string; role?: string },
): Promise<MemberProfile[]> => {
  const url = new URL(`${apiUrl}/api/workspaces/${workspaceId}/members`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.role) url.searchParams.set('role', params.role);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to load members');
  }
  return payload.data ?? [];
};

export const getMember = async (
  headers: Record<string, string>,
  workspaceId: string,
  userId: string,
): Promise<MemberProfile> => {
  const response = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/members/${userId}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to load member');
  }
  return payload.data;
};

export const updateMemberProfile = async (
  headers: Record<string, string>,
  workspaceId: string,
  userId: string,
  input: MemberProfileUpdateInput,
): Promise<MemberProfile> => {
  const response = await fetch(
    `${apiUrl}/api/workspaces/${workspaceId}/members/${userId}/profile`,
    {
      method: 'PUT',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to update member profile');
  }
  return payload.data;
};

export const updateMemberRole = async (
  headers: Record<string, string>,
  workspaceId: string,
  userId: string,
  input: MemberRoleUpdateInput,
): Promise<MemberProfile> => {
  const response = await fetch(
    `${apiUrl}/api/workspaces/${workspaceId}/members/${userId}/role`,
    {
      method: 'PUT',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to update member role');
  }
  return payload.data;
};

export const removeMember = async (
  headers: Record<string, string>,
  workspaceId: string,
  userId: string,
): Promise<void> => {
  const response = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/members/${userId}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok && response.status !== 204) {
    const payload = await toJson(response);
    throw new Error(payload?.error?.message ?? 'Failed to remove member');
  }
};

export const inviteMember = async (
  headers: Record<string, string>,
  workspaceId: string,
  email: string,
  role?: MemberRole,
): Promise<MemberProfile> => {
  const response = await fetch(`${apiUrl}/api/workspaces/${workspaceId}/members/invite`, {
    method: 'POST',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });
  const payload = await toJson(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Failed to invite member');
  }
  return payload.data;
};
