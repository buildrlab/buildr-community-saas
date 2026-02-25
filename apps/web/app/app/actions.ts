'use server';

import { revalidatePath } from 'next/cache';

import { createProject, removeProject } from '@/lib/api';
import { getServerAuthHeaders, hasAuth } from '@/lib/auth';

export const createProjectAction = async (formData: FormData) => {
  const name = String(formData.get('name') ?? '').trim();
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }
  if (!name) {
    throw new Error('Project name is required');
  }

  await createProject(headers, name);
  revalidatePath('/app');
};

export const deleteProjectAction = async (projectId: string) => {
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }

  await removeProject(headers, projectId);
  revalidatePath('/app');
};
