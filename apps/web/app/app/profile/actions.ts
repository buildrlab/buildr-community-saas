'use server';

import { revalidatePath } from 'next/cache';

import { updateProfile } from '@/lib/api';
import { getServerAuthHeaders, hasAuth } from '@/lib/auth';

export const updateProfileAction = async (formData: FormData) => {
  const displayName = String(formData.get('displayName') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }
  if (!displayName) {
    throw new Error('Display name is required');
  }

  await updateProfile(headers, { displayName, bio: bio || undefined });
  revalidatePath('/app/profile');
};
