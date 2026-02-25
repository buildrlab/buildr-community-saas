import type { Project } from '@buildrlab/shared';

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
