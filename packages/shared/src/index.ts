export type Project = {
  projectId: string;
  name: string;
  createdAt: string;
  ownerId: string;
};

export type ProjectCreateInput = {
  name: string;
};

export type ApiError = {
  message: string;
  requestId?: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};

export const createProjectId = (): string => {
  return crypto.randomUUID();
};

export const normalizeName = (value: string): string => value.trim();

export const isNonEmpty = (value: string): boolean => value.trim().length > 0;

// ── Member types ──────────────────────────────────────────────────────

export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';
export type MemberStatus = 'active' | 'invited' | 'suspended';

export type MemberProfile = {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  lastActiveAt?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  workspaceId: string;
};

export type MemberProfileUpdateInput = {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
};

export type MemberRoleUpdateInput = {
  role: MemberRole;
};

export type MemberInviteInput = {
  email: string;
  role?: MemberRole;
};

export const createMemberId = (): string => {
  return crypto.randomUUID();
};
