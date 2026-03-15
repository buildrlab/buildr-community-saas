'use server';

import type { MemberRole } from '@buildrlab/shared';
import { revalidatePath } from 'next/cache';

import { inviteMember, removeMember, updateMemberProfile, updateMemberRole } from '@/lib/api';
import { getServerAuthHeaders, hasAuth } from '@/lib/auth';

const DEFAULT_WORKSPACE_ID = 'default';

export const updateProfileAction = async (
  workspaceId: string,
  userId: string,
  formData: FormData,
) => {
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }

  const displayName = String(formData.get('displayName') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const website = String(formData.get('website') ?? '').trim();
  const skillsRaw = String(formData.get('skills') ?? '').trim();
  const skills = skillsRaw
    ? skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  await updateMemberProfile(headers, workspaceId || DEFAULT_WORKSPACE_ID, userId, {
    displayName: displayName || undefined,
    bio: bio || undefined,
    location: location || undefined,
    website: website || undefined,
    skills,
  });

  revalidatePath('/app/members');
};

export const updateRoleAction = async (
  workspaceId: string,
  userId: string,
  formData: FormData,
) => {
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }

  const role = String(formData.get('role') ?? '').trim() as MemberRole;

  if (!role) {
    throw new Error('Role is required');
  }

  await updateMemberRole(headers, workspaceId || DEFAULT_WORKSPACE_ID, userId, { role });

  revalidatePath('/app/members');
};

export const removeMemberAction = async (workspaceId: string, userId: string) => {
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }

  await removeMember(headers, workspaceId || DEFAULT_WORKSPACE_ID, userId);

  revalidatePath('/app/members');
};

export const inviteMemberAction = async (workspaceId: string, formData: FormData) => {
  const headers = await getServerAuthHeaders();

  if (!hasAuth(headers)) {
    throw new Error('Unauthorized');
  }

  const email = String(formData.get('email') ?? '').trim();
  const role = String(formData.get('role') ?? '').trim() as MemberRole | '';

  if (!email) {
    throw new Error('Email is required');
  }

  await inviteMember(headers, workspaceId || DEFAULT_WORKSPACE_ID, email, role || undefined);

  revalidatePath('/app/members');
};
